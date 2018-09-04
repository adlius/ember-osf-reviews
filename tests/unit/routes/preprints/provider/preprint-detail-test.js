import { moduleFor, test } from 'ember-qunit';

moduleFor('route:preprints/provider/preprint-detail', 'Unit | Route | preprints/provider/preprint-detail', {
    // Specify the other units that are required for this test.
    needs: [
        'service:theme',
        'service:metrics',
        'service:currentUser',
        'service:session',
    ],
});

test('preprint-detail route exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});
