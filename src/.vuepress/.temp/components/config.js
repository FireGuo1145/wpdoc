import { hasGlobalComponent } from "D:/dev/doc/my-docs/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "D:/dev/doc/my-docs/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "D:/dev/doc/my-docs/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "D:/dev/doc/my-docs/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("VPCard")) app.component("VPCard", VPCard);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
