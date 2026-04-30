## ADDED Requirements

### Requirement: Relative URLs are resolved before metadata extraction
The system SHALL accept relative URLs in the link detail API and resolve them against the site's external URL.

#### Scenario: Relative path provided
- **WHEN** the API receives a relative URL such as `/archives/hello-world`
- **THEN** the system SHALL resolve it against the external URL from `ExternalUrlSupplier`
- **AND** proceed with metadata extraction using the resolved absolute URL

#### Scenario: Absolute URL provided
- **WHEN** the API receives an absolute URL such as `https://example.com/page`
- **THEN** the system SHALL proceed without modification
- **AND** metadata extraction uses the original URL

#### Scenario: Invalid relative path with no external URL configured
- **WHEN** the API receives a relative URL and the external URL cannot be determined
- **THEN** the system SHALL return `400 Bad Request` with "Invalid url."
