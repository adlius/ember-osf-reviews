import { Promise as EmberPromise } from 'rsvp';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import { ArrayPromiseProxy, loadRelation } from 'ember-osf/utils/load-relationship';

const PAGE_SIZE = 6;


export default Component.extend({
    pageNumber: 0,
    selectedFile: null,
    primaryFile: null,

    localClassNames: 'preprint-file-browser',

    hasAdditionalFiles: gt('files.length', 1),

    hasPrev: computed('pageNumber', function() {
        return this.get('pageNumber') > 0;
    }),

    hasNext: computed('pageNumber', function() {
        return (this.get('pageNumber') + 1) * PAGE_SIZE < this.get('files.length');
    }),

    fileIsPrimary: computed('selectedFile', 'primaryFile', function() {
        return this.get('selectedFile') === this.get('primaryFile');
    }),

    files: computed('preprint', function() {
        const promise = this.getWithDefault('preprint.node.files', new EmberPromise(() => null))
            .then(providers => providers.findBy('name', 'osfstorage'))
            .then(provider => loadRelation(provider, 'files'));
        return ArrayPromiseProxy.create({ promise });
    }),

    page: computed('files.[]', 'pageNumber', function() {
        const offset = this.get('pageNumber') * PAGE_SIZE;
        return this.get('files').slice(offset, offset + PAGE_SIZE);
    }),

    didReceiveAttrs() {
        this.set('selectedFile', this.get('primaryFile'));
    },

    actions: {
        page(incr) {
            this.incrementProperty('pageNumber', incr);
        },
        selectFile(file) {
            this.set('selectedFile', file);
        },
    },
});
