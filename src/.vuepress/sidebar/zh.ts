import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/oidc/": [
    {
      text: "风梨通行证 OIDC",
      icon: "key",
      children: [
        "/oidc/",
        "/oidc/register",
        "/oidc/web",
        "/oidc/mobile",
        "/oidc/api",
      ],
    },
  ],
  "/bot/": [
    {
      text: "绮宫梦莉Bot文档",
      icon: "robot",
      children: [
        "/bot/",
        "/bot/manage",
        "/bot/bili",
        "/bot/waifu",
        "/bot/mc",
        "/bot/credit",
        "/bot/games",
        "/bot/gameinfo",
        "/bot/interaction",
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
        "/koi/",
        "/koi/casdoor",
        "/koi/muteme",
        "/koi/tdz",
        "/koi/menuextend",
        "/koi/autocheck",
        "/koi/rcon",
        "/koi/gsuid-adapter",
        "/koi/calculator",
        "/koi/giftcard",
        "/koi/mctool",
        "/koi/adapter-mc",
      ],
    },
  ],
  "/craft/": [
    {
      text: "Craft SDK",
      icon: "code",
      children: [
        "/craft/",
        "/craft/getting-started",
        "/craft/craft-sdk",
        "/craft/auth-manager",
        "/craft/downloader",
        "/craft/game-launcher",
        "/craft/installer",
        "/craft/loaders",
        "/craft/models",
        "/craft/testing",
      ],
    },
  ],
});
