import { defineUserConfig } from "vuepress";
import { webpackBundler } from "@vuepress/bundler-webpack";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  bundler: webpackBundler({
    postcss: {},
    vue: {},
  }),
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
