import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import moment from 'moment';
import { task } from 'ember-concurrency';

import latestAction from 'reviews/utils/latest-action';

const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const submittedOnLabel = {
    gtDay: 'components.moderationListRow.submission.submittedOn',
    ltDay: 'components.moderationListRow.submission.submitted',
};

const ACTION_LABELS = Object.freeze({
    [ACCEPTED]: {
        gtDay: 'components.moderationListRow.submission.acceptedOn',
        ltDay: 'components.moderationListRow.submission.accepted',
        gtDay_automatic: 'components.moderationListRow.submission.acceptedAutomaticallyOn',
        ltDay_automatic: 'components.moderationListRow.submission.acceptedAutomatically',
    },
    [REJECTED]: {
        gtDay: 'components.moderationListRow.submission.rejectedOn',
        ltDay: 'components.moderationListRow.submission.rejected',
    },
});


export default Component.extend({
    theme: service(),
    i18n: service(),

    classNames: ['moderation-list-row'],

    latestActionCreator: computed.alias('latestAction.creator.fullName'),

    noActions: computed.not('submission.reviewActions.length'),

    // latest action attempted on the preprint
    latestAction: computed('submission.reviewActions.[]', function() {
        return latestAction(this.get('submission.reviewActions'));
    }),

    // first three contributors to the preprint
    firstContributors: computed('submission.contributors', function() {
        return this.get('submission.contributors').slice(0, 3);
    }),

    // count of contributors in-addition to the first three
    additionalContributors: computed('submission.contributors', function() {
        return this.get('submission.contributors.content.meta.total') - 3;
    }),

    // translations for moderator action label
    reviewedOnLabel: computed('submission.{reviewsState,dateLastTransitioned}', 'noActions', 'latestActionCreator', function() {
        const i18n = this.get('i18n');
        const [acceptedRejectedDate, gtDay] = this.formattedDateLabel(this.get('submission.dateLastTransitioned'));
        const dayValue = gtDay ? 'gtDay' : 'ltDay';
        const timeWording = this.get('noActions') ? `${dayValue}_automatic` : dayValue;
        const status = this.get('submission.reviewsState');
        const labels = ACTION_LABELS[status][timeWording];
        return i18n.t(labels, { timeDate: acceptedRejectedDate, moderatorName: this.get('latestActionCreator') });
    }),

    // translations for submitted on label
    submittedOnLabel: computed('submission.dateCreated', function() {
        const i18n = this.get('i18n');
        const [submitDate, gtDaySubmit] = this.formattedDateLabel(this.get('submission.dateCreated'));
        const dayValue = gtDaySubmit ? 'gtDay' : 'ltDay';
        const labels = submittedOnLabel[dayValue];
        return i18n.t(labels, { timeDate: submitDate });
    }),

    didReceiveAttrs() {
        this.iconClass = {
            accepted: 'fa-check-circle-o accepted',
            pending: 'fa-hourglass-o pending',
            rejected: 'fa-times-circle-o rejected',
        };
        this.get('fetchData').perform();
    },

    formattedDateLabel(rawDate) {
        const gtDayAgo = moment().diff(rawDate, 'days') > 1;
        const formattedDate = gtDayAgo ?
            moment(rawDate).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(rawDate), Date.now())).fromNow();
        return [formattedDate, gtDayAgo];
    },

    fetchData: task(function* () {
        yield this.get('submission.contributors');
        yield this.get('submission.reviewActions');
    }),
});
