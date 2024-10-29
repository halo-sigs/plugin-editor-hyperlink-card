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
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class HyperLinkQQMusicParser implements HyperLinkParser<HyperLinkBaseDTO> {

    private final HttpClientFactory clientFactory;
    private final ObjectMapper objectMapper;

    public Mono<HyperLinkBaseDTO> parse(URI linkURI) {
        return getHyperLinkDetail(linkURI)
            .map(item -> {
                var hyperLinkDTO = new HyperLinkBaseDTO();
                try {
                    JsonNode root = objectMapper.readTree(item);
                    JsonNode songInfo = root.path("data").get(0);

                    String title = songInfo.path("title").asText();
                    List<String> singers = songInfo.path("singer")
                            .findValues("name")
                            .stream()
                            .map(JsonNode::asText)
                            .collect(Collectors.toList());
                    String singer = String.join("/", singers);
                    String album = songInfo.path("album").path("name").asText();
                    String albumId = songInfo.path("album").path("mid").asText();

                    hyperLinkDTO.setUrl(linkURI.toString());
                    hyperLinkDTO.setTitle(title);
                    hyperLinkDTO.setIcon("https://y.gtimg.cn/music/photo_new/T002R300x300M000" + albumId + ".jpg?max_age=2592000");
                    hyperLinkDTO.setDescription(singer + " - " + album);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                return hyperLinkDTO;
        });
    }

    public Mono<String> getHyperLinkDetail(URI linkURI) {
        String api = "https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?" + getQueryParam(linkURI) + "&platform=yqq&format=json";
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
        Pattern pattern = Pattern.compile("(?:songDetail/|songid=)([a-zA-Z0-9]+)");
        Matcher matcher = pattern.matcher(linkURI.toString());
        if (!matcher.find()) {
            throw new RuntimeException("id not found");
        }
        String id = matcher.group(1);
        System.out.println(id);
        if (id.chars().allMatch(Character::isDigit)) {
            return "songid=" + id;
        } else {
            return "songmid=" + id;
        }
    }
}
