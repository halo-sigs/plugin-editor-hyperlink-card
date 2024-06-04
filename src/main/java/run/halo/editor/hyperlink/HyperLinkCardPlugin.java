package run.halo.editor.hyperlink;

import org.springframework.stereotype.Component;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

@Component
public class HyperLinkCardPlugin extends BasePlugin {

    public HyperLinkCardPlugin(PluginContext pluginContext) {
        super(pluginContext);
    }

    @Override
    public void start() {
    }

    @Override
    public void stop() {
    }
}
