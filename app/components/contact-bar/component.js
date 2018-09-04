import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    localClassNames: 'contact-bar',
    classNames: ['reviews-contact-bar'],

    // Show language asking for feedback instead of setting up a provider
    feedback: null,

    keys: computed('feedback', function() {
        const key = this.get('feedback') ? 'feedback' : 'startService';
        return {
            title: `contactBar.${key}.title`,
            paragraph: `contactBar.${key}.paragraph`,
            button: `contactBar.${key}.button`,
        };
    }),
});
