## 1. Add timeout exception handling to parsers

- [x] 1.1 Add `.onErrorMap()` in `HyperLinkDefaultParser.parse()` to catch `ReadTimeoutException` / `ConnectTimeoutException` (via `WebClientRequestException` cause chain) and map to `ServerWebInputException("Request to target service timed out.")`
- [x] 1.2 Add the same `.onErrorMap()` in `HyperLinkBilibiliParser.parse()`
- [x] 1.3 Add the same `.onErrorMap()` in `HyperLinkQQMusicParser.parse()`

## 2. Verify

- [x] 2.1 Run `./gradlew build` to ensure compilation passes
- [x] 2.2 Run `./gradlew test` to ensure existing tests still pass
