package run.halo.editor.hyperlink.handler;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.concurrent.atomic.AtomicReference;
import run.halo.editor.hyperlink.LinkFetchPolicy;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ServerWebInputException;

class HyperLinkDefaultParserTest {

    @Test
    void shouldRejectRedirectOutsideWhitelist() {
        var policy = new LinkFetchPolicy(true, true,
            java.util.List.of(new LinkFetchPolicy.Host("example.com")));
        var resourceUrl = new AtomicReference<String>();
        assertThrows(org.springframework.web.server.ResponseStatusException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "https://other.com/new", resourceUrl, policy));
        assertTrue(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "/new", resourceUrl, policy));
    }

    @Test
    void shouldAllowSafeAbsoluteRedirect() {
        var resourceUrl = new AtomicReference<String>();
        assertTrue(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "https://other.com/new", resourceUrl, LinkFetchPolicy.EDITOR));
        assertEquals("https://other.com/new", resourceUrl.get());
    }

    @Test
    void shouldAllowSafeRelativeRedirect() {
        var resourceUrl = new AtomicReference<String>();
        assertTrue(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "/new", resourceUrl, LinkFetchPolicy.EDITOR));
        assertEquals("https://example.com/new", resourceUrl.get());
    }

    @Test
    void shouldRejectRedirectWithoutLocation() {
        var resourceUrl = new AtomicReference<String>();
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", null, resourceUrl, LinkFetchPolicy.EDITOR));
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectRedirectFromMalformedCurrentUrl() {
        var resourceUrl = new AtomicReference<String>();
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            null, "https://example.com/", resourceUrl, LinkFetchPolicy.EDITOR));
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "http://[invalid", "https://example.com/", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectRedirectToLocalhost() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "http://localhost/secret", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectRedirectToLoopbackAddress() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "http://127.0.0.1/secret", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectRedirectToPrivateAddress() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "http://192.168.1.1/", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectRedirectToNonHttpUrl() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "file:///etc/passwd", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectRedirectWithUserInfo() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "https://user:pass@example.com/", resourceUrl, LinkFetchPolicy.EDITOR));
    }

    @Test
    void shouldRejectMalformedLocation() {
        var resourceUrl = new AtomicReference<String>();
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "::not-a-valid-location", resourceUrl, LinkFetchPolicy.EDITOR));
    }
}
