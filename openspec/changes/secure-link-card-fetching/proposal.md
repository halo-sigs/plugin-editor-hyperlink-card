## Why

Anonymous arbitrary URL fetching exposes the server's outbound IP and lets visitors trigger unsolicited outbound requests. New cards should store metadata while editing, while administrators explicitly opt into legacy online fetching.

## What Changes

- **BREAKING**: public link-detail fetching defaults to disabled, including upgrades; optionally enable an exact-host allowlist (disabled by default).
- Add a separately authorized Console metadata endpoint and visible role template, with matching editor UI permission checks.
- New cards persist snapshot mode and metadata; add refresh and committed URL-change fetching with undo and stale-result protection.
- Web Components render partial saved data and only fetch legacy cards when the page configuration enables it.
- Document compatibility and verify backend, editor and public rendering on a running Halo instance. No bulk migration.

## Capabilities

### New Capabilities
- `secure-link-fetching`: public policy, Console authorization and editor snapshot lifecycle.

### Modified Capabilities

None.

## Impact

Spans backend API/settings/security, Vue TipTap extensions and bubble menus, and Svelte Web Components. Existing tag names, custom attributes, styling and parser behavior are retained. No new runtime dependency or migration service.
