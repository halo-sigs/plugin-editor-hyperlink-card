package run.halo.editor.hyperlink.handler;

import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
public interface HyperLinkParser<T extends HyperLinkBaseDTO> {

    T parse(String htmlContent);
}
