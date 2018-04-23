import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('moderation-list-row', 'Integration | Component | moderation-list-row', {
    integration: true,
});


test('it renders moderation-list-row accepted with reviewActions', function(assert) {
    this.set('submission', {
        dateCreated: '2017-10-27T19:14:27.816946Z',
        reviewActions: [
            EmberObject.create({
                fromState: 'pending',
                toState: 'accepted',
                dateModified: '2017-10-28T14:57:35.949534Z',
                creator: { fullName: 'Kung-fu Panda' },
            }),
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Viper' },
            }),
        ],
        reviewsState: 'accepted',
        contributors: [{ users: { fullName: 'Viper' } }, { users: { fullName: 'Oogway' } }],
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.ok(this.$('[data-status=accepted]').length);
    assert.notOk(this.$('[data-status=pending]').length);
    assert.notOk(this.$('[data-status=rejected]').length);

    assert.equal(this.$('[data-status=accepted]').text().replace(/\s+/g, ' ').trim(), 'Submitted on October 27, 2017 by' +
        ' Viper Oogway Accepted Invalid date by Kung-fu Panda');
});

test('it renders moderation-list-row accepted without reviewActions', function(assert) {
    this.set('submission', {
        dateCreated: '2017-10-27T19:14:27.816946Z',
        dateLastTransitioned: '2017-10-28T19:14:27.816946Z',
        reviewActions: [],
        reviewsState: 'accepted',
        contributors: [{ users: { fullName: 'Viper' } }],
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=accepted]').text().replace(/\s+/g, ' ').trim(), 'Submitted on October 27, 2017 by Viper' +
        ' Accepted automatically on October 28, 2017');
});

test('it renders moderation-list-row rejected with reviewActions', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-28T19:14:27.816946Z',
        dateCreated: '2017-10-27T19:14:27.816946Z',
        reviewActions: [
            EmberObject.create({
                fromState: 'pending',
                toState: 'rejected',
                dateModified: '2017-10-28T14:57:35.949534Z',
                creator: { fullName: 'Master Shifu' },
            }),
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Mantis' },
            }),
        ],
        reviewsState: 'rejected',
        contributors: [{ users: { fullName: 'Mr. Ping' } }],
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=rejected]').text().replace(/\s+/g, ' ').trim(), 'Submitted on October 27, 2017 by Mr. Ping ' +
        'Rejected on October 28, 2017 by Master Shifu');
});

test('it renders moderation-list-row pending with reviewActions', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-26T19:14:27.816946Z',
        dateCreated: '2017-10-26T19:14:27.816946Z',
        reviewActions: [
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Mantis' },
            }),
        ],
        reviewsState: 'pending',
        contributors: [{ users: { fullName: 'Mr. Ping' } }, { users: { fullName: 'Mantis' } }],
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=pending]').text().replace(/\s+/g, ' ').trim(), 'Submitted on October 26, 2017 by Mr. Ping Mantis');
});

test('it renders moderation-list-row pending with reviewActions and more than three contributors', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-12-26T19:14:27.816946Z',
        dateCreated: '2017-12-26T19:14:27.816946Z',
        reviewActions: [
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Mantis' },
            }),
        ],
        reviewsState: 'pending',
        contributors: [
            { users: { fullName: 'Mr. Ping' } },
            { users: { fullName: 'Mantis' } },
            { users: { fullName: 'Crane' } },
            { users: { fullName: 'Tai Lung' } },
        ],
    });
    this.set('submission.contributors.content', {
        meta: { total: this.get('submission.contributors.length') },
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=pending]').text().replace(/\s+/g, ' ').trim(), 'Submitted on December 26, 2017 by Mr. Ping Mantis Crane + 1');
});
