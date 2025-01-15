import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "主页",
    link: "/",
  },
  {
    text: "bot文档",
    icon: "robot",
    link: "/bot/",
  },
  {
    text: "组织开源项目",
    icon: "folder",
    children: [
      {
        text: "FluentBBS",
        link: "/fluentbbs/",
      },
      {
        text: "PAPM",
        link: "/papm/",
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
