package run.halo.editor.hyperlink.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import run.halo.editor.hyperlink.HttpClientFactory;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
@Configuration
@RequiredArgsConstructor
public class HyperLinkParserConfiguration {

    private final HttpClientFactory httpClientFactory;

    @Bean
    public HyperLinkParser<HyperLinkBaseDTO> defaultParser() {
        return new HyperLinkDefaultParser(httpClientFactory);
    }

    @Bean
    public HyperLinkParser<HyperLinkBaseDTO> qqMusicParser() {
        return new HyperLinkQQMusicParser(httpClientFactory, new ObjectMapper());
    }

    @Bean
    public HyperLinkParser<HyperLinkBaseDTO> bilibiliParser() {
        return new HyperLinkBilibiliParser(httpClientFactory, new ObjectMapper());
    }
}
