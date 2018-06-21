/* eslint-env node */

module.exports = function(environment) {
    const authorizationType = 'cookie';

    const ENV = {
        modulePrefix: 'reviews',
        appName: 'Reviews',
        environment,
        rootURL: '/reviews/',
        locationType: 'auto',
        authorizationType,
        sentryDSN: 'http://test@localhost/80' || process.env.SENTRY_DSN,
        sentryOptions: {
            release: process.env.GIT_COMMIT,
        },
        'ember-simple-auth': {
            authorizer: `authorizer:osf-${authorizationType}`,
            authenticator: `authenticator:osf-${authorizationType}`,
        },
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
        },
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
        moment: {
            outputFormat: 'YYYY-MM-DD hh:mm a',
        },
        i18n: {
            defaultLocale: 'en',
        },
        metricsAdapters: [
            {
                name: 'GoogleAnalytics',
                environments: ['production'], // Add development to try/inspect in development.
                config: {
                    // Replace test id with process.env.GOOGLE_ANALYTICS_ID before committing.
                    // Use test id for local testing.
                    id: process.env.GOOGLE_ANALYTICS_ID,
                    // Use `analytics_debug.js` in development.
                    debug: environment === 'development',
                    // Use verbose tracing of GA events
                    trace: environment === 'development',
                    // Ensure development env hits aren't sent to GA.
                    sendHitTask: environment !== 'development',
                    setFields: {
                        // Ensure the IP address of the sender will be anonymized.
                        anonymizeIp: true,
                    },
                },
            },
        ],
        PROVIDER_SETTINGS: [{
            disabled: false,
            name: 'reviewsWorkflow',
            options: ['pre-moderation', 'post-moderation'],
        }, {
            disabled: false,
            name: 'reviewsCommentsPrivate',
            options: [true, false],
        }, {
            disabled: true,
            name: 'reviewsCommentsAnonymous',
            options: [true, false],
        }],
    };

    if (environment === 'development') {
        // Empty
    }

    if (environment === 'test') {
        // Empty
    }

    if (environment === 'production') {
        // Empty
    } else {
        // Empty
    }

    return ENV;
};
