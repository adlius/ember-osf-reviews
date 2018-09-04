import Component from '@ember/component';

export default Component.extend({
    tagName: 'section',
    localClassNames: 'form-block',
    classNameBindings: ['disabled'],

    title: null,
    disabled: false,
});
