import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "风梨团队文档",
      description: "风梨团队的项目文档",
    },
    "/en/": {
      lang: "en-US",
      title: "WindyPear-Team Documents",
      description: "The Documents for projects of WindyPear Team",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
