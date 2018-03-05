import { run } from '@ember/runloop';
import { moduleFor } from 'ember-qunit';
import EmberService from '@ember/service';
import test from 'ember-sinon-qunit/test-support/test';
import tHelper from 'ember-i18n/helper';

// Stub i18n service
const i18nStub = EmberService.extend({
    t(key) {
        const translated = {
            'providerSettings.reviewsWorkflow.title': 'Moderation Type',
            'providerSettings.reviewsWorkflow.description': '',
            'providerSettings.reviewsCommentsPrivate.title': 'Comment Visibility',
            'providerSettings.reviewsCommentsPrivate.description': 'Moderators can add comments when making a decision about a submission.',
            'providerSettings.reviewsCommentsAnonymous.title': 'Moderator Comments',
            'providerSettings.reviewsCommentsAnonymous.description': 'If moderators\' comments are visible to contributors, the moderator\'s name can can be displayed or hidden from the contributors.',
        };
        return translated[key];
    },
});

moduleFor('controller:preprints/provider/setup', 'Unit | Controller | preprints/provider/setup', {
    needs: [
        'model:preprint-provider',
        'service:i18n',
        'service:metrics',
        'service:toast',
    ],
    beforeEach() {
        this.registry.register('helper:t', tHelper);
        this.register('service:i18n', i18nStub);
    },
});

test('Initial properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        reviewsWorkflow: 'pre-moderation',
        reviewsCommentsPrivate: true,
        reviewsCommentsAnonymous: true,
    };

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});

test('providerSettings computed property', function (assert) {
    this.inject.service('store');

    const ctrl = this.subject();

    run(() => {
        const model = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        ctrl.setProperties({ model });

        ctrl.set('reviewsCommentsPrivate', false);

        const expected =
            [
                { disabled: false, attributeName: 'reviewsWorkflow', options: ['pre-moderation', 'post-moderation'] },
                { disabled: false, attributeName: 'reviewsCommentsPrivate', options: [true, false] },
                { disabled: false, attributeName: 'reviewsCommentsAnonymous', options: [true, false] },
            ];

        const actual = ctrl.get('providerSettings');

        for (let i = 0; i < 3; i++) {
            assert.ok(actual[i].disabled === expected[i].disabled);
            assert.ok(actual[i].attributeName === expected[i].attributeName);
            assert.deepEqual(actual[i].disabled, expected[i].disabled);
        }
    });
});

test('cancel action', function (assert) {
    const ctrl = this.subject();

    const stub = this.stub(ctrl, 'transitionToRoute');
    ctrl.send('cancel');
    assert.ok(stub.calledWithExactly('index'), 'correct arguments passed to transitionToRoute');
});

test('submit action', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();
    run(() => {
        const model = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
            save() {
                return new Promise(function(resolve, reject) {
                    reject(new Error('something bad happened'));
                });
            },
        });

        ctrl.setProperties({ model });

        ctrl.set('reviewsWorkflow', true);
        ctrl.set('reviewsCommentsPrivate', false);
        ctrl.set('reviewsCommentsAnonymous', false);

        ctrl.send('submit');

        assert.strictEqual(ctrl.get('model.reviewsCommentsPrivate'), ctrl.get('reviewsCommentsPrivate'));
        assert.strictEqual(ctrl.get('model.reviewsWorkflow'), ctrl.get('reviewsWorkflow'));
        assert.strictEqual(ctrl.get('model.reviewsCommentsAnonymous'), ctrl.get('reviewsCommentsAnonymous'));

        ctrl.set('reviewsCommentsPrivate', true);
        ctrl.send('submit');
        assert.ok(ctrl.get('reviewsCommentsAnonymous'));
    });
});

test('_toSettings function', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();
    run(() => {
        const model = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
            save() {
                return new Promise(function (resolve, reject) {
                    reject(new Error('something bad happened'));
                });
            },
        });
        ctrl.setProperties({ model });
        const stub = this.stub(ctrl, 'transitionToRoute');
        ctrl._toSettings();
        assert.ok(stub.calledWithExactly('preprints.provider.settings', ctrl.get('model')));
    });
});
