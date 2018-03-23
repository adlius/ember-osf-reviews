import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
    i18n: service(),

    frequencyLabel: {
        instant: 'components.notificationListRow.instant',
        daily: 'components.notificationListRow.daily',
        never: 'components.notificationListRow.never',
    },

    currentSettingLabel: computed('subscription.frequency', function () {
        let frequency = this.get('subscription.frequency');
        if (frequency === 'instant'){
            return this.get('frequencyLabel.instant');
        }
        if (frequency === 'daily'){
            return this.get('frequencyLabel.daily');
        }
        if (frequency === 'none'){
            return this.get('frequencyLabel.never');
        }
    }),

    actions:{
        updateFrequency: function (frequency) {
            let subscription = this.get('subscription');
            subscription.set('frequency', frequency);
            subscription.save()
        }
    }
});
