import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
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
});
