import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import styles from 'reviews/components/moderator-list-add/styles';


moduleForComponent('moderator-list-add', 'Integration | Component | moderator-list-add', {
    integration: true,
});

test('it renders moderator-list-add form no input', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('addModerator', function() { return true; });
    this.set('moderatorIds', ['12345']);

    this.render(hbs`{{moderator-list-add
                editingModerator=true
                addModerator=addModerator
                addingNewModerator=true
                moderatorIds=moderatorIds
                loadingModerators=false
                roleOptions=roleOptions
            }}`);

    assert.ok(this.$('.ember-basic-dropdown-trigger').length);
    assert.ok(this.$('.dropdown-button').length);
    assert.ok(this.$(`.${styles['row-controls']}`).length);
    assert.ok(this.$(`.${styles['row-controls']} > button[disabled].btn-success`).length);
    assert.ok(this.$(`.${styles['dropdown-link']}`).length);

    assert.notOk(this.$(`.${styles['invite-dropdown']}.open`).length);

    assert.equal(this.$('.dropdown-button').text().replace(/\s+/g, ' ').trim(), 'Role');
});

test('it renders moderator-list-add form valid input', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('addModerator', function() { return true; });
    this.set('moderatorIds', ['12345']);

    this.render(hbs`{{moderator-list-add
                editingModerator=true
                addModerator=addModerator
                addingNewModerator=true
                moderatorIds=moderatorIds
                loadingModerators=false
                roleOptions=roleOptions
            }}`);

    run(() => document.querySelector('#toggle-form').click());

    assert.ok(this.$('.ember-basic-dropdown-trigger').length);
    assert.ok(this.$('.dropdown-button').length);
    assert.ok(this.$(`.${styles['row-controls']}`).length);
    assert.ok(this.$(`.${styles['row-controls']} > button[disabled].btn-success`).length);
    assert.ok(this.$(`.${styles['dropdown-link']}`).length);

    assert.ok(this.$(`.${styles['invite-dropdown']}.open`).length);

    assert.equal(this.$('.dropdown-button').text().replace(/\s+/g, ' ').trim(), 'Role');
});
