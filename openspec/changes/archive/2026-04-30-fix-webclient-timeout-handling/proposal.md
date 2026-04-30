## Why

When `WebClient` requests time out (e.g., `ReadTimeoutException`), the unhandled exception propagates to Spring's default error handler, resulting in a `500 Internal Server Error` response. This is misleading because the failure is caused by the target service, not the Halo server itself. Additionally, the timeout is logged at ERROR level, polluting logs with expected transient failures when fetching external links.

## What Changes

- Catch timeout-related exceptions (`ReadTimeoutException`, `WriteTimeoutException`, `ConnectTimeoutException`) in `HyperLinkDefaultParser` and map them to a meaningful `ServerWebInputException` with a clear message (e.g., "Request to target service timed out").
- Ensure timeout exceptions are logged at `WARN` level instead of `ERROR`.
- Apply the same timeout handling to other parsers (`HyperLinkBilibiliParser`, `HyperLinkQQMusicParser`) if they share the same `WebClient` call pattern.
- Return `400 Bad Request` (via `ServerWebInputException`) to the client instead of `500 Internal Server Error`.

## Capabilities

### New Capabilities

- `timeout-error-handling`: Graceful handling of WebClient timeout exceptions with appropriate HTTP status codes and log levels.

### Modified Capabilities

- *(none — this is purely a backend behavior fix with no spec-level requirement changes)*

## Impact

- **Backend API** (`HyperLinkDefaultParser`, `HyperLinkBilibiliParser`, `HyperLinkQQMusicParser`): Exception handling logic added around `WebClient` calls.
- **No UI or Web Component changes** required.
- **Response status**: `500` → `400` for timeout scenarios.
- **Log level**: `ERROR` → `WARN` for timeout scenarios.
