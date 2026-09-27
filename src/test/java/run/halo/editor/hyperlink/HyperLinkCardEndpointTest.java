package run.halo.editor.hyperlink;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import run.halo.app.infra.ExternalUrlSupplier;
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.editor.hyperlink.handler.HyperLinkParserFactory;
import run.halo.editor.hyperlink.service.HyperLinkCardServiceImpl;

class HyperLinkCardEndpointTest {
    @Test
    void rejectsFetchingWhenSettingsCannotBeRead() {
        var settings = mock(ReactiveSettingFetcher.class);
        when(settings.fetch("fetch", LinkFetchPolicy.class))
            .thenReturn(Mono.error(new IllegalArgumentException("Invalid settings")));
        var parsers = mock(HyperLinkParserFactory.class);
        var endpoint = new HyperLinkCardEndpoint(new HyperLinkCardServiceImpl(parsers),
            mock(ExternalUrlSupplier.class), settings);

        WebTestClient.bindToRouterFunction(endpoint.endpoint()).build()
            .get().uri("/link-detail?url=https://unresolvable.invalid")
            .exchange().expectStatus().isForbidden();
        verifyNoInteractions(parsers);
    }
}
