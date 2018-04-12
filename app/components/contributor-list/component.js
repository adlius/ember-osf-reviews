import { filterBy } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';


export default Component.extend({
    store: service(),

    tagName: 'ul',

    bibliographicContributors: filterBy('contributorsList', 'bibliographic', true),

    didReceiveAttrs() {
        this.set('contributorsList', this.get('contributors') || []);
        if (!this.get('contributors.length') || this.get('contributors.content.meta.total') > this.get('contributors.length')) {
            this.get('fetchData').perform();
        }
    },

    fetchData: task(function* () {
        const submission = this.get('submission.content');
        const query = {
            'page[size]': 100,
            page: 1,
        };

        let response = yield this.get('loadContributors').perform(submission, query);

        while (response.links.next) {
            query.page++;
            response = yield this.get('loadContributors').perform(submission, query);
        }
    }),

    loadContributors: task(function* (submission, query) {
        const results = yield submission.queryHasMany('contributors', query);
        this.get('contributorsList').pushObjects(results.toArray());
        return results;
    }),
});
