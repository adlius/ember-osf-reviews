import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('notification-list-row', 'Integration | Component | notification-list-row', {
    integration: true,
});


test('it renders notification-list-row', function(assert) {
    this.set('subscription', {
        eventName: 'new_pending_submissions',
        frequency: 'instant',
    });
    this.render(hbs`{{notification-list-row subscription=subscription}}`);
    assert.equal(this.$('.dropdown-toggle').text(), ' Instant ');
    this.set('subscription', {
        eventName: 'new_pending_submissions',
        frequency: 'daily',
    });
    assert.equal(this.$('.dropdown-toggle').text(), ' Daily ');
    this.set('subscription', {
        eventName: 'new_pending_submissions',
        frequency: 'none',
    });
    assert.equal(this.$('.dropdown-toggle').text(), ' Never ');
});
