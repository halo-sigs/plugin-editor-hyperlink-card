## ADDED Requirements

### Requirement: Timeout exceptions are handled gracefully
The system SHALL map timeout-related exceptions from WebClient requests to a client-friendly error response.

#### Scenario: Read timeout on link detail request
- **WHEN** the backend fetches metadata for a URL and the target service does not respond within the configured timeout
- **THEN** the API SHALL return HTTP 400 with the message "Request to target service timed out."
- **AND** the exception SHALL be logged at WARN level, not ERROR

#### Scenario: Connect timeout on link detail request
- **WHEN** the backend cannot establish a connection to the target service
- **THEN** the API SHALL return HTTP 400 with the message "Request to target service timed out."
- **AND** the exception SHALL be logged at WARN level, not ERROR

#### Scenario: Normal target service error is not affected
- **WHEN** the target service returns an HTTP error (e.g., 404 or 403)
- **THEN** the existing error handling behavior SHALL remain unchanged
