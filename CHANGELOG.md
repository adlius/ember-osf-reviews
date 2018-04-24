# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
