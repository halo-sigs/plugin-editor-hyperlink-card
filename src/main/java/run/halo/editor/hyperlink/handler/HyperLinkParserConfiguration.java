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

    private final ApplicationContext applicationContext;

    @Bean
    public HyperLinkParser<HyperLinkBaseDTO> defaultParser() {
        return new HyperLinkDefaultParser(applicationContext.getBean(HttpClientFactory.class));
    }

    @Bean
    public HyperLinkParser<HyperLinkBaseDTO> qqMusicParser() {
        return new HyperLinkQQMusicParser(applicationContext.getBean(HttpClientFactory.class), new ObjectMapper());
    }
}
