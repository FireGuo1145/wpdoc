export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/index.html.js"), meta: {"t":"风梨团队文档","i":"home"} }],
  ["/en/", { loader: () => import(/* webpackChunkName: "en_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/index.html.js"), meta: {"t":"风梨团队文档","i":"home"} }],
  ["/en/", { loader: () => import(/* webpackChunkName: "en_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/index.html.js"), meta: {"t":"Home"} }],
  ["/fluentbbs/", { loader: () => import(/* webpackChunkName: "fluentbbs_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/fluentbbs/index.html.js"), meta: {"t":"概览"} }],
  ["/bot/ai.html", { loader: () => import(/* webpackChunkName: "bot_ai.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/ai.html.js"), meta: {"t":"AI聊天功能"} }],
  ["/bot/bili.html", { loader: () => import(/* webpackChunkName: "bot_bili.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/bili.html.js"), meta: {"t":"B站视频解析"} }],
  ["/bot/credit.html", { loader: () => import(/* webpackChunkName: "bot_credit.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/credit.html.js"), meta: {"t":"积分系统"} }],
  ["/bot/gameinfo.html", { loader: () => import(/* webpackChunkName: "bot_gameinfo.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/gameinfo.html.js"), meta: {"t":"游戏查询"} }],
  ["/bot/games.html", { loader: () => import(/* webpackChunkName: "bot_games.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/games.html.js"), meta: {"t":"娱乐游戏"} }],
  ["/bot/", { loader: () => import(/* webpackChunkName: "bot_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/index.html.js"), meta: {"t":"绮宫梦莉"} }],
  ["/bot/mc.html", { loader: () => import(/* webpackChunkName: "bot_mc.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/mc.html.js"), meta: {"t":"MC查询"} }],
  ["/bot/mudl.html", { loader: () => import(/* webpackChunkName: "bot_mudl.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/mudl.html.js"), meta: {"t":"音乐下载"} }],
  ["/bot/waifu.html", { loader: () => import(/* webpackChunkName: "bot_waifu.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/bot/waifu.html.js"), meta: {"t":"娶群友"} }],
  ["/guide/", { loader: () => import(/* webpackChunkName: "guide_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/guide/index.html.js"), meta: {"t":"Guide","i":"lightbulb"} }],
  ["/koi/casdoor.html", { loader: () => import(/* webpackChunkName: "koi_casdoor.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/koi/casdoor.html.js"), meta: {"t":"Casdoor 账号系统对接"} }],
  ["/koi/", { loader: () => import(/* webpackChunkName: "koi_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/koi/index.html.js"), meta: {"t":"Koishi 插件"} }],
  ["/papm/command.html", { loader: () => import(/* webpackChunkName: "papm_command.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/papm/command.html.js"), meta: {"t":"命令文档"} }],
  ["/papm/", { loader: () => import(/* webpackChunkName: "papm_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/papm/index.html.js"), meta: {"t":"PAPM"} }],
  ["/papm/module.html", { loader: () => import(/* webpackChunkName: "papm_module.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/papm/module.html.js"), meta: {"t":"模块基础结构"} }],
  ["/en/bot/ai.html", { loader: () => import(/* webpackChunkName: "en_bot_ai.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/ai.html.js"), meta: {"t":"AI聊天功能"} }],
  ["/en/bot/bili.html", { loader: () => import(/* webpackChunkName: "en_bot_bili.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/bili.html.js"), meta: {"t":"B站视频解析"} }],
  ["/en/bot/credit.html", { loader: () => import(/* webpackChunkName: "en_bot_credit.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/credit.html.js"), meta: {"t":"积分系统"} }],
  ["/en/bot/gameinfo.html", { loader: () => import(/* webpackChunkName: "en_bot_gameinfo.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/gameinfo.html.js"), meta: {"t":"游戏查询"} }],
  ["/en/bot/games.html", { loader: () => import(/* webpackChunkName: "en_bot_games.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/games.html.js"), meta: {"t":"娱乐游戏"} }],
  ["/en/bot/", { loader: () => import(/* webpackChunkName: "en_bot_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/index.html.js"), meta: {"t":"绮宫梦莉"} }],
  ["/en/bot/mc.html", { loader: () => import(/* webpackChunkName: "en_bot_mc.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/mc.html.js"), meta: {"t":"MC查询"} }],
  ["/en/bot/mudl.html", { loader: () => import(/* webpackChunkName: "en_bot_mudl.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/mudl.html.js"), meta: {"t":"音乐下载"} }],
  ["/en/bot/waifu.html", { loader: () => import(/* webpackChunkName: "en_bot_waifu.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/bot/waifu.html.js"), meta: {"t":"娶群友"} }],
  ["/en/fluentbbs/", { loader: () => import(/* webpackChunkName: "en_fluentbbs_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/fluentbbs/index.html.js"), meta: {"t":"概览"} }],
  ["/en/koi/casdoor.html", { loader: () => import(/* webpackChunkName: "en_koi_casdoor.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/koi/casdoor.html.js"), meta: {"t":"Casdoor 账号系统对接"} }],
  ["/en/koi/", { loader: () => import(/* webpackChunkName: "en_koi_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/koi/index.html.js"), meta: {"t":"Koishi 插件"} }],
  ["/en/papm/command.html", { loader: () => import(/* webpackChunkName: "en_papm_command.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/papm/command.html.js"), meta: {"t":"命令文档"} }],
  ["/en/papm/", { loader: () => import(/* webpackChunkName: "en_papm_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/papm/index.html.js"), meta: {"t":"PAPM"} }],
  ["/en/papm/module.html", { loader: () => import(/* webpackChunkName: "en_papm_module.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/en/papm/module.html.js"), meta: {"t":"模块基础结构"} }],
  ["/guide/bar/baz.html", { loader: () => import(/* webpackChunkName: "guide_bar_baz.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/guide/bar/baz.html.js"), meta: {"t":"Baz","i":"circle-info"} }],
  ["/guide/bar/", { loader: () => import(/* webpackChunkName: "guide_bar_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/guide/bar/index.html.js"), meta: {"t":"Bar feature","i":"lightbulb"} }],
  ["/guide/foo/ray.html", { loader: () => import(/* webpackChunkName: "guide_foo_ray.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/guide/foo/ray.html.js"), meta: {"t":"Ray","i":"circle-info"} }],
  ["/guide/foo/", { loader: () => import(/* webpackChunkName: "guide_foo_index.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/guide/foo/index.html.js"), meta: {"t":"Foo feature","i":"lightbulb"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"D:/dev/doc/my-docs/src/.vuepress/.temp/pages/404.html.js"), meta: {"t":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
