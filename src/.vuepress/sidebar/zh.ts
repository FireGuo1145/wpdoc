import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/bot/": [
    {
      text: "绮宫梦莉Bot文档",
      icon: "robot",
      children: [
        "/bot/",
        "/bot/bili",
        "/bot/waifu",
        "/bot/mc",
        "/bot/mudl",
        "/bot/credit",
        "/bot/ai",
        "/bot/games",
        "/bot/gameinfo",
      ],
    },
  ],
  "/fluentbbs/": [
    {
      text: "FluentBBS",
      icon: "note",
      children: [
        "/fluentbbs/",
        "/fluentbbs/install",
      ],
    },
  ],
  "/koi/": [
    {
      text: "Koishi 插件",
      icon: "plugin",
      children: [
        "/koi/casdoor",
        "/koi/muteme",
      ],
    },
  ],
  "/papm/": [
    {
      text: "PAPM",
      icon: "code",
      children: [
        "/papm/",
        "/papm/command",
        "/papm/module",
      ],
    },
  ],
});
