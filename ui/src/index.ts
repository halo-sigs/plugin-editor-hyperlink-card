import '@/styles/tailwind.css';
import { definePlugin } from '@halo-dev/console-shared';
import '@halo-dev/hyperlink-card';
import {
  HyperlinkCardExtension,
  HyperlinkInlineCardExtension,
  TextBubbleExtension,
} from './editor';

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    'default:editor:extension:create': () => {
      return [TextBubbleExtension, HyperlinkCardExtension, HyperlinkInlineCardExtension];
    },
  },
});
