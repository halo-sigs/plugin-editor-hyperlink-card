import { definePlugin } from "@halo-dev/ui-shared";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": async () => {
      const { TextBubbleExtension, HyperlinkCardExtension, HyperlinkInlineCardExtension } =
        await import("./editor");
      return [TextBubbleExtension, HyperlinkCardExtension, HyperlinkInlineCardExtension];
    },
  },
});
