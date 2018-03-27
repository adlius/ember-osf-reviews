import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { serviceLinks } from 'ember-osf/const/service-links';
import { task } from 'ember-concurrency';

export default Component.extend({
    store: service(),

    serviceLinks,
    classNames: ['content'],

    init() {
        this._super(...arguments);
        this.get('fetchData').perform(this.get('model.providerId'), this.get('model.subscriptionId'));
    },

    fetchData: task(function* (providerId, subscriptionId) {
        const subscriptions = yield this.get('store').findRecord('subscription', subscriptionId);
        this.set('subscriptions', [subscriptions]);
    }),
});
