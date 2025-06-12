import { definePlugin } from '@halo-dev/console-shared';
import 'uno.css';

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    'default:editor:extension:create': async () => {
      const { TextBubbleExtension, HyperlinkCardExtension, HyperlinkInlineCardExtension } =
        await import('./editor');
      return [TextBubbleExtension, HyperlinkCardExtension, HyperlinkInlineCardExtension];
    },
  },
});
