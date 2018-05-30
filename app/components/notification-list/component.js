import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { serviceLinks } from 'ember-osf/const/service-links';
import { task } from 'ember-concurrency';

export default Component.extend({
    store: service(),
    theme: service(),
    classNames: ['content'],

    serviceLinks,

    didReceiveAttrs() {
        this._super(...arguments);
        const providerId = this.get('theme.id');
        const subscriptionId = `${providerId}_new_pending_submissions`;
        this.get('fetchData').perform(providerId, subscriptionId);
    },

    fetchData: task(function* (providerId, subscriptionId) {
        const subscriptions = yield this.get('store').findRecord('subscription', subscriptionId);
        this.set('subscriptions', [subscriptions]);
    }),
});
