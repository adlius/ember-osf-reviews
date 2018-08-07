import PreprintDetail from '../provider/preprint-detail'

export default PreprintDetail.extend({
    setupController(controller, model) {
        let detailController = this.controllerFor('preprints.provider.preprint-detail');
        detailController.set('isPendingWithdrawal', false);
        detailController.get('fetchData').perform(model.preprintId, true);
    },
    renderTemplate(controller, model) {
        // We're a special page.
        // Render into the applications outlet rather than the `provider` outlet.
        let detailController = this.controllerFor('preprints.provider.preprint-detail');
        this.render('preprints.provider.preprint-detail', {
            detailController,
            into: 'application',
            model,
        });
    },
});
