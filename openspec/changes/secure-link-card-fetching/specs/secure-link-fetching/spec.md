## Purpose

Keep new link cards independent of anonymous server-side fetching while allowing administrators to explicitly enable compatible legacy fetching.

## ADDED Requirements

### Requirement: Public fetching is explicitly enabled
The public API SHALL deny fetching by default, including missing or failed settings. Administrators SHALL optionally enable an exact-host allowlist; when enabled an empty list denies all destinations. Initial URLs, provider API targets and redirects SHALL obey the policy before outbound access. Basic URL and address safety SHALL remain enabled in every mode.

#### Scenario: Default installation or upgrade
- **WHEN** no new online-fetch setting has been saved
- **THEN** public metadata requests are rejected without resolving or fetching the target

#### Scenario: Optional whitelist
- **WHEN** online fetching is enabled and the whitelist is disabled
- **THEN** safe public targets are allowed

#### Scenario: Redirect outside whitelist
- **WHEN** an allowed target redirects to an unlisted host
- **THEN** the redirected destination is not fetched

### Requirement: Editor fetching is separately authorized
The Console API SHALL require a separately assignable fetch permission. UI controls and automatic fetching SHALL respect that permission; manual card editing SHALL remain available without it. Explicit refresh SHALL fetch fresh metadata rather than reuse stale cache.

#### Scenario: Unprivileged editor
- **WHEN** an editor without fetch permission converts a link
- **THEN** a static editable card is inserted without a metadata request and refresh is disabled

### Requirement: Cards persist snapshots
New cards SHALL persist explicit snapshot mode and fetched custom metadata, including incomplete or failed results. Refresh SHALL replace metadata in one undoable operation, preserve old values on failure and mark successful old-card refreshes as snapshots. Committing a changed URL SHALL clear stale metadata and fetch once if permitted. Switching display styles SHALL preserve the snapshot and all metadata. Responses SHALL not overwrite a deleted or edited target or another selected card.

#### Scenario: Incomplete metadata
- **WHEN** the target has no description or image
- **THEN** the saved snapshot renders without any public metadata request

#### Scenario: Stale request
- **WHEN** the target card changes or is removed while a request is pending
- **THEN** the response does not overwrite another card or newer edits

### Requirement: Legacy cards degrade gracefully
Both block and inline components SHALL only fetch unmarked cards when page configuration enables online fetching. They SHALL show existing custom data or a clickable URL when fetching is disabled or fails. Editor previews SHALL never call the public endpoint.

#### Scenario: Legacy compatibility enabled
- **WHEN** online fetching is enabled
- **THEN** eligible legacy cards fetch while snapshot cards continue displaying saved metadata
