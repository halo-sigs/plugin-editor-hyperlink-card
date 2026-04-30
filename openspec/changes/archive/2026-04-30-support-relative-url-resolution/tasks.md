## 1. Implement relative URL resolution in endpoint

- [x] 1.1 Inject `ExternalUrlSupplier` into `HyperLinkCardEndpoint`
- [x] 1.2 Add relative path detection before `PathUtils.isAbsoluteUri` validation
- [x] 1.3 Resolve relative URLs against `externalUrlSupplier.get()` using `URI.resolve()`
- [x] 1.4 Keep existing `ServerWebInputException("Invalid url.")` for unresolvable input

## 2. Verify

- [x] 2.1 Run `./gradlew build` to ensure compilation passes
- [x] 2.2 Run `./gradlew test` to ensure existing tests still pass
