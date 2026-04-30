## Context

The `HyperLinkCardEndpoint.getHyperLinkDetail()` endpoint currently validates the `url` query parameter using `PathUtils.isAbsoluteUri(url)`. This rejects relative paths such as `/archives/hello-world`, which are commonly used for internal links within a Halo site. Users expect internal links to also render rich card metadata.

Halo provides `ExternalUrlSupplier` (`run.halo.app.infra.ExternalUrlSupplier`) which supplies the site's configured external URL (e.g., `https://example.com`). This can be used to resolve relative URLs into absolute ones before proceeding with metadata fetching.

## Goals / Non-Goals

**Goals:**
- Accept relative URLs in the link detail API
- Resolve relative URLs against the site's external URL
- Preserve existing absolute URL behavior unchanged

**Non-Goals:**
- Change parser logic or caching behavior
- Support protocol-relative URLs (`//example.com/path`)
- Support path-only resolution for the frontend Web Components

## Decisions

### 1. Where to resolve relative URLs

**Decision:** Resolve in `HyperLinkCardEndpoint.getHyperLinkDetail()` before passing the URL to `HyperLinkCardService`.

**Rationale:**
- The endpoint is the system boundary for the API request; normalizing input there keeps downstream code simple
- `ExternalUrlSupplier` is a dependency that the endpoint can easily inject
- Parsers remain agnostic to whether the original URL was relative or absolute

### 2. How to detect relative paths

**Decision:** After retrieving the raw `url` query parameter, check if it is an absolute URI. If not, treat it as relative and resolve it against `externalUrlSupplier.get()`.

**Rationale:**
- `PathUtils.isAbsoluteUri()` is already used in the codebase and is the consistent way to check
- `URI.resolve(relative)` is the standard JDK mechanism for resolving relative URIs against a base

### 3. What to do if external URL is unavailable

**Decision:** Fall back to rejecting the request with `ServerWebInputException("Invalid url.")` if the external URL cannot be determined.

**Rationale:**
- Without a base URL, relative paths cannot be resolved meaningfully
- This maintains the existing error behavior for truly invalid input

## Risks / Trade-offs

- **[Risk]** A malformed relative path could produce an unexpected resolved URL.  
  **→ Mitigation:** `URI.resolve()` follows RFC 2396 rules; the resulting URI is still validated by `isAbsoluteUri` before proceeding.
- **[Risk]** External URL configuration may not match the actual access URL (e.g., behind reverse proxy).  
  **→ Trade-off accepted:** This is a site configuration issue outside the plugin's control; the resolved URL will use whatever Halo's `ExternalUrlSupplier` reports.

## Migration Plan

No migration needed. This is a backward-compatible enhancement:
- Existing absolute URL requests are unaffected
- Previously rejected relative URLs now work

## Open Questions

- None.
