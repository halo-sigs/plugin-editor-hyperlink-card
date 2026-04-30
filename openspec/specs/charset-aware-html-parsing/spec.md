## ADDED Requirements

### Requirement: HTML response body is decoded using the declared charset
The system SHALL decode the HTTP response body using the charset specified in the `Content-Type` header when fetching HTML pages for metadata extraction.

#### Scenario: Server declares non-UTF-8 charset
- **WHEN** the target server returns `Content-Type: text/html; charset=GB18030`
- **THEN** the system SHALL decode the response body using `GB18030`
- **AND** extracted title and meta tags SHALL be correctly encoded

#### Scenario: Server declares UTF-8 charset
- **WHEN** the target server returns `Content-Type: text/html; charset=utf-8`
- **THEN** the system SHALL decode the response body using `UTF-8`

#### Scenario: Server does not declare a charset
- **WHEN** the target server returns `Content-Type: text/html` without a charset parameter
- **THEN** the system SHALL fall back to `UTF-8`
