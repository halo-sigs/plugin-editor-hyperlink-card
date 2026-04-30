## Why

`HyperLinkDefaultParser` hardcodes `StandardCharsets.UTF_8` when converting the HTTP response body from `DataBuffer` to `String`. Some websites (e.g., `work.weixin.qq.com/mail/`) declare `Content-Type: text/html; charset=GB18030`, causing the parsed HTML title and meta tags to be garbled or empty because the wrong encoding is used.

## What Changes

- Replace `.retrieve().bodyToFlux(DataBuffer.class)` with `.exchangeToMono(...)` in `HyperLinkDefaultParser.getHyperLinkDetail()` to access response headers
- Extract the declared charset from the `Content-Type` header via `MediaType.getCharset()`
- Use the extracted charset (or fall back to UTF-8) when decoding `DataBuffer` chunks
- No changes to parsers, UI, or Web Components

## Capabilities

### New Capabilities

- `charset-aware-html-parsing`: Decode fetched HTML using the charset declared in the HTTP `Content-Type` header instead of a hardcoded UTF-8.

### Modified Capabilities

- *(none)*

## Impact

- **Backend** (`HyperLinkDefaultParser.getHyperLinkDetail()`): Response body decoding now respects the remote server's declared charset
- **No changes** to `HyperLinkBilibiliParser` or `HyperLinkQQMusicParser` (they consume JSON APIs, not HTML)
