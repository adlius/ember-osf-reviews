import { computed } from '@ember/object';
import { alias, empty, not, equal } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import $ from 'jquery';
import config from 'ember-get-config';


export default Service.extend({
    i18n: service(),
    store: service(),

    provider: null,
    reviewableStatusCounts: null,
    request: null,

    id: alias('provider.id'),
    domain: alias('provider.domain'),
    isLoaded: empty('provider'),
    isProvider: not('isNotProvider'),
    isNotProvider: equal('provider.id', 'OSF'),

    signupUrl: computed('id', function() {
        const query = $.param({
            campaign: `${this.get('id')}-reviews`,
            next: window.location.href,
        });

        return `${config.OSF.url}register?${query}`;
    }),

    baseServiceUrl: computed('isProvider', 'domain', 'id', function() {
        let baseURL = '/';

        if (!this.get('domain')) {
            baseURL += 'preprints/';
            if (this.get('provider.id')) {
                baseURL += `${this.get('provider.id')}/`;
            }
        } else {
            baseURL = this.get('domain').replace(/\/?$/, '/');
        }
        return baseURL;
    }),

    loadProvider(id) {
        return this.get('store').findRecord(
            'preprint-provider',
            id.toLowerCase(),
            {
                reload: true,
                backgroundReload: false,
                adapterOptions: { query: { related_counts: true } },
            },
        ).then(this._onProviderLoad.bind(this));
    },

    _onProviderLoad(provider) {
        this.set('provider', provider);
        this.set('reviewableStatusCounts', provider.get('reviewableStatusCounts'));
        this.get('store').query(
            'preprint-request',
            {
                providerId: provider.id,
                'meta[requests_state_counts]': true,
            },
        ).then(this._setRequestStatusCounts.bind(this));

        this.get('i18n').addGlobals({
            provider: {
                id: this.get('provider.id'),
                name: this.get('provider.name'),
            },
        });
        return provider;
    },

    _setRequestStatusCounts(response) {
        this.set('requestStatusCounts', response.meta.requests_state_counts);
    },
});
