import { moduleFor, test } from 'ember-qunit';

moduleFor('route:preprints/provider/notifications', 'Unit | Route | preprints/provider/notifications', {
    // Specify the other units that are required for this test.
    needs: [
        'service:theme',
        'service:metrics',
    ],
});

test('notifications route exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});
