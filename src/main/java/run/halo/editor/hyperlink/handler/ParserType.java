package run.halo.editor.hyperlink.handler;

import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
public enum ParserType {

    DEFAULT("default", HyperLinkDefaultParser.class);

    private final String host;
    private final Class<? extends HyperLinkParser<? extends HyperLinkBaseDTO>> type;

    ParserType(String host, Class<? extends HyperLinkParser<? extends HyperLinkBaseDTO>> type) {
        this.host = host;
        this.type = type;
    }

    public String getHost() {
        return host;
    }

    public Class<? extends HyperLinkParser<? extends HyperLinkBaseDTO>> getType() {
        return type;
    }

    public static Class<? extends HyperLinkParser<? extends HyperLinkBaseDTO>> getBeanTypeByHost(
        String host) {
        for (ParserType type : values()) {
            if (type.getHost().equalsIgnoreCase(host)) {
                return type.getType();
            }
        }
        return DEFAULT.getType();
    }
}
