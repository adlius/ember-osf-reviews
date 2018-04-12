import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import Controller from '@ember/controller';
import { getOwner } from '@ember/application';
import OSFAgnosticAuthControllerMixin from 'ember-osf/mixins/osf-agnostic-auth-controller';

/**
 * @module ember-osf-reviews
 * @submodule controllers
 */

/**
 * @class Application Controller
 * @extends Ember-OSF.OSFAgnosticAuthControllerMixin
 */
export default Controller.extend(OSFAgnosticAuthControllerMixin, {
    i18n: service(),
    theme: service(),
    navigator: service(),
    // This is needed as `provider-service` instance is not accessible in application.hbs, where we use the `new-osf-navbar` component.
    // Therefore, we need to get the `documentType` directly from i18n service.
    documentType: computed('i18n', function () {
        const locale = getOwner(this).factoryFor(`locale:${this.get('i18n.locale')}/translations`).class;
        return get(locale, 'documentType.preprint');
    }),
});
