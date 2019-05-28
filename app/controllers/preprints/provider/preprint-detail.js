import { computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import { task, waitForQueue } from 'ember-concurrency';
import $ from 'jquery';


const DATE_LABEL = {
    created: 'content.dateLabel.createdOn',
    submitted: 'content.dateLabel.submittedOn',
};
const PRE_MODERATION = 'pre-moderation';

/**
 * @module ember-osf-reviews
 * @submodule controllers
 */

/**
 * @class Moderation Detail Controller
 */
export default Controller.extend({
    i18n: service(),
    theme: service(),
    toast: service(),
    store: service(),

    queryParams: { chosenFile: 'file' },

    fullScreenMFR: false,
    savingAction: false,
    showLicense: false,
    isWithdrawn: false,
    withdrawalRequest: null,
    isPendingWithdrawal: false,
    userHasEnteredReview: false,
    showWarning: false,
    previousTransition: null,

    hasTags: bool('preprint.tags.length'),
    expandedAbstract: navigator.userAgent.includes('Prerender'),

    relevantDate: computed.alias('preprint.dateCreated'),

    dummyMetaData: computed(function() {
        return new Array(7);
    }),

    fileDownloadURL: computed('model', function() {
        const { location: { origin } } = window;
        return [
            origin,
            this.get('theme.id') !== 'osf' ? `preprints/${this.get('theme.id')}` : null,
            this.get('model.preprintId'),
            'download',
        ].filter(part => !!part).join('/');
    }),

    actionDateLabel: computed('preprint.provider.reviewsWorkflow', function() {
        return this.get('preprint.provider.reviewsWorkflow') === PRE_MODERATION ?
            DATE_LABEL.submitted :
            DATE_LABEL.created;
    }),

    hasShortenedDescription: computed('preprint.description', function() {
        const preprintDescription = this.get('preprint.description');

        return preprintDescription && preprintDescription.length > 350;
    }),

    useShortenedDescription: computed('expandedAbstract', 'hasShortenedDescription', function() {
        return this.get('hasShortenedDescription') && !this.get('expandedAbstract');
    }),

    description: computed('preprint.description', function() {
        // Get a shortened version of the abstract, but doesn't cut in the middle of word by going
        // to the last space.
        return this.get('preprint.description')
            .slice(0, 350)
            .replace(/\s+\S*$/, '');
    }),
    supplementalMaterialDisplayLink: computed('preprint.node.links.html', function() {
        const supplementalLink = this.get('preprint.node.links.html');
        if (supplementalLink) {
            return supplementalLink.replace(/^https?:\/\//i, '');
        }
    }),

    actions: {
        toggleShowLicense() {
            this.toggleProperty('showLicense');
        },
        expandMFR() {
            this.toggleProperty('fullScreenMFR');
        },
        expandAbstract() {
            this.toggleProperty('expandedAbstract');
        },
        leavePage() {
            const previousTransition = this.get('previousTransition');
            if (previousTransition) {
                this.set('userHasEnteredReview', false);
                this.set('showWarning', false);
                previousTransition.retry();
            }
        },
        submitReviewsDecision(trigger, comment, filter) {
            this.toggleProperty('savingAction');

            const action = this.store.createRecord('review-action', {
                actionTrigger: trigger,
                target: this.get('preprint'),
            });
            const actionType = 'reviews';

            if (comment) {
                action.comment = comment;
            }
            this._saveAction(action, actionType, filter);
        },
        submitRequestsDecision(trigger, comment, filter) {
            this.toggleProperty('savingAction');

            const action = this.store.createRecord('preprint-request-action', {
                actionTrigger: trigger,
                target: this.get('withdrawalRequest'),
            });
            const actionType = 'withdrawal';

            if (comment) {
                action.comment = comment;
            }
            this._saveAction(action, actionType, filter);
        },
    },

    _saveAction(action, actionType, filter) {
        if (actionType === 'withdrawal') {
            return action.save()
                .then(this._toRequestList.bind(this, { status: filter, page: 1, sort: '-date_last_transitioned' }))
                .catch(this._notifySubmitFailure.bind(this))
                .finally(() => this.set('savingAction', false));
        } else if (actionType === 'reviews') {
            return action.save()
                .then(this._toModerationList.bind(this, { status: filter, page: 1, sort: '-date_last_transitioned' }))
                .catch(this._notifySubmitFailure.bind(this))
                .finally(() => this.set('savingAction', false));
        }
    },

    _toRequestList(queryParams) {
        this.set('userHasEnteredReview', false);
        this.transitionToRoute('preprints.provider.withdrawals', { queryParams });
    },

    _toModerationList(queryParams) {
        this.set('userHasEnteredReview', false);
        this.transitionToRoute('preprints.provider.moderation', { queryParams });
    },

    _notifySubmitFailure() {
        this.get('toast').error(this.get('i18n').t('components.preprintStatusBanner.error'));
    },

    fetchData: task(function* (preprintId) {
        const response = yield this.get('store').findRecord(
            'preprint',
            preprintId,
            { include: ['node', 'license', 'review_actions', 'contributors'] },
        ).catch(() => this.replaceRoute('page-not-found'));

        this.set('preprint', response);
        if (response.get('dateWithdrawn') !== null) {
            this.set('isWithdrawn', true);
        }
        this.set('authors', response.get('contributors'));
        this.set('preprint', response);
        let withdrawalRequest = yield this.get('preprint.requests');
        withdrawalRequest = withdrawalRequest.toArray();
        if (withdrawalRequest.length >= 1 && withdrawalRequest[0].get('machineState') === 'pending') {
            this.set('withdrawalRequest', withdrawalRequest[0]);
            this.set('isPendingWithdrawal', true);
        } else {
            this.set('withdrawalRequest', null);
            this.set('isPendingWithdrawal', false);
        }
        this.get('loadMathJax').perform();
        // required for breadcrumbs
        this.set('model.breadcrumbTitle', response.get('title'));
    }),

    loadMathJax: task(function* () {
        if (!MathJax) return;
        yield waitForQueue('afterRender');
        yield MathJax.Hub.Queue(['Typeset', MathJax.Hub, [$('.abstract')[0], $('#preprintTitle')[0]]]);
    }),
});
