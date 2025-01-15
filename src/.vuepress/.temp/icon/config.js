import { hasGlobalComponent } from "D:/dev/doc/my-docs/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "D:/dev/doc/my-docs/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "D:/dev/doc/my-docs/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "fontawesome",
            prefix: "",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/all.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

  },
}
