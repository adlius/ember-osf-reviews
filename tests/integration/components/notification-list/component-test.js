import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


const themeStub = Service.extend({
    id: 'OSF',
    name: 'Open Science Framework',
});

moduleForComponent('notification-list', 'Integration | Component | notification-list', {
    integration: true,
    beforeEach() {
        this.register('service:theme-service', themeStub);
        // Calling inject puts the service instance in the context of the test,
        // making it accessible as "theme" within each test
        this.inject.service('theme-service', { as: 'theme' });
    },
});

test('it renders', function(assert) {
    this.set('subscriptions', {});
    this.render(hbs`{{notification-list subscriptions=subscriptions}}`);
    assert.ok(this.$('.notification-list-body').length);
});
