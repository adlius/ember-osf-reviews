import Route from '@ember/routing/route';

export default Route.extend({
    afterModel(model/* , transition */) {
        if (model.get('reviewsWorkflow')) {
            this.replaceWith('preprints.provider', model);
        }
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
});
