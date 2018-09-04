module.exports = {
    root: true,
    extends: '@centerforopenscience/eslint-config/ember',
    globals: {
        MathJax: true
    },
    rules: {
        'ember/avoid-leaking-state-in-components': ['error', [
            'localClassNames',
            'localClassNameBindings',
        ]],
    },
};
