import { definePlugin } from "@halo-dev/console-shared";
import HyperlinkCardExtension from "./editor";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [HyperlinkCardExtension];
    },
  },
});
