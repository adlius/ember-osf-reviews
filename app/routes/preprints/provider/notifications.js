import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    theme: service(),

    model(params) {
        let provider_id = this.get('theme.id');
        let subscription_id = `${provider_id}_new_pending_submissions`;
        return this.get('store').query('subscription', {
            filter:{
                id: subscription_id,
            }
        });
    },
});
