## Context

See proposal.md. The target requires Halo 2.26+, Java 21, Vue and Svelte. Both editor and theme currently use the anonymous endpoint. Partial custom metadata still triggers fetching.

## Goals / Non-Goals

Goals: explicit snapshots, independently authorized editor fetching, opt-in legacy requests and exact-host enforcement before DNS and across redirects. No bulk migration or automatic publication.

## Decisions

- Persist data-mode=snapshot on both card nodes; absent mode retains legacy eligibility. Empty snapshot fields do not trigger fetching.
- Inject only the public online-fetch boolean into page head. Missing configuration means disabled. Server policy remains authoritative.
- Separate Console API group and assignable fetch role; unauthorized users retain manual card editing. Console fetch bypasses the 12-hour cache for explicit updates.
- Pass outbound host policy to parsers, including fixed provider API targets and redirects. Normalize host case/trailing dot; no substring or wildcard match.
- Reuse custom attributes. One shared editor operation handles metadata mapping, stale-node protection and permissions. URL edits commit explicitly; async responses never target the current selection blindly.
- Render saved values before attempting online requests and retain them on failure. Editor node views force snapshot rendering even for old nodes.

## Risks / Trade-offs

- Existing cards without saved metadata degrade after upgrade; administrators may enable online compatibility with optional allowlisting.
- Enabling unrestricted public fetching exposes outbound IP to target websites; explain this in settings.
- Trusted editors can fetch public websites. Network isolation requires a separate proxy deployment.
- Concurrent edits invalidate pending metadata responses instead of overwriting author edits.
