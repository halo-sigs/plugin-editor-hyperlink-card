package run.halo.editor.hyperlink.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import run.halo.editor.hyperlink.HttpClientFactory;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RequiredArgsConstructor
public class HyperLinkBilibiliParser implements HyperLinkParser<HyperLinkBaseDTO> {

    private final HttpClientFactory clientFactory;
    private final ObjectMapper objectMapper;

    public Mono<HyperLinkBaseDTO> parse(URI linkURI) {
        return getHyperLinkDetail(linkURI)
            .map(item -> {
                var hyperLinkDTO = new HyperLinkBaseDTO();
                try {
                    JsonNode root = objectMapper.readTree(item);
                    JsonNode data = root.path("data");

                    hyperLinkDTO.setUrl(linkURI.toString());
                    hyperLinkDTO.setTitle(data.path("title").asText());
                    hyperLinkDTO.setImage(data.path("pic").asText());
                    hyperLinkDTO.setDescription("UP主：" + data.path("owner").path("name").asText());
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                return hyperLinkDTO;
            });
    }

    public Mono<String> getHyperLinkDetail(URI linkURI) {
        String api = "https://api.bilibili.com/x/web-interface/view?" + getQueryParam(linkURI);
        return clientFactory.createHttpClientBuilder(linkURI.getHost())
            .map(httpClient -> WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build())
            .flatMap(webClient -> webClient.get()
                .uri(api)
                .headers(httpHeaders -> {
                    httpHeaders.set(HttpHeaders.CONTENT_TYPE, "application/json");
                })
                .retrieve()
                .bodyToMono(String.class));
    }

    public String getQueryParam(URI linkURI) {
        Pattern pattern = Pattern.compile("video/([a-zA-Z0-9]+)");
        Matcher matcher = pattern.matcher(linkURI.toString());
        if (!matcher.find()) {
            throw new RuntimeException("id not found");
        }
        String id = matcher.group(1);
        System.out.println(id);
        if (id.chars().allMatch(Character::isDigit)) {
            return "aid=" + id;
        } else {
            return "bvid=" + id;
        }
    }
}
