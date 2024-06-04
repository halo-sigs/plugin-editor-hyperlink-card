package run.halo.editor.hyperlink;

import lombok.RequiredArgsConstructor;
import org.pf4j.PluginWrapper;
import org.springframework.stereotype.Component;
import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.theme.dialect.TemplateHeadProcessor;

import java.util.Properties;

@Component
@RequiredArgsConstructor
public class HyperLinkHeadProcessor  implements TemplateHeadProcessor {

    static final PropertyPlaceholderHelper PROPERTY_PLACEHOLDER_HELPER = new PropertyPlaceholderHelper("${", "}");

    private final PluginWrapper pluginWrapper;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        final IModelFactory modelFactory = context.getModelFactory();
        model.add(modelFactory.createText(hyperlinkCardComponentScript()));
        return Mono.empty();
    }

    private String hyperlinkCardComponentScript() {

        final Properties properties = new Properties();
        properties.setProperty("version", pluginWrapper.getDescriptor().getVersion());

        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders("""
                <!-- plugin-editor-hyperlink-card start -->
                <script src="/plugins/editor-hyperlink-card/assets/static/hyperlink-card.iife.js?version=${version}"></script>

                <script>
                    // TODO: Mock data, remove this
                    document.addEventListener('DOMContentLoaded', function () {
                        const el = document.createElement('hyperlink-card');
                        el.setAttribute('href', 'http://localhost:8090');
                        document.body.appendChild(el);
                    });
                </script>
                <!-- plugin-editor-hyperlink-card end -->
                """, properties);
    }
}
