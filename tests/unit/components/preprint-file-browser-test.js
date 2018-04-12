import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';


moduleForComponent('preprint-file-browser', 'Unit | Component | preprint file browser', {
    unit: true,
    needs: [
        'model:preprint',
        'model:preprint-provider',
        'model:file-provider',
        'model:file',
    ],
});

test('hasPrev computed property', function(assert) {
    const component = this.subject();
    assert.ok(component);

    component.set('pageNumber', 0);
    assert.ok(!component.get('hasPrev'));

    component.set('pageNumber', 4);
    assert.ok(component.get('hasPrev'));
});

test('hasNext computed property', function(assert) {
    const component = this.subject();
    assert.ok(component);
    component.set('pageNumber', 1);

    component.set('files', ['f1', 'f2', 'f3']);
    assert.ok(!component.get('hasNext'));

    component.set('files', ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7']);
    assert.ok(!component.get('hasNext'));
});

test('fileIsPrimary computed property', function(assert) {
    const component = this.subject();
    assert.ok(component);
    component.set('selectedFile', 'f1');

    component.set('primaryFile', 'f1');
    assert.ok(component.get('fileIsPrimary'));
});

test('page computed property', function(assert) {
    const component = this.subject();
    assert.ok(component);
    component.set('pageNumber', 1);

    component.set('files', ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7']);
    assert.deepEqual(component.get('page'), ['f7']);

    component.set('pageNumber', 2);
    assert.deepEqual(component.get('page'), []);
});

test('didReceiveAttrs function', function(assert) {
    const component = this.subject();
    assert.ok(component);
    component.set('pageNumber', 1);

    component.set('selectedFile', 'f1');

    component.set('primaryFile', 'f2');
    assert.ok(component.get('selectedFile') !== component.get('primaryFile'));

    component.didReceiveAttrs();
    assert.strictEqual(component.get('selectedFile'), component.get('primaryFile'));
});

test('page action', function(assert) {
    const component = this.subject();
    assert.ok(component);
    component.set('pageNumber', 1);

    component.send('page', 5);
    assert.strictEqual(component.get('pageNumber'), 6);
});

test('selectFile action', function(assert) {
    const component = this.subject();
    assert.ok(component);

    component.set('selectedFile', 'f1');
    component.send('selectFile', 'f2');

    assert.strictEqual(component.get('selectedFile'), 'f2');
});
