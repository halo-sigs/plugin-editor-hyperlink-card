package run.halo.editor.hyperlink.handler;

import reactor.core.publisher.Mono;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;
import java.net.URI;
import run.halo.editor.hyperlink.LinkFetchPolicy;

/**
 * @author LIlGG
 */
public interface HyperLinkParser<T extends HyperLinkBaseDTO> {

    Mono<T> parse(URI linkURI, LinkFetchPolicy policy);
}
