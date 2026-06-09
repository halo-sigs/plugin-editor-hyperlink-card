package run.halo.editor.hyperlink.handler;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ServerWebInputException;

class HyperLinkDefaultParserTest {

    @Test
    void shouldAllowSafeAbsoluteRedirect() {
        var resourceUrl = new AtomicReference<String>();
        assertTrue(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "https://other.com/new", resourceUrl));
        assertEquals("https://other.com/new", resourceUrl.get());
    }

    @Test
    void shouldAllowSafeRelativeRedirect() {
        var resourceUrl = new AtomicReference<String>();
        assertTrue(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "/new", resourceUrl));
        assertEquals("https://example.com/new", resourceUrl.get());
    }

    @Test
    void shouldRejectRedirectWithoutLocation() {
        var resourceUrl = new AtomicReference<String>();
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", null, resourceUrl));
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "", resourceUrl));
    }

    @Test
    void shouldRejectRedirectFromMalformedCurrentUrl() {
        var resourceUrl = new AtomicReference<String>();
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            null, "https://example.com/", resourceUrl));
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "http://[invalid", "https://example.com/", resourceUrl));
    }

    @Test
    void shouldRejectRedirectToLocalhost() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "http://localhost/secret", resourceUrl));
    }

    @Test
    void shouldRejectRedirectToLoopbackAddress() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "http://127.0.0.1/secret", resourceUrl));
    }

    @Test
    void shouldRejectRedirectToPrivateAddress() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "http://192.168.1.1/", resourceUrl));
    }

    @Test
    void shouldRejectRedirectToNonHttpUrl() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "file:///etc/passwd", resourceUrl));
    }

    @Test
    void shouldRejectRedirectWithUserInfo() {
        var resourceUrl = new AtomicReference<String>();
        assertThrows(ServerWebInputException.class,
            () -> HyperLinkDefaultParser.validateRedirect(
                "https://example.com/page", "https://user:pass@example.com/", resourceUrl));
    }

    @Test
    void shouldRejectMalformedLocation() {
        var resourceUrl = new AtomicReference<String>();
        assertFalse(HyperLinkDefaultParser.validateRedirect(
            "https://example.com/page", "::not-a-valid-location", resourceUrl));
    }
}
