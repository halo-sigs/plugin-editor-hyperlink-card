package run.halo.editor.hyperlink.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * @author LIlGG
 */
@Data
public class HyperLinkBaseDTO {

    @JsonProperty(value = "title", required = true)
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty(value = "url", required = true)
    private String url;

    @JsonProperty("icon")
    private String icon;

    @JsonProperty("image")
    private String image;
}
