import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const frequencyLabel = {
    instant: 'components.notificationListRow.instant',
    daily: 'components.notificationListRow.daily',
    never: 'components.notificationListRow.never',
};

export default Component.extend({
    i18n: service(),

    currentSettingLabel: computed('subscription.frequency', function () {
        const frequency = this.get('subscription.frequency');
        if (frequency === 'instant') {
            return frequencyLabel.instant;
        }
        if (frequency === 'daily') {
            return frequencyLabel.daily;
        }
        if (frequency === 'none') {
            return frequencyLabel.never;
        }
    }),

    actions: {
        updateFrequency: (frequency) => {
            const subscription = this.get('subscription');
            subscription.set('frequency', frequency);
            subscription.save();
        },
    },
});
