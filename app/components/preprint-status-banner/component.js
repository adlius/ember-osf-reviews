import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import latestAction from 'reviews/utils/latest-action';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';
const PENDING_WITHDRAWAL = 'pending_withdrawal';
const WITHDRAWN = 'withdrawn';

const PRE_MODERATION = 'pre-moderation';
const POST_MODERATION = 'post-moderation';

const COMMENT_LIMIT = 65535;

const ICONS = {
    [PENDING]: ['fa-hourglass-o'],
    [ACCEPTED]: ['fa-check-circle-o'],
    [REJECTED]: ['fa-times-circle-o'],
    [PENDING_WITHDRAWAL]: ['fa-hourglass-o'],
    [WITHDRAWN]: ['fa-circle-o', 'fa-minus inner-icon'],
};

const STATUS = {
    [PENDING]: 'components.preprintStatusBanner.pending',
    [ACCEPTED]: 'components.preprintStatusBanner.accepted',
    [REJECTED]: 'components.preprintStatusBanner.rejected',
    [PENDING_WITHDRAWAL]: 'components.preprintStatusBanner.pending',
    [WITHDRAWN]: 'components.preprintStatusBanner.withdrawn',
};

const MESSAGE = {
    [PRE_MODERATION]: 'components.preprintStatusBanner.message.pendingPre',
    [POST_MODERATION]: 'components.preprintStatusBanner.message.pendingPost',
    [ACCEPTED]: 'components.preprintStatusBanner.message.accepted',
    [REJECTED]: 'components.preprintStatusBanner.message.rejected',
    [PENDING_WITHDRAWAL]: 'components.preprintStatusBanner.message.pendingWithdrawal',
    [WITHDRAWN]: 'components.preprintStatusBanner.message.withdrawn',
};

const CLASS_NAMES = {
    [PRE_MODERATION]: 'preprint-status-pending-pre',
    [POST_MODERATION]: 'preprint-status-pending-post',
    [ACCEPTED]: 'preprint-status-accepted',
    [REJECTED]: 'preprint-status-rejected',
    [PENDING_WITHDRAWAL]: 'preprint-status-pending-withdrawal',
    [WITHDRAWN]: 'preprint-status-withdrawn',
};

const SETTINGS = {
    comments: {
        public: 'components.preprintStatusBanner.settings.comments.public',
        private: 'components.preprintStatusBanner.settings.comments.private',
    },
    names: {
        anonymous: 'components.preprintStatusBanner.settings.names.anonymous',
        named: 'components.preprintStatusBanner.settings.names.named',
    },
    moderation: {
        [PRE_MODERATION]: 'components.preprintStatusBanner.settings.moderation.pre',
        [POST_MODERATION]: 'components.preprintStatusBanner.settings.moderation.post',
    },
};

const SETTINGS_ICONS = {
    comments: {
        public: 'fa-eye',
        private: 'fa-eye-slash',
    },
    names: {
        anonymous: 'fa-user-secret',
        named: 'fa-user',
    },
    moderation: {
        [PRE_MODERATION]: 'fa-key',
        [POST_MODERATION]: 'fa-globe',
    },
};

const DECISION_EXPLANATION = {
    accept: {
        [PRE_MODERATION]: 'components.preprintStatusBanner.decision.accept.pre',
        [POST_MODERATION]: 'components.preprintStatusBanner.decision.accept.post',
    },
    reject: {
        [PRE_MODERATION]: 'components.preprintStatusBanner.decision.reject.pre',
        [POST_MODERATION]: 'components.preprintStatusBanner.decision.reject.post',
    },
    withdrawn: {
        [POST_MODERATION]: 'components.preprintStatusBanner.decision.withdrawn.post',
    },
};

const RECENT_ACTIVITY = {
    [PENDING]: 'components.preprintStatusBanner.recentActivity.pending',
    [ACCEPTED]: 'components.preprintStatusBanner.recentActivity.accepted',
    [REJECTED]: 'components.preprintStatusBanner.recentActivity.rejected',
    [PENDING_WITHDRAWAL]: 'components.preprintStatusBanner.recentActivity.pendingWithdrawal',
    [WITHDRAWN]: 'components.preprintStatusBanner.recentActivity.withdrawn',
    automatic: {
        [PENDING]: 'components.preprintStatusBanner.recentActivity.automatic.pending',
        [ACCEPTED]: 'components.preprintStatusBanner.recentActivity.automatic.accepted',
    },
};

export default Component.extend({
    i18n: service(),
    theme: service(),

    // translations
    moderator: 'components.preprintStatusBanner.decision.moderator',
    feedbackBaseMessage: 'components.preprintStatusBanner.decision.base',
    commentPlaceholder: 'components.preprintStatusBanner.decision.commentPlaceholder',
    labelAccept: 'components.preprintStatusBanner.decision.accept.label',
    labelReject: 'components.preprintStatusBanner.decision.reject.label',
    labelApprove: 'components.preprintStatusBanner.decision.approve.label',
    labelDecline: 'components.preprintStatusBanner.decision.decline.label',
    approveExplanation: 'components.preprintStatusBanner.decision.approve.explanation',
    declineExplanation: 'components.preprintStatusBanner.decision.decline.explanation',

    classNames: ['preprint-status-component'],

    loadingActions: true,
    noActions: false,

    // Submission form
    initialReviewerComment: '',
    reviewerComment: '',
    decision: ACCEPTED,
    decisionValueToggled: false,
    withdrawalJustification: alias('withdrawalRequest.comment'),

    reviewsWorkflow: alias('submission.provider.reviewsWorkflow'),
    reviewsCommentsPrivate: alias('submission.provider.reviewsCommentsPrivate'),
    reviewsCommentsAnonymous: alias('submission.provider.reviewsCommentsAnonymous'),

    creatorProfile: alias('latestAction.creator.profileURL'),
    creatorName: alias('latestAction.creator.fullName'),
    withdrawalRequesterProfile: alias('withdrawalRequest.creator.profileURL'),
    withdrawalRequesterName: alias('withdrawalRequest.creator.fullName'),

    commentExceedsLimit: computed.gt('reviewerComment.length', COMMENT_LIMIT),

    userActivity: computed.or('commentEdited', 'decisionValueToggled'),

    labelDate: computed('submission', function() {
        return this.get('submission.dateWithdrawn') ?
            this.get('submission.dateWithdrawn') :
            this.get('submission.dateLastTransitioned');
    }),

    labelDecision: computed('submission', function() {
        return this.get('submission.isPublished') ?
            'components.preprintStatusBanner.decision.withdrawn.label' :
            'components.preprintStatusBanner.decision.reject.label';
    }),

    radioDecision: computed('submission', function() {
        return this.get('submission.isPublished') ?
            'withdrawn' :
            'rejected';
    }),

    isDisabled: computed('latestAction', 'submission.reviewActions.isPending', function() {
        const reason = this.get('latestAction.comment');
        const type = this.get('submission.reviewsState');
        return ((type === 'withdrawn' && !reason) || this.get('submission.reviewActions.isPending'));
    }),

    commentLengthErrorMessage: computed('reviewerComment', function () {
        const i18n = this.get('i18n');
        return i18n.t('components.preprintStatusBanner.decision.commentLengthError', {
            limit: COMMENT_LIMIT,
            difference: Math.abs(COMMENT_LIMIT - this.get('reviewerComment.length')).toString(),
        });
    }),


    statusExplanation: computed('reviewsWorkflow', 'submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('isPendingWithdrawal')) {
            return MESSAGE[PENDING_WITHDRAWAL];
        }
        return this.get('submission.reviewsState') === PENDING ?
            MESSAGE[this.get('reviewsWorkflow')] :
            MESSAGE[this.get('submission.reviewsState')];
    }),

    status: computed('submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('isPendingWithdrawal')) {
            return STATUS[PENDING_WITHDRAWAL];
        } else {
            return STATUS[this.get('submission.reviewsState')];
        }
    }),

    icon: computed('submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('isPendingWithdrawal')) {
            return ICONS[PENDING_WITHDRAWAL];
        }
        return ICONS[this.get('submission.reviewsState')];
    }),

    requestActivityLanguage: computed('isPendingWithdrawal', function() {
        if (this.get('isPendingWithdrawal')) {
            return RECENT_ACTIVITY[PENDING_WITHDRAWAL];
        }
    }),

    recentActivityLanguage: computed('noActions', 'submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('noActions')) {
            return RECENT_ACTIVITY.automatic[this.get('submission.reviewsState')];
        } else {
            return RECENT_ACTIVITY[this.get('submission.reviewsState')];
        }
    }),


    getClassName: computed('reviewsWorkflow', 'submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('isPendingWithdrawal')) {
            return CLASS_NAMES[PENDING_WITHDRAWAL];
        } else {
            return this.get('submission.reviewsState') === PENDING ?
                CLASS_NAMES[this.get('reviewsWorkflow')] :
                CLASS_NAMES[this.get('submission.reviewsState')];
        }
    }),

    latestAction: computed('submission.reviewActions.[]', function() {
        if (this.get('submission.reviewActions.[]')) {
            return latestAction(this.get('submission.reviewActions'));
        }
        return null;
    }),

    noComment: computed('reviewerComment', function() {
        return isBlank(this.get('reviewerComment'));
    }),

    settingsComments: computed('reviewsCommentsPrivate', function() {
        const commentType = this.get('reviewsCommentsPrivate') ? 'private' : 'public';
        return SETTINGS.comments[commentType];
    }),
    settingsNames: computed('reviewsCommentsAnonymous', function() {
        const commentType = this.get('reviewsCommentsAnonymous') ? 'anonymous' : 'named';
        return SETTINGS.names[commentType];
    }),
    settingsModeration: computed('reviewsWorkflow', function() {
        return SETTINGS.moderation[this.get('reviewsWorkflow')];
    }),

    settingsCommentsIcon: computed('reviewsCommentsPrivate', function() {
        const commentType = this.get('reviewsCommentsPrivate') ? 'private' : 'public';
        return SETTINGS_ICONS.comments[commentType];
    }),
    settingsNamesIcon: computed('reviewsCommentsAnonymous', function() {
        const commentType = this.get('reviewsCommentsAnonymous') ? 'anonymous' : 'named';
        return SETTINGS_ICONS.names[commentType];
    }),
    settingsModerationIcon: computed('reviewsWorkflow', function() {
        return SETTINGS_ICONS.moderation[this.get('reviewsWorkflow')];
    }),

    acceptExplanation: computed('reviewsWorkflow', function() {
        return DECISION_EXPLANATION.accept[this.get('reviewsWorkflow')];
    }),

    rejectExplanation: computed('reviewsWorkflow', function() {
        if (this.get('reviewsWorkflow') === 'pre-moderation') {
            if (this.get('submission.reviewsState') === ACCEPTED) {
                return this.get('approveExplanation');
            } else {
                return DECISION_EXPLANATION.reject[this.get('reviewsWorkflow')];
            }
        } else {
            return DECISION_EXPLANATION.withdrawn[this.get('reviewsWorkflow')];
        }
    }),

    labelDecisionDropdown: computed('submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('submission.reviewsState') === 'withdrawn') {
            return 'components.preprintStatusBanner.decision.withdrawalReason';
        } else if (this.get('isPendingWithdrawal')) {
            return 'components.preprintStatusBanner.decision.makeDecision';
        } else {
            return this.get('submission.reviewsState') === PENDING ?
                'components.preprintStatusBanner.decision.makeDecision' :
                'components.preprintStatusBanner.decision.modifyDecision';
        }
    }),
    labelDecisionHeader: computed('submission.reviewsState', 'isPendingWithdrawal', function() {
        if (this.get('submission.reviewsState') === 'withdrawn') {
            return 'components.preprintStatusBanner.decision.header.withdrawalReason';
        } else if (this.get('isPendingWithdrawal')) {
            return 'components.preprintStatusBanner.decision.header.submitDecision';
        } else {
            return this.get('submission.reviewsState') === PENDING ?
                'components.preprintStatusBanner.decision.header.submitDecision' :
                'components.preprintStatusBanner.decision.header.modifyDecision';
        }
    }),
    labelDecisionBtn: computed('submission.reviewsState', 'decision', 'reviewerComment', 'isPendingWithdrawal', function() {
        if (this.get('isPendingWithdrawal')) {
            return 'components.preprintStatusBanner.decision.btn.submitDecision';
        } else if (this.get('submission.reviewsState') === PENDING) {
            return 'components.preprintStatusBanner.decision.btn.submitDecision';
        } else if (this.get('submission.reviewsState') !== this.get('decision')) {
            return 'components.preprintStatusBanner.decision.btn.modifyDecision';
        } else if (this.get('reviewerComment').trim() !== this.get('initialReviewerComment')) {
            return 'components.preprintStatusBanner.decision.btn.update_comment';
        }
        return 'components.preprintStatusBanner.decision.btn.modifyDecision';
    }),

    commentEdited: computed('reviewerComment', 'initialReviewerComment', function() {
        return this.get('reviewerComment').trim() !== this.get('initialReviewerComment');
    }),

    decisionChanged: computed('decision', 'submission.reviewsState', function() {
        return this.get('submission.reviewsState') !== this.get('decision');
    }),

    btnDisabled: computed('decisionChanged', 'commentEdited', 'saving', 'commentExceedsLimit', function() {
        return this.get('saving') || (!this.get('decisionChanged') && !this.get('commentEdited')) || this.get('commentExceedsLimit');
    }),

    didInsertElement() {
        this.get('submission.reviewActions')
            .then(latestAction)
            .then(this._handleActions.bind(this));
        return this._super(...arguments);
    },

    actions: {
        submit() {
            let trigger = '';
            if (this.get('submission.reviewsState') !== PENDING && (this.get('commentEdited') && !this.get('decisionChanged'))) {
                // If the submission is not pending,
                // the decision has not changed and the comment is edited.
                // the trigger would be 'edit_comment'
                trigger = 'edit_comment';
            } else {
                // Otherwise, meaning that if the moderator is not editing the comment
                let actionType = '';
                if (this.get('submission.isPublished') && this.get('isPendingWithdrawal')) {
                    // if the submission is published and is pending withdrawal.
                    // actionType would be 'reject'
                    // meaning moderators could accept/reject the withdrawl request
                    actionType = 'reject';
                } else if (this.get('submission.isPublished') && !this.get('isPendingWithdrawal')) {
                    // if the submission is published and is not pending withdrawal
                    // actionType would be 'withdraw'
                    // meaning moderators could approve/directly withdraw the submission
                    actionType = 'withdraw';
                } else {
                    // Otherwise
                    // actionType would be 'reject'
                    // meaning the moderator could either accept or reject the submission
                    actionType = 'reject';
                }
                // If the decision is to accept the submission or the withdrawal request,
                // the trigger is 'accept'
                // If not, then the trigger is whatever 'actionType' set above.
                trigger = this.get('decision') === ACCEPTED ? 'accept' : actionType;
            }

            let comment = '';
            if (trigger === 'accept' && this.get('isPendingWithdrawal')) {
                comment = this.get('withdrawalJustification').trim();
            } else {
                comment = this.get('reviewerComment').trim();
            }

            if (this.get('isPendingWithdrawal')) {
                this.get('submitRequestsDecision')(trigger, comment, 'pending');
            } else {
                this.get('submitReviewsDecision')(trigger, comment, 'pending');
            }
        },
        cancel() {
            this.set('decision', this.get('submission.reviewsState'));
            this.set('reviewerComment', this.get('initialReviewerComment'));
            this.get('setUserEnteredReview')(false);
        },
        decisionToggled() {
            this.get('setUserEnteredReview')(this.get('decisionChanged'));
        },
        commentChanged() {
            this.get('setUserEnteredReview')(this.get('commentEdited'));
        },
    },

    _handleActions(action) {
        if (action) {
            if (this.get('submission.reviewsState') !== PENDING) {
                const comment = action.get('comment');
                this.set('initialReviewerComment', comment);
                this.set('reviewerComment', comment);
                this.set('decision', this.get('submission.reviewsState'));
            } else {
                this.set('initialReviewerComment', '');
                this.set('reviewerComment', '');
                this.set('decision', ACCEPTED);
            }
            this.set('noActions', false);
        } else {
            this.set('noActions', true);
        }
        this.set('loadingActions', false);
    },
});
