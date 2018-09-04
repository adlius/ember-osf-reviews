import { computed } from '@ember/object';
import Component from '@ember/component';


const PreprintFileBrowserItem = Component.extend({
    classNames: ['col-xs-2'],
    localClassNames: ['preprint-file-browser-item'],
    localClassNameBindings: ['isPrimary:primary', 'isSelected:selected'],

    file: null,
    selected: true,
    isPrimary: false,

    icon: computed('file', function() {
        return {
            file: 'fa-file-text',
            folder: 'fa-folder',
        }[this.get('file.kind')];
    }),

    click() {
        if (!this.attrs.selectFile) return;
        this.attrs.selectFile(this.get('file'));
    },
});

PreprintFileBrowserItem.reopenClass({
    positionalParams: ['file'],
});

export default PreprintFileBrowserItem;
