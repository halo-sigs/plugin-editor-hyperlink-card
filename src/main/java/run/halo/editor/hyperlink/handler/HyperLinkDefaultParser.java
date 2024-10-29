package run.halo.editor.hyperlink.handler;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;
import run.halo.app.infra.utils.PathUtils;
import run.halo.editor.hyperlink.HttpClientFactory;
import run.halo.editor.hyperlink.HyperLinkRequest;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
@RequiredArgsConstructor
public class HyperLinkDefaultParser implements HyperLinkParser<HyperLinkBaseDTO> {

    private final HttpClientFactory clientFactory;

    @SuppressWarnings("checkstyle:MissingSwitchDefault")
    @Override
    public Mono<HyperLinkBaseDTO> parse(URI linkURI) {
        return this.getHyperLinkDetail(linkURI)
                .switchIfEmpty(
                        Mono.error(new ServerWebInputException("this website is not supported.")))
                .map(item -> {
                    var actualURI = URI.create(item.url());

                    var hyperLinkDTO = new HyperLinkBaseDTO();
                    Document parse = Jsoup.parse(item.htmlContent(), Parser.htmlParser());

                    Elements meta = parse.getElementsByTag("meta");
                    parserMetas(meta, hyperLinkDTO);

                    var titles = parse.getElementsByTag("title");
                    if (!CollectionUtils.isEmpty(titles)) {
                        var title = titles.get(0).text();
                        hyperLinkDTO.setTitle(title);
                    }

                    Elements links = parse.getElementsByTag("link");
                    parserLinks(links, hyperLinkDTO);

                    if (org.apache.commons.lang3.StringUtils.isNotBlank(hyperLinkDTO.getIcon())
                            && !PathUtils.isAbsoluteUri(hyperLinkDTO.getIcon())) {
                        hyperLinkDTO.setIcon(actualURI.resolve(hyperLinkDTO.getIcon()).toString());
                    }
                    if (org.apache.commons.lang3.StringUtils.isNotBlank(hyperLinkDTO.getImage())
                            && !PathUtils.isAbsoluteUri(hyperLinkDTO.getImage())) {
                        hyperLinkDTO.setImage(actualURI.resolve(hyperLinkDTO.getImage()).toString());
                    }
                    if (org.apache.commons.lang3.StringUtils.isBlank(hyperLinkDTO.getUrl())) {
                        hyperLinkDTO.setUrl(actualURI.toString());
                    }
                    return hyperLinkDTO;
                });
    }

    public Mono<HyperLinkRequest.HyperLinkResponse> getHyperLinkDetail(URI linkURI) {
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
                        .map(htmlContent -> new HyperLinkRequest.HyperLinkResponse(htmlContent, resourceUrl.get())));
    }

    private void parserLinks(Elements links, HyperLinkBaseDTO hyperLinkBaseDTO) {
        links.stream().filter(element -> element.hasAttr("rel"))
                .forEach(element -> {
                    String rel = element.attr("rel");
                    List<String> rels = Arrays.asList(rel.split(" "));
                    if (rels.contains("icon") && !StringUtils.hasText(hyperLinkBaseDTO.getIcon())) {
                        hyperLinkBaseDTO.setIcon(element.attr("href"));
                    }
                });
    }

    private void parserMetas(Elements metas, HyperLinkBaseDTO hyperLinkBaseDTO) {
        metas.stream().filter(element -> element.hasAttr("property"))
                .forEach(element -> {
                    String property = element.attr("property");
                    String content = element.attr("content");
                    switch (property) {
                        case "og:title" -> hyperLinkBaseDTO.setTitle(content);
                        case "og:description" -> hyperLinkBaseDTO.setDescription(content);
                        case "og:image" -> hyperLinkBaseDTO.setImage(content);
                        case "og:url" -> hyperLinkBaseDTO.setUrl(content);
                        default -> {

                        }
                    }
                });

        if (!StringUtils.hasText(hyperLinkBaseDTO.getDescription())) {
            metas.stream().filter(element -> element.hasAttr("name"))
                    .forEach(element -> {
                        String name = element.attr("name");
                        String content = element.attr("content");
                        if ("description".equals(name)) {
                            hyperLinkBaseDTO.setDescription(content);
                        }
                    });
        }
    }
}
