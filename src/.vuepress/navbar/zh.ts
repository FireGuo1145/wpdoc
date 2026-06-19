import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "主页",
    link: "/",
  },
  {
    text: "Yumerijs",
    link: "//yumeri.dev",
  },
  {
    text: "通行证 OIDC",
    icon: "key",
    link: "/oidc/",
  },
  {
    text: "bot文档",
    icon: "robot",
    link: "/bot/",
  },
  {
    text: "团队开源项目",
    icon: "folder",
    children: [
      {
        text: "Craft SDK",
        link: "/craft/",
      },
      {
        text: "Koishi插件",
        link: "/koi/",
      },
    ],
  },
  {
    text: "友情链接",
    icon: "link",
    children: [
      {
        text: "MCJPG",
        link: "https://mcjpg.org/",
      },
    ],
  },
]);
