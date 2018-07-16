/* eslint-disable ember/named-functions-in-promises */
// Putting the lines after wait() into a named function is not really helpful for tests' readability
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import styles from 'reviews/components/preprint-status-banner/styles';


moduleForComponent('preprint-status-banner', 'Integration | Component | preprint-status-banner', {
    integration: true,
});

test('it renders preprint-status-banner pre-moderation', function(assert) {
    this.set('submitDecision', () => {});
    this.set('setUserEnteredReview', () => {});
    this.set('savingAction', false);
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        reviewActions: new Promise(function(resolve) { resolve([]); }),
        reviewsState: 'pending',
        isPublished: false,
        provider: { reviewsWorkflow: 'pre-moderation' },
        node: { contributors: [{ users: { fullName: 'Mr. Ping' } }, { users: { fullName: 'Mantis' } }] },
    });
    this.render(hbs`{{preprint-status-banner submission=submission saving=savingAction setUserEnteredReview=setUserEnteredReview submitDecision=submitDecision}}`);
    return wait()
        .then(() => {
            assert.ok(this.$(`.${styles['flex-container']}`).length);
            assert.equal(
                this.$(`.${styles['reviewer-feedback']}`).text().replace(/\s+/g, ' ').trim(),
                'Make decision Submit your decision Comments are visible to contributors on decision Commenter\'s name' +
                ' is visible to contributors Submission appears in search results once accepted Accept submission Submission will' +
                ' appear in search results and be made public. Reject submission Submission will not appear in search results and' +
                ' will remain private. Submit decision',
            );
            assert.equal(
                this.$(`.${styles['recent-activity']}`).text().replace(/\s+/g, ' ').trim(),
                'This was submitted on October 27, 2017',
            );
            assert.equal(this.$(`.${styles['status-explanation']}`).text().replace(/\s+/g, ' ').trim(), 'pending');

            this.set('submission.isPublished', true);
            this.set('submission.reviewsState', 'accepted');

            assert.equal(
                this.$(`.${styles['recent-activity']}`).text().replace(/\s+/g, ' ').trim(),
                'This was automatically accepted on October 27, 2017',
            );
            assert.equal(
                this.$(`.${styles['reviewer-feedback']}`).text().replace(/\s+/g, ' ').trim(),
                'Modify decision Modify your decision Comments are visible to contributors on decision Commenter\'s' +
                ' name is visible to contributors Submission appears in search results once accepted Accept submission Submission' +
                ' will appear in search results and be made public. Reject submission Submission will not appear in search results' +
                ' and will remain private. Modify decision Cancel',
            );
            assert.equal(this.$(`.${styles['status-explanation']}`).text().replace(/\s+/g, ' ').trim(), 'accepted');
        });
});

test('it renders preprint-status-banner post-moderation', function(assert) {
    this.set('submitDecision', () => {});
    this.set('setUserEnteredReview', () => {});
    this.set('savingAction', false);
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        reviewActions: new Promise(function(resolve) { resolve([]); }),
        reviewsState: 'pending',
        isPublished: true,
        provider: { reviewsWorkflow: 'post-moderation' },
        node: { contributors: [{ users: { fullName: 'Mr. Ping' } }, { users: { fullName: 'Mantis' } }] },
    });

    this.render(hbs`{{preprint-status-banner submission=submission saving=savingAction setUserEnteredReview=setUserEnteredReview submitDecision=submitDecision}}`);
    return wait()
        .then(() => {
            assert.ok(this.$(`.${styles['flex-container']}`).length);

            /* Test for Pending */
            assert.equal(
                this.$(`.${styles['reviewer-feedback']}`).text().replace(/\s+/g, ' ').trim(),
                'Make decision Submit your decision Comments are visible to contributors on decision Commenter\'s name' +
                ' is visible to contributors Submission will be removed from search results and made private if rejected' +
                ' Accept submission Submission will continue to appear in search results. Withdraw submission Submission will no longer be publicly' +
                ' available. Submit decision',
            );
            assert.equal(
                this.$(`.${styles['recent-activity']}`).text().replace(/\s+/g, ' ').trim(),
                'This was submitted on October 27, 2017',
            );
            assert.equal(this.$(`.${styles['status-explanation']}`).text().replace(/\s+/g, ' ').trim(), 'pending');

            /* Test for Accepted */
            this.set('submission.reviewsState', 'accepted');

            assert.equal(
                this.$(`.${styles['recent-activity']}`).text().replace(/\s+/g, ' ').trim(),
                'This was automatically accepted on October 27, 2017',
            );
            assert.equal(
                this.$(`.${styles['reviewer-feedback']}`).text().replace(/\s+/g, ' ').trim(),
                'Modify decision Modify your decision Comments are visible to contributors on decision Commenter\'s name' +
                ' is visible to contributors Submission will be removed from search results and made private if rejected' +
                ' Accept submission Submission will continue to appear in search results. Withdraw submission Submission will no longer be publicly' +
                ' available. Modify decision Cancel',
            );
            assert.equal(this.$(`.${styles['status-explanation']}`).text().replace(/\s+/g, ' ').trim(), 'accepted');
        });
});

test('it renders withdrawn', function(assert) {
    this.set('submitDecision', () => {});
    this.set('setUserEnteredReview', () => {});
    this.set('savingAction', false);
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        reviewActions: new Promise(function(resolve) { resolve([]); }),
        reviewsState: 'withdrawn',
        isPublished: true,
        provider: { reviewsWorkflow: 'post-moderation' },
        node: { contributors: [{ users: { fullName: 'Mr. Ping' } }, { users: { fullName: 'Mantis' } }] },
    });
    this.set('latestAction', {
        actionTrigger: 'withdraw',
        fromState: 'pending',
        toState: 'withdrawn',
        comment: 'this is a test reason',
    });

    this.render(hbs`{{preprint-status-banner submission=submission saving=savingAction setUserEnteredReview=setUserEnteredReview submitDecision=submitDecision latestAction=latestAction}}`);
    return wait()
        .then(() => {
            assert.ok(this.$(`.${styles['flex-container']}`).length);

            assert.equal(
                this.$(`.${styles['reviewer-feedback']}`).text().replace(/\s+/g, ' ').trim(),
                'View reason Reason for withdrawal this is a test reason',
            );
        });
});
/* eslint-enable ember/named-functions-in-promises */
