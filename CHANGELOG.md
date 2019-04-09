# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2019-04-09
### Added
- Preprint withdrawals

## [0.9.1] - 2019-03-11
### Fixed
- pass all links instead of just download link to file-renderer component

## [0.9.0] - 2019-03-04
### Changed
- return to pending list after moderation
- add service:current-user to unit test needs for:
  - moderation-list-row component unit test
  - moderator-list-row component unit test
  - preprint-status-banner component unit test
  - preprints/provider/setup controller unit test
- add missing `relevantDate` alias to preprints/provider/preprint-detail controller
- upgrade to ember-osf@0.23.0
- upgrade to osf-style@1.9.0

## [0.8.1] - 2018-12-13
### Changed
- update to ember-osf@0.22.1

## [0.8.0] - 2018-12-13
### Changed
- Upgraded osf-style to 1.8.0
- Make changes to ensure Reviews work with node-preprint divorce changes
  - Remove logic for additional files from `preprint-file-browser` component.
  - Modify `preprint-detail` view to maintain functional parity with detail page on Preprints app.

## [0.7.0] - 2018-09-04
### Added
- Custom dimensions to `trackPage` for Google Analytics
- Tombstone for withdrawn preprints
- Withdrawn section to moderation list
- Ability to withdraw from `preprint-detail` page

### Fixed
- Use `name` field for contributors on preprint-detail page
- Prevent banner from loading on `preprint-detail` page if preprint is undefined

## Changed
- Use Ember-CSS-Modules

## [0.6.1] - 2018-06-21
### Added
- `anonymizeIp: true` in GA config to anonymize sender IP.

### Changed
- Use 0.17.1 ember-osf

## [0.6.0] - 2018-05-29
### Added
- Moderator management page
- Moderator notification management page

### Fixed
- Prevent whitespace under banners

## [0.5.1] - 2018-04-24
### Changed
- Back to pinned osf-style commit

## [0.5.0] - 2018-04-24
### Added
- `preprintPendingDOIMinted` translation string to show message when DOI is being minted
- `mergedContext` function in `services/i18n.js` to fix interpolation for translation strings

### Changed
- ember-cli-moment-shim version to `^3.5.3` due to security issues found in `moment` versions before `2.19.3`
- Reviews to use ember-osf version of `queryHasMany`
- `osf-style` to use the latest version with navbar changes
- to use `provider-service` property `documentType` to unify translations of preprint words

### Removed
- Unneeded node calls to reflect divorce changes
- Some hacks in `applcation.js` that get translations for different preprint words.

## [0.4.2] - 2018-03-14
### Fixed
- Download links for moderators

## [0.4.1] - 2018-03-06
### Fixed
- Updating of decisions immediately after accepting or rejecting

## [0.4.0] - 2018-03-05
### Added
- Warning modal when navigating away with unsaved changes
- Route specific loading page for the moderation-detail page
- Tests for provider setup controller

### Changed
- Update language
  - Add `Submitted by` along with the `accepted by/rejected by` for the accepted/rejected records in the moderation list
  - Capitalize first letter (e.g `submitted by` to `Submitted by`)
- Upgraded ember-cli to 2.16.2

## [0.3.1] - 2018-03-01
### Added
- Tests for download URL for branded and un-branded providers

### Fixed
- Download URL on preprint-detail page to work for admin and moderators on pre-moderation

## [0.3.0] - 2018-01-10
### Changed
- Update `action` to `review-action` to reflect changes in OSF's API and ember-osf

## [0.2.1] - 2017-12-21
### Fixed
- Error on moderation list with automatically accepted submissions

## [0.2.0] - 2017-12-20
### Added
- Headless Firefox for tests
- Integration tests for
  - moderation-list-row component
  - action-feed component
  - action-feed-entry component
  - preprint-status-banner component
- Unit tests for
  - preprint-status-banner component
  - preprint-detail controller
  - provider setup controller
  - provider moderation controller
- Pending count on Reviews Dashboard
  - Skeleton screens for providers list

### Changed
- Remove global eslint rule and inline in router
- Update travis to use Firefox
- Update README
- Use .nvmrc file (for travis and local)
- Update yarn.lock
- Use COS ember-base image and multi-stage build
  - Notify DevOps prior to merging into master to update Jenkins
- Show moderator name (instead of creator) in the accepted/rejected records in the moderation list
- Update style/layout for Reviews to be more mobile friendly

### Removed
- Remove name link from action logs in the dashboard view

### Fixed
- Fix Loading indicator on Reviews dashboard which was not displaying when user clicks on see more link button.
- Add loading indicator for preprints titles on the Reviews dashboard.

## [0.1.1] - 2017-11-02
### Fixed
* Show most recent data after moderator makes a decision and looks at it immediately.
* Fix timezone issue on moderation list page.

## [0.1.0] - 2017-10-26
### Added
MVP release of Reviews!

* Allow provider admins to set up moderation, choosing a workflow and settings
* Allow moderators to view submissions by state (pending/accepted/rejected)
* Allow moderators to read submissions and accept/reject them with comment
