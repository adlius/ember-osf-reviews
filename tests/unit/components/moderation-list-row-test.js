import { run } from '@ember/runloop';
import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleForComponent('moderation-list-row', 'Unit | Component | moderation list row', {

    unit: true,
    needs: [
        'model:review-action',
        'model:user',
        'model:preprint',
        'model:preprint-provider',
        'service:i18n',
        'service:theme',
    ],
});

test('noActions computed property', function(assert) {
    this.inject.service('store');

    run(() => {
        const component = this.subject();
        assert.ok(component);
        const action1 = this.store.createRecord('review-action', {
            fromState: 'rejected',
            toState: 'accepted',
            dateModified: '2017-10-29T14:57:35.949534Z',
            creator: { fullName: 'Kung-fu Panda' },
            comment: 'test comment 1',
        });

        const action2 = this.store.createRecord('review-action', {
            fromState: 'pending',
            toState: 'rejected',
            dateModified: '2017-10-28T14:57:35.949534Z',
            creator: { fullName: 'Kung-fu Panda' },
            comment: 'test comment 2',
        });
        const reviewActions = [action1, action2];
        const submission = this.store.createRecord('preprint', { reviewActions });
        component.setProperties({ submission });
        assert.ok(!component.get('noActions'));
        component.set('submission.reviewActions', []);
        assert.ok(component.get('noActions'));
    });
});

test('latestActionCreator computed property', function(assert) {
    this.inject.service('store');

    run(() => {
        const component = this.subject();
        assert.ok(component);
        const action1 = this.store.createRecord('review-action', {
            fromState: 'rejected',
            toState: 'accepted',
            dateModified: '2017-10-29T14:57:35.949534Z',
            creator: { fullName: 'Po' },
            comment: 'test comment 1',
        });

        const action2 = this.store.createRecord('review-action', {
            fromState: 'pending',
            toState: 'rejected',
            dateModified: '2017-10-28T14:57:35.949534Z',
            creator: { fullName: 'Kung-fu Panda' },
            comment: 'test comment 2',
        });
        const reviewActions = [action1, action2];
        const submission = this.store.createRecord('preprint', { reviewActions });
        component.setProperties({ submission });
        assert.strictEqual(component.get('latestAction'), action1);
        assert.strictEqual(component.get('latestActionCreator'), action1.creator.fullName);
    });
});
