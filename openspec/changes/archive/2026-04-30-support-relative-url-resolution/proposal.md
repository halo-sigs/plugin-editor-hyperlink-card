## Why

When users insert internal links using relative paths (e.g., `/archives/hello-world`) into hyperlink cards, the backend API rejects them as invalid because it only accepts absolute URIs. Relative paths should be resolved against the site's external URL so that internal pages can also display rich card metadata.

## What Changes

- Detect relative paths in `HyperLinkCardEndpoint.getHyperLinkDetail()` before URI validation
- Resolve relative URLs against the external URL supplied by Halo's `ExternalUrlSupplier`
- Proceed with the resolved absolute URL for metadata fetching
- No changes to parser logic, frontend components, or caching behavior

## Capabilities

### New Capabilities

- `relative-url-resolution`: Support resolving relative URLs against the site's external base URL before link metadata extraction.

### Modified Capabilities

- *(none)*

## Impact

- **Backend API** (`HyperLinkCardEndpoint`): URI validation logic expanded to handle relative paths
- **No UI or Web Component changes** required
- **Response behavior**: Relative URLs that were previously rejected with `400 Invalid url.` will now be accepted and resolved
