package run.halo.editor.hyperlink.handler;

import java.util.Arrays;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.springframework.util.StringUtils;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;

/**
 * @author LIlGG
 */
public class HyperLinkDefaultParser implements HyperLinkParser<HyperLinkBaseDTO> {

    @SuppressWarnings("checkstyle:MissingSwitchDefault")
    @Override
    public HyperLinkBaseDTO parse(String htmlContent) {
        var hyperLinkBaseDTO = new HyperLinkBaseDTO();
        Document parse = Jsoup.parse(htmlContent, Parser.htmlParser());

        Elements meta = parse.getElementsByTag("meta");
        parserMetas(meta, hyperLinkBaseDTO);

        var title = parse.getElementsByTag("title").get(0).text();
        hyperLinkBaseDTO.setTitle(title);

        Elements links = parse.getElementsByTag("link");
        parserLinks(links, hyperLinkBaseDTO);

        return hyperLinkBaseDTO;
    }

    private void parserLinks(Elements links, HyperLinkBaseDTO hyperLinkBaseDTO) {
        links.stream().filter(element -> element.hasAttr("rel"))
            .forEach(element -> {
                String rel = element.attr("rel");
                List<String> rels = Arrays.asList(rel.split(" "));
                if (rels.contains("icon") && !StringUtils.hasText(hyperLinkBaseDTO.getIcon())) {
                    hyperLinkBaseDTO.setIcon(element.attr("href"));
                }
            });
    }

    private void parserMetas(Elements metas, HyperLinkBaseDTO hyperLinkBaseDTO) {
        metas.stream().filter(element -> element.hasAttr("property"))
            .forEach(element -> {
                String property = element.attr("property");
                String content = element.attr("content");
                switch (property) {
                    case "og:title" -> hyperLinkBaseDTO.setTitle(content);
                    case "og:description" -> hyperLinkBaseDTO.setDescription(content);
                    case "og:image" -> hyperLinkBaseDTO.setImage(content);
                    case "og:url" -> hyperLinkBaseDTO.setUrl(content);
                    default -> {

                    }
                }
            });

        if (!StringUtils.hasText(hyperLinkBaseDTO.getDescription())) {
            metas.stream().filter(element -> element.hasAttr("name"))
                .forEach(element -> {
                    String name = element.attr("name");
                    String content = element.attr("content");
                    if ("description".equals(name)) {
                        hyperLinkBaseDTO.setDescription(content);
                    }
                });
        }
    }
}
