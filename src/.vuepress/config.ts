import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
  locales: {
    "/": {
      lang: "zh-CN",
      title: "风梨科技产品文档",
      description: "风梨科技的产品文档",
    },
    "/en/": {
      lang: "en-US",
      title: "WindyPear-Tech Documents",
      description: "The Documents for projects of WindyPear Tech",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
