import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';


moduleFor('service:theme', 'Unit | Service | theme', {
    needs: [
        'service:i18n',
        'locale:en/translations',
        'locale:en/config',
        'util:i18n/missing-message',
        'util:i18n/compile-template',
        'config:environment',
    ],
    beforeEach() {
        // set the locale and the config
        getOwner(this).lookup('service:i18n').set('locale', 'en');
        this.register('locale:xy/config', localeConfig);

        // register t helper
        this.register('helper:t', tHelper);
    },
});

test('_onProviderLoad', function(assert) {
    const service = this.subject();
    const fakeProvider = EmberObject.create({
        reviewableStatusCounts: {
            pending: 2,
            accepted: 1,
            rejected: 3,
            initial: 0,
        },
        id: 'OSF',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        domain: '',
    });

    assert.strictEqual(service.provider, null);
    assert.strictEqual(service.reviewableStatusCounts, null);

    service._onProviderLoad(fakeProvider);
    assert.strictEqual(fakeProvider.get('id'), service.get('id'));
    assert.strictEqual(fakeProvider.get('reviewableStatusCounts'), service.get('reviewableStatusCounts'));
});

test('signupUrl computed property', function(assert) {
    const service = this.subject();
    const provider = EmberObject.create({
        id: 'OSF',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        domain: '',
    });
    service.setProperties({ provider });
    const signUrl = decodeURIComponent(service.get('signupUrl')).split('&next=');
    assert.strictEqual(signUrl[0], 'http://localhost:5000/register?campaign=OSF-reviews');
});

test('baseServiceUrl computed property', function (assert) {
    const service = this.subject();
    const provider = EmberObject.create({
        id: 'pandaXriv',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        domain: 'pandaXriv.com',
    });
    service.setProperties({ provider });
    assert.strictEqual(service.get('baseServiceUrl'), 'pandaXriv.com/');

    service.set('provider.domain', '');
    assert.strictEqual(service.get('baseServiceUrl'), '/preprints/pandaXriv/');
});
