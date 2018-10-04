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
});
