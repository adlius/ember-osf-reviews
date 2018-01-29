import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import ENV from 'reviews/config/environment';


export default Controller.extend({
    i18n: service(),
    toast: service(),

    // Defaults
    reviewsWorkflow: 'pre-moderation',
    reviewsCommentsPrivate: true,
    reviewsCommentsAnonymous: true,

    providerSettings: computed('model', 'reviewsCommentsPrivate', function() {
        const settings = ENV.PROVIDER_SETTINGS.map(this._buildSetting.bind(this));
        // Tie anon comments to private comments
        settings[2].disabled = this.get('reviewsCommentsPrivate');
        return settings;
    }),

    hasPermission: computed('model.permissions', function () {
        return this.get('model.permissions').includes('set_up_moderation');
    }),

    actions: {
        cancel() {
            this.transitionToRoute('index');
            return false;
        },
        submit() {
            ENV.PROVIDER_SETTINGS.forEach((setting) => {
                this.set(`model.${setting.name}`, this.get(setting.name));
            });

            // Ignore the value of anon comments if private comments
            // are enabled
            if (this.get('reviewsCommentsPrivate')) {
                this.set('reviewsCommentsAnonymous', true);
            }

            this.get('model').save()
                .then(this._toSettings.bind(this))
                .catch(this._submitFailed.bind(this));
        },
    },

    _t(key, tpl = {}) {
        return this.get('i18n').t(`providerSettings.${key}`, tpl);
    },

    _buildOption(setting, option) {
        return {
            value: option,
            title: this._t(`${setting.name}.options.${option}.title`),
            description: this._t(`${setting.name}.options.${option}.description`),
        };
    },

    _buildSetting(setting) {
        return {
            disabled: setting.disabled,
            attributeName: setting.name,
            title: this._t(`${setting.name}.title`),
            description: this._t(`${setting.name}.description`),
            options: setting.options.map(this._buildOption.bind(this, setting)),
        };
    },

    _submitFailed() {
        this.get('model').rollbackAttributes();

        this.get('toast').error(
            this.get('i18n').t('setup.error.message').toString(),
            this.get('i18n').t('setup.error.title').toString(),
        );
    },

    _toSettings() {
        this.transitionToRoute('preprints.provider.settings', this.get('model'));
    },
});
