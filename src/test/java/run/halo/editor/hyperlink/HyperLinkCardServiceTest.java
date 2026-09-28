package run.halo.editor.hyperlink;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.net.URI;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;
import run.halo.editor.hyperlink.handler.HyperLinkParser;
import run.halo.editor.hyperlink.handler.HyperLinkParserFactory;
import run.halo.editor.hyperlink.service.HyperLinkCardServiceImpl;

class HyperLinkCardServiceTest {
    @Test
    void disabledPolicyRejectsBeforeResolutionOrParsing() {
        var factory = mock(HyperLinkParserFactory.class);
        var service = new HyperLinkCardServiceImpl(factory);
        assertThrows(ResponseStatusException.class, () -> service.getHyperLinkDetail(
            "https://unresolvable.invalid", LinkFetchPolicy.DISABLED, false).block());
        verifyNoInteractions(factory);
    }

    @Test
    @SuppressWarnings("unchecked")
    void preservesPolicyDenialWrappedByHttpClient() {
        var factory = mock(HyperLinkParserFactory.class);
        var parser = (HyperLinkParser<HyperLinkBaseDTO>) mock(HyperLinkParser.class);
        var denied = new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
        var wrapped = new org.springframework.web.reactive.function.client.WebClientRequestException(
            denied, org.springframework.http.HttpMethod.GET, URI.create("https://8.8.8.8/"),
            org.springframework.http.HttpHeaders.EMPTY);
        when(factory.getParser("8.8.8.8")).thenReturn(parser);
        when(parser.parse(any(URI.class), any(LinkFetchPolicy.class))).thenReturn(Mono.error(wrapped));
        var service = new HyperLinkCardServiceImpl(factory);
        assertEquals(denied, assertThrows(ResponseStatusException.class, () ->
            service.getHyperLinkDetail("https://8.8.8.8/", LinkFetchPolicy.EDITOR, true).block()));
    }

    @Test
    @SuppressWarnings("unchecked")
    void editorRefreshBypassesCacheAndPublicFetchReusesIt() {
        var factory = mock(HyperLinkParserFactory.class);
        var parser = (HyperLinkParser<HyperLinkBaseDTO>) mock(HyperLinkParser.class);
        var old = new HyperLinkBaseDTO();
        old.setTitle("Old title");
        var fresh = new HyperLinkBaseDTO();
        fresh.setTitle("Fresh title");
        when(factory.getParser("8.8.8.8")).thenReturn(parser);
        when(parser.parse(any(URI.class), any(LinkFetchPolicy.class)))
            .thenReturn(Mono.just(old), Mono.just(fresh));
        var service = new HyperLinkCardServiceImpl(factory);
        var url = "https://8.8.8.8/";
        assertEquals("Old title", service.getHyperLinkDetail(url, LinkFetchPolicy.EDITOR, false).block().getTitle());
        assertEquals("Old title", service.getHyperLinkDetail(url, LinkFetchPolicy.EDITOR, false).block().getTitle());
        assertEquals("Fresh title", service.getHyperLinkDetail(url, LinkFetchPolicy.EDITOR, true).block().getTitle());
        verify(parser, times(2)).parse(any(URI.class), any(LinkFetchPolicy.class));
    }
}
