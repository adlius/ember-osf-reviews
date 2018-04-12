import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('contributor-list', 'Integration | Component | contributor-list', {
    integration: true,
    beforeEach() {
        const contributorList = () => ({
            data: [
                EmberObject.create({ // Records to be returned by queryHasMany
                    users: {
                        givenName: 'Brian',
                        familyName: 'Nosek',
                        profileURL: 'https://osf.io/12345',
                    },
                    unregisteredContributor: null,
                    bibliographic: true,
                }), EmberObject.create({
                    unregisteredContributor: 'Unregistered Contributor',
                    bibliographic: true,
                }),
            ],
            links: {
                next: null,
            },
            toArray() {
                return this.data;
            },
        });

        const submission = EmberObject.create({
            content: {
                queryHasMany: contributorList,
            },
        });

        this.set('preprint', submission);
    },
});


test('it renders contributor-list', function(assert) {
    this.render(hbs`{{contributor-list contributors=null submission=preprint}}`);

    assert.ok(this.$('ul').length);
    assert.equal(
        this.$('ul').text().replace(/\s+/g, ' ').trim(),
        'Brian Nosek ' +
        'Unregistered Contributor',
    );
});
