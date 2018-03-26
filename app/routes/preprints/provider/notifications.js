import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    theme: service(),

    model() {
        const providerId = this.get('theme.id');
        const subscriptionId = `${providerId}_new_pending_submissions`;
        return this.get('store').query('subscription', {
            filter: {
                id: subscriptionId,
            },
        });
    },
});
