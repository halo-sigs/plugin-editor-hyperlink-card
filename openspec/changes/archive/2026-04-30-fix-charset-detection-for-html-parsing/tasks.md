## 1. Fix charset detection in HyperLinkDefaultParser

- [x] 1.1 Replace `.retrieve().bodyToFlux(DataBuffer.class)` with `.exchangeToMono(clientResponse -> ...)`
- [x] 1.2 Extract charset from `clientResponse.headers().contentType()` using `MediaType.getCharset()`
- [x] 1.3 Use extracted charset (or UTF-8 fallback) in `dataBuffer.toString(charset)`
- [x] 1.4 Handle potential `IllegalArgumentException` from unsupported charset by falling back to UTF-8

## 2. Verify

- [x] 2.1 Run `./gradlew build` to ensure compilation passes
- [x] 2.2 Run `./gradlew test` to ensure existing tests still pass
