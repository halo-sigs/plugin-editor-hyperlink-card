package run.halo.editor.hyperlink;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * @author LIlGG
 */
@Component
@RequiredArgsConstructor
public class HyperLinkRequest {

    private final HttpClientFactory clientFactory;

    public Mono<HyperLinkResponse> getHyperLinkDetail(URI linkURI) {
        AtomicReference<String> resourceUrl = new AtomicReference<>(linkURI.toString());
        return clientFactory.createHttpClientBuilder(linkURI.getHost())
            .map(httpClient -> httpClient.followRedirect(true, (clientRequest) -> {
                if (StringUtils.hasText(clientRequest.resourceUrl())) {
                    resourceUrl.set(clientRequest.resourceUrl());
                }
            }))
            .map(httpClient -> WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build())
            .flatMap(webClient -> webClient.get()
                .uri(linkURI)
                .accept(MediaType.TEXT_HTML)
                .headers(httpHeaders -> {
                    httpHeaders.set(HttpHeaders.USER_AGENT,
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, "
                            + "like Gecko) Chrome/58.0.3029.110 Safari/537.3");
                    httpHeaders.set(HttpHeaders.REFERER,
                        linkURI.getScheme() + "://" + linkURI.getHost());
                })
                .retrieve()
                .bodyToFlux(DataBuffer.class)
                .flatMap(dataBuffer -> {
                    String content = dataBuffer.toString(StandardCharsets.UTF_8);
                    DataBufferUtils.release(dataBuffer);
                    return Mono.just(content);
                })
                .reduce(new StringBuilder(), StringBuilder::append)
                .filter(stringBuilder -> !stringBuilder.isEmpty())
                .map(StringBuilder::toString)
                .map(htmlContent -> new HyperLinkResponse(htmlContent, resourceUrl.get()))
            );
    }

    public record HyperLinkResponse(String htmlContent, String url) {

    }
}
