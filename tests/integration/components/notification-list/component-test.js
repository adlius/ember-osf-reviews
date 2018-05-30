import EmberService from '@ember/service';
import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const storeStub = EmberService.extend({
    findRecord() {
        return EmberObject.create({
            frequency: 'none',
            eventName: 'new_pending_submissions',
        });
    },
});

moduleForComponent('notification-list', 'Integration | Component | notification-list', {
    integration: true,
    beforeEach() {
        this.register('service:store', storeStub);
        this.inject.service('store', { as: 'store' });
    },
});

test('it renders', function(assert) {
    this.set('model', {});
    this.render(hbs`{{notification-list model=model}}`);
    assert.ok(this.$('.notification-title').length);
});
