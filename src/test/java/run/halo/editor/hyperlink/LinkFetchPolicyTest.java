package run.halo.editor.hyperlink;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.net.URI;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class LinkFetchPolicyTest {
    @Test
    void defaultsDenyButEditorsAndOptInWithoutWhitelistAllow() {
        var uri = URI.create("https://example.com/page");
        assertThrows(ResponseStatusException.class, () -> LinkFetchPolicy.DISABLED.requireAllowed(uri));
        assertDoesNotThrow(() -> LinkFetchPolicy.EDITOR.requireAllowed(uri));
        assertDoesNotThrow(() -> new LinkFetchPolicy(true, false, null).requireAllowed(uri));
    }

    @Test
    void whitelistRequiresExactNormalizedHostAndEmptyDeniesAll() {
        var policy = new LinkFetchPolicy(true, true, List.of(new LinkFetchPolicy.Host("EXAMPLE.com.")));
        assertDoesNotThrow(() -> policy.requireAllowed(URI.create("https://example.com/path")));
        for (var host : List.of("sub.example.com", "example.com.attacker.test", "notexample.com")) {
            assertThrows(ResponseStatusException.class,
                () -> policy.requireAllowed(URI.create("https://" + host)));
        }
        assertThrows(ResponseStatusException.class, () ->
            new LinkFetchPolicy(true, true, List.of()).requireAllowed(URI.create("https://example.com")));
    }
}
