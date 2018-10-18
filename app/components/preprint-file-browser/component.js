import Component from '@ember/component';

export default Component.extend({
    pageNumber: 0,
    selectedFile: null,
    primaryFile: null,

    localClassNames: 'preprint-file-browser',
});
