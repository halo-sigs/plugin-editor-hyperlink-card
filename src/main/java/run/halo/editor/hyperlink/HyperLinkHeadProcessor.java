package run.halo.editor.hyperlink;

import java.util.Properties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.PluginContext;
import run.halo.app.theme.dialect.TemplateHeadProcessor;

@Component
@RequiredArgsConstructor
public class HyperLinkHeadProcessor implements TemplateHeadProcessor {

    static final PropertyPlaceholderHelper PROPERTY_PLACEHOLDER_HELPER =
        new PropertyPlaceholderHelper("${", "}");

    private final PluginContext pluginContext;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        final IModelFactory modelFactory = context.getModelFactory();
        model.add(modelFactory.createText(hyperlinkCardComponentScript()));
        return Mono.empty();
    }

    private String hyperlinkCardComponentScript() {

        final Properties properties = new Properties();
        properties.setProperty("version", pluginContext.getVersion());

        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders("""
            <!-- plugin-editor-hyperlink-card start -->
            <script src="/plugins/editor-hyperlink-card/assets/static/index.iife.js?version=${version}"></script>
            <link rel="stylesheet" href="/plugins/editor-hyperlink-card/assets/static/index.css?version=${version}" />
            <!-- plugin-editor-hyperlink-card end -->
            """, properties);
    }
}
