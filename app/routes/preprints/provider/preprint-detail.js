import { isArray } from '@ember/array';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';


export default Route.extend(ConfirmationMixin, {
    theme: service(),

    model(params) {
        return { preprintId: params.preprint_id };
    },

    setupController(controller, model) {
        this._super(...arguments);
        controller.get('fetchData').perform(model.preprintId);
    },

    renderTemplate(controller, model) {
        // We're a special page.
        // Render into the applications outlet rather than the `provider` outlet.
        this.render(this.routeName, {
            controller,
            into: 'application',
            model,
        });
    },

    actions: {
        error(error) {
            if (error && error.errors && isArray(error.errors)) {
                return this.intermediateTransitionTo('page-not-found');
            }
        },
        willTransition(transition) {
            if (this.isPageDirty()) {
                this.controller.set('showWarning', true);
                this.controller.set('previousTransition', transition);
                transition.abort();
            }
        },
    },

    isPageDirty() {
        // If true, shows a confirmation message when leaving the page
        // True if the reviewer has any unsaved changes including comment edit or state change.
        return this.controller.get('userHasEnteredReview');
    },
});
