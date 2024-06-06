package run.halo.editor.hyperlink.service;

import reactor.core.publisher.Mono;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
public interface HyperLinkCardService {
    Mono<HyperLinkBaseDTO> getHyperLinkDetail(String linkUrl);
}
