package run.halo.editor.hyperlink.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
@Component
@RequiredArgsConstructor
public class HyperLinkParserFactory {

    private final ApplicationContext applicationContext;

    @SuppressWarnings("unchecked")
    public <T extends HyperLinkBaseDTO> HyperLinkParser<T> getParser(String host) {
        Class<? extends HyperLinkParser<?>> type = ParserType.getBeanTypeByHost(host);
        return (HyperLinkParser<T>) type.cast(applicationContext.getBean(type));
    }
}
