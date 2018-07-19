import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import moment from 'moment';
import { task } from 'ember-concurrency';

import latestAction from 'reviews/utils/latest-action';

const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const submittedOnLabel = {
    gtDay: 'components.requestListRow.submission.requestedOn',
    ltDay: 'components.requestListRow.submission.requested',
};

const ACTION_LABELS = Object.freeze({
    [ACCEPTED]: {
        gtDay: 'components.requestListRow.submission.approvedOn',
        ltDay: 'components.requestListRow.submission.approved',
    },
    [REJECTED]: {
        gtDay: 'components.requestListRow.submission.declinedOn',
        ltDay: 'components.requestListRow.submission.declined',
    },
});


export default Component.extend({
    theme: service(),
    i18n: service(),

    localClassNames: ['moderation-list-row'],

    isWithdrawn: computed('request.machineState', function() {
        return this.get('request.machineState') === 'accepted';
    }),

    latestAction: computed('request.target.reviewActions.[]', function() {
        return latestAction(this.get('request.target.reviewActions'));
    }),

    latestActionCreator: computed.alias('latestAction.creator.fullName'),

    decisionOnLabel: computed('request.machineState', 'request.dateLastTransitioned', 'latestActionCreator', function() {
        const i18n = this.get('i18n');
        const [acceptedRejectedDate, gtDay] = this.formattedDateLabel(this.get('request.dateLastTransitioned'));
        const dayValue = gtDay ? 'gtDay' : 'ltDay';
        const status = this.get('request.machineState');
        const labels = ACTION_LABELS[status][dayValue];
        return i18n.t(labels, { timeDate: acceptedRejectedDate, moderatorName: this.get('latestActionCreator') });
    }),

    requestedOnLabel: computed('request.created', 'request.creator.fullnName', function() {
        const i18n = this.get('i18n');
        const [submitDate, gtDaySubmit] = this.formattedDateLabel(this.get('request.created'));
        const dayValue = gtDaySubmit ? 'gtDay' : 'ltDay';
        const labels = submittedOnLabel[dayValue];
        return i18n.t(labels, { timeDate: submitDate, submitterName: this.get('request.creator.fullName')});
    }),

    didReceiveAttrs() {
        this.iconClass = {
            accepted: 'fa-check-circle-o accepted',
            pending: 'fa-hourglass-o pending',
            rejected: 'fa-times-circle-o rejected',
        };
    },

    formattedDateLabel(rawDate) {
        const gtDayAgo = moment().diff(rawDate, 'days') > 1;
        const formattedDate = gtDayAgo ?
            moment(rawDate).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(rawDate), Date.now())).fromNow();
        return [formattedDate, gtDayAgo];
    },
});
