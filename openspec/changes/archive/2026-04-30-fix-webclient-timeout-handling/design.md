## Context

The `HyperLinkCardEndpoint` delegates to `HyperLinkCardService`, which uses `HyperLinkParser` implementations to fetch remote page metadata. All parsers create a `WebClient` via `HttpClientFactory` and perform HTTP requests without any timeout-specific error handling.

When the target service is slow or unresponsive, the underlying Netty `ReadTimeoutException` (configured as 10s in `HttpClientFactory`) bubbles up as a `WebClientRequestException` and is handled by Spring's default error handler as an unhandled exception, producing a `500 Internal Server Error` response and an ERROR-level log.

## Goals / Non-Goals

**Goals:**
- Map timeout-related exceptions to a meaningful `4xx` client error instead of `500`.
- Avoid ERROR-level logging for expected transient timeout failures.

**Non-Goals:**
- Change the 10-second timeout duration.
- Add retry logic.
- Modify the Web Component or editor UI error handling (the Svelte component already handles fetch failures gracefully).

## Decisions

### 1. Where to catch and map the exception

**Decision:** Catch in each parser's `parse()` or `getHyperLinkDetail()` method using Reactor's `.onErrorMap()`.

**Rationale:**
- Each parser is an independent strategy; keeping error handling close to the WebClient call is explicit and easy to follow.
- A shared utility would add indirection for a 3-line operation. If more parsers are added later, extracting a helper is trivial.

**Alternatives considered:**
- Centralized exception handler (`@ControllerAdvice` or custom `WebExceptionHandler`): Rejected because the plugin is a Halo extension, and global handlers may interfere with other plugins or Halo core. Local handling is safer and more explicit.

### 2. Which exceptions to map

**Decision:** Map `ReadTimeoutException` and `ConnectTimeoutException` (both from `io.netty.handler.timeout`).

**Rationale:**
- `ReadTimeoutException` is the specific case reported in the issue.
- `ConnectTimeoutException` is semantically similar (target service unreachable) and should be treated the same way.
- Other `WebClientResponseException`s (e.g., HTTP 404 from the target) are already handled correctly by `.retrieve()` and should not be masked.

### 3. Target exception type and message

**Decision:** Map to `ServerWebInputException("Request to target service timed out.")`.

**Rationale:**
- `ServerWebInputException` is a Spring `ResponseStatusException` with a default status of `400 Bad Request`. It signals that the request failed due to an issue with the provided input (the URL points to an unresponsive service), not a server-side bug.
- Spring WebFlux logs `ResponseStatusException` at WARN level by default, satisfying the requirement to avoid ERROR logs.
- A clear message helps API consumers (and the frontend) understand the failure cause.

## Risks / Trade-offs

- **[Risk]** Wrapping too aggressively could hide legitimate server-side network issues.  
  **→ Mitigation:** Only map timeout-specific Netty exceptions; let all other exceptions propagate as before.
- **[Risk]** `ServerWebInputException` returns `400`, which some may consider inappropriate for a timeout.  
  **→ Trade-off accepted:** `400` is more appropriate than `500` because the failure is caused by the user-provided URL. `504 Gateway Timeout` was considered but rejected because the plugin is not acting as a gateway/proxy in the HTTP sense; it is fetching metadata on behalf of the editor.

## Migration Plan

No migration needed. This is a backward-compatible behavioral fix:
- Existing successful requests are unaffected.
- Previously failing requests (timeouts) now return `400` with a clear message instead of `500`.

## Open Questions

- None.
