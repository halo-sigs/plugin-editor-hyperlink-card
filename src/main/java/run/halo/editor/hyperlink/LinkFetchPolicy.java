package run.halo.editor.hyperlink;

import java.net.URI;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public record LinkFetchPolicy(boolean onlineFetchEnabled, boolean whitelistEnabled,
    List<Host> hosts) {
    public static final LinkFetchPolicy DISABLED = new LinkFetchPolicy(false, false, List.of());
    public static final LinkFetchPolicy EDITOR = new LinkFetchPolicy(true, false, List.of());

    public record Host(String value) {
    }

    public void requireAllowed(URI uri) {
        if (!onlineFetchEnabled) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Online link fetching is disabled.");
        }
        if (whitelistEnabled && (uri.getHost() == null || hosts == null || hosts.stream()
            .noneMatch(host -> host != null && host.value() != null
                && normalizeHost(host.value().strip()).equals(normalizeHost(uri.getHost()))))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Link host is not allowed.");
        }
    }

    private static String normalizeHost(String host) {
        var normalized = host.toLowerCase(Locale.ROOT);
        return normalized.endsWith(".")
            ? normalized.substring(0, normalized.length() - 1) : normalized;
    }
}
