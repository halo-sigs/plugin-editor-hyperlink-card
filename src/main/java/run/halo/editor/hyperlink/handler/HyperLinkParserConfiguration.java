package run.halo.editor.hyperlink.handler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
@Configuration
public class HyperLinkParserConfiguration {

    @Bean
    public HyperLinkParser<HyperLinkBaseDTO> defaultParser() {
        return new HyperLinkDefaultParser();
    }
}
