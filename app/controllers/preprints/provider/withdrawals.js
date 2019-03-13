import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import QueryParams from 'ember-parachute';
import { task } from 'ember-concurrency';

import Analytics from 'ember-osf/mixins/analytics';


export const moderationQueryParams = new QueryParams({
    page: {
        defaultValue: 1,
        refresh: true,
    },
    sort: {
        defaultValue: '-date_last_transitioned',
        refresh: true,
    },
    status: {
        defaultValue: 'pending',
        refresh: true,
    },
});

export default Controller.extend(Analytics, moderationQueryParams.Mixin, {
    store: service(),
    theme: service(),

    actions: {
        statusChanged(status) {
            this.resetQueryParams(['page']);
            this.set('status', status);
        },
        pageChanged(page) {
            this.set('page', page);
        },
        sortChanged(sort) {
            this.resetQueryParams(['page']);
            this.set('sort', sort);
        },
    },

    setup({ queryParams }) {
        this.get('fetchData').perform(queryParams);
    },

    queryParamsDidChange({ shouldRefresh, queryParams }) {
        if (shouldRefresh) {
            this.get('fetchData').perform(queryParams);
        }
    },

    reset(isExiting) {
        if (isExiting) {
            this.resetQueryParams();
        }
    },

    fetchData: task(function* (queryParams) {
        const providerId = this.get('theme.provider.id');
        const response = yield this.get('store').query(
            'preprint-request',
            {
                providerId,
                filter: {
                    machine_state: queryParams.status,
                },
                'meta[requests_state_counts]': true,
                embed: 'target',
                sort: queryParams.sort,
                page: queryParams.page,
            },
        );
        this.get('theme').set('requestStatusCounts', response.meta.requests_state_counts);
        this.set('results', {
            requests: response.toArray(),
            totalPages: Math.ceil(response.meta.total / response.meta.per_page),
        });
    }),
});
