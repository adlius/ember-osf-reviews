import { computed } from '@ember/object';
import Component from '@ember/component';

const MESSAGES = {
    'not-found': 'components.errorPage.details.notFound',
    'not-authenticated': 'components.errorPage.details.notAuthenticated',
    forbidden: 'components.errorPage.details.forbidden',
    'not-setup': 'components.errorPage.details.notSetup',
};
const TITLES = {
    'not-found': 'components.errorPage.title.notFound',
    'not-authenticated': 'components.errorPage.title.notAuthenticated',
    forbidden: 'components.errorPage.title.forbidden',
    'not-setup': 'components.errorPage.title.notSetup',
};


export default Component.extend({
    classNames: ['content'],
    localClassNames: 'reviews-error-page',
    supportEmail: 'support@osf.io',

    errorMessage: computed('error', function() {
        return MESSAGES[this.get('error')];
    }),

    title: computed('error', function() {
        return TITLES[this.get('error')];
    }),
});
