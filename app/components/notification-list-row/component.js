import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

const notificationOptions = [
    {
        label: 'components.notificationListRow.instant',
        value: 'instant',
    },
    {
        label: 'components.notificationListRow.daily',
        value: 'daily',
    },
    {
        label: 'components.notificationListRow.never',
        value: 'none',
    },
];

export default Component.extend({
    i18n: service(),
    toast: service(),

    notificationOptions,
    currentSettingLabel: computed('subscription.frequency', function () {
        const frequency = this.get('subscription.frequency');
        return this.get('notificationOptions').findBy('value', frequency).label;
    }),

    updateFrequency: task(function* (frequency) {
        const subscription = this.get('subscription');
        try {
            subscription.set('frequency', frequency);
            if (subscription.changedAttributes()) {
                yield subscription.save();
            }
        } catch (e) {
            subscription.rollbackAttributes();
            this.get('toast').error(this.get('i18n').t('components.notificationListRow.errorUpdating'));
        }
    }).enqueue(),
});
