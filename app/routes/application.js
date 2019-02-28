import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

import OSFAgnosticAuthRouteMixin from 'ember-osf/mixins/osf-agnostic-auth-route';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Application Route Handler
 */
export default Route.extend(OSFAgnosticAuthRouteMixin, {
    i18n: service(),
    session: service(),
    currentUser: service(),

    beforeModel() {
        this._super(...arguments);
        const availableLocales = this.get('i18n.locales').toArray();
        let locale;

        if (navigator.languages && navigator.languages.length) {
            // Works in Chrome and Firefox (editable in settings)
            for (const lang of navigator.languages) {
                if (availableLocales.includes(lang)) {
                    locale = lang;
                    break;
                }
            }
        } else if (navigator.language && availableLocales.includes(navigator.language)) {
            // Backup for Safari (uses system settings)
            locale = navigator.language;
        }

        if (locale) {
            this.set('i18n.locale', locale);
        }

        // Check permissions
        if (!this.get('session.isAuthenticated')) {
            this.replaceWith('index');
        } else {
            return this.get('currentUser.user').then(this._checkUserPermission.bind(this));
        }
    },

    _checkUserPermission(user) {
        if (!user.get('canViewReviews')) {
            this.replaceWith('index');
        }
    },
});
