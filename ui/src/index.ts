import "@/styles/index.css";
import "@/styles/tailwind.css";
import { definePlugin } from "@halo-dev/console-shared";
import "@halo-dev/hyperlink-card";
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
