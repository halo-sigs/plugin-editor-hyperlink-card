## Context

`HyperLinkDefaultParser.getHyperLinkDetail()` uses Spring WebFlux `WebClient` to fetch remote HTML pages. The response body is streamed as `DataBuffer` chunks and converted to `String` using `dataBuffer.toString(StandardCharsets.UTF_8)`. This ignores any `charset` parameter in the HTTP `Content-Type` response header, causing mojibake when the page is encoded in a non-UTF-8 charset such as GB18030.

## Goals / Non-Goals

**Goals:**
- Read the `Content-Type` header from the HTTP response
- Extract the declared charset and use it to decode the response body
- Fall back to UTF-8 when no charset is declared

**Non-Goals:**
- Attempt meta-charset detection inside the HTML body (e.g., `<meta charset="...">`)
- Support charsets not available in the JDK
- Modify the JSON parsers (`HyperLinkBilibiliParser`, `HyperLinkQQMusicParser`)

## Decisions

### 1. How to access response headers

**Decision:** Switch from `.retrieve().bodyToFlux(DataBuffer.class)` to `.exchangeToMono(clientResponse -> ...)`.

**Rationale:**
- `exchangeToMono` gives us the full `ClientResponse` including headers before reading the body
- This is the idiomatic WebFlux way to handle header-dependent body processing
- `retrieve()` abstracts away the response object and does not expose headers in the body stream

### 2. How to extract charset

**Decision:** Use `clientResponse.headers().contentType()` to get `MediaType`, then call `mediaType.getCharset()`.

**Rationale:**
- Spring's `MediaType` already parses `charset=GB18030` from `Content-Type: text/html; charset=GB18030`
- `getCharset()` returns the parsed `Charset` object directly
- Falls back to UTF-8 when `contentType` is null or lacks a charset parameter

### 3. Where to decode DataBuffer chunks

**Decision:** Inside the `exchangeToMono` lambda, after extracting the charset, chain `clientResponse.bodyToFlux(DataBuffer.class)` and use the extracted charset in `dataBuffer.toString(charset)`.

**Rationale:**
- Keeps the charset extraction and body decoding in one logical block
- Minimal change to the existing `flatMap/reduce` pipeline

## Risks / Trade-offs

- **[Risk]** `exchangeToMono` requires the body to be fully consumed; if not, connection pooling may be affected.  
  **→ Mitigation:** We fully consume the body via `bodyToFlux(...).reduce(...)` just as before; the only difference is that the consumption happens inside the `exchangeToMono` callback.
- **[Risk]** Some servers may declare an incorrect or unsupported charset.  
  **→ Mitigation:** Unsupported charset will cause an exception from `MediaType.getCharset()`; we can catch it and fall back to UTF-8.

## Migration Plan

No migration needed. Purely a bug fix for HTML page fetching.

## Open Questions

- None.
