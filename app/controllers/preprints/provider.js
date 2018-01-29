import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
    hasPermission: computed('model.permissions', function () {
        return this.get('model.permissions').includes('view_submissions');
    }),
});
