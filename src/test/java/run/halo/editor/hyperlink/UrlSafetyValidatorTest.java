package run.halo.editor.hyperlink;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ServerWebInputException;

class UrlSafetyValidatorTest {

    @Test
    void shouldAllowPublicHttpUrl() {
        assertDoesNotThrow(() ->
            UrlSafetyValidator.requireSafeHttpUrl("https://93.184.216.34/path?foo=bar"));
    }

    @Test
    void shouldRejectNonHttpUrl() {
        assertInvalid("file:///etc/passwd");
        assertInvalid("ftp://example.com/file");
    }

    @Test
    void shouldRejectUrlWithoutHost() {
        assertInvalid("/relative-path");
        assertInvalid("https:///path");
    }

    @Test
    void shouldRejectUrlWithUserInfo() {
        assertInvalid("https://example.com@93.184.216.34/");
    }

    @Test
    void shouldRejectLocalhost() {
        assertInvalid("http://localhost/");
        assertInvalid("http://foo.localhost/");
    }

    @Test
    void shouldRejectLoopbackAddress() {
        assertInvalid("http://127.0.0.1/");
        assertInvalid("http://[::1]/");
        assertInvalid("http://2130706433/");
        assertInvalid("http://[::ffff:127.0.0.1]/");
    }

    @Test
    void shouldRejectPrivateAddress() {
        assertInvalid("http://10.0.0.1/");
        assertInvalid("http://172.16.0.1/");
        assertInvalid("http://192.168.0.1/");
    }

    @Test
    void shouldRejectLinkLocalAddress() {
        assertInvalid("http://169.254.169.254/");
        assertInvalid("http://[fe80::1]/");
    }

    @Test
    void shouldRejectCarrierGradeNatAddress() {
        assertInvalid("http://100.64.0.1/");
        assertInvalid("http://100.127.255.255/");
    }

    @Test
    void shouldValidateResolvedSocketAddress() throws Exception {
        assertTrue(UrlSafetyValidator.isPublicSocketAddress(new InetSocketAddress(
            InetAddress.getByName("93.184.216.34"), 80)));
        assertFalse(UrlSafetyValidator.isPublicSocketAddress(new InetSocketAddress(
            InetAddress.getByName("127.0.0.1"), 80)));
        assertFalse(UrlSafetyValidator.isPublicSocketAddress(
            InetSocketAddress.createUnresolved("example.com", 80)));
    }

    private static void assertInvalid(String url) {
        assertThrows(ServerWebInputException.class,
            () -> UrlSafetyValidator.requireSafeHttpUrl(url));
    }
}
