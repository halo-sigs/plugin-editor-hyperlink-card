import { definePlugin } from "@halo-dev/console-shared";
import HyperlinkCardExtension from "./editor";
import "@/styles/tailwind.css";
import "@/styles/index.css";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [HyperlinkCardExtension];
    },
  },
});
