import comp from "D:/dev/doc/my-docs/src/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"风梨团队文档\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"title\":\"风梨团队文档\",\"icon\":\"home\",\"heroImage\":\"https://api.flweb.cn/logos/logo.webp\",\"heroText\":\"风梨团队\",\"tagline\":\"始终致力于为良好开源生态而努力\",\"actions\":[{\"text\":\"View Us on Github\",\"link\":\"https://github.com/WindyPear-Team\",\"type\":\"primary\"},{\"text\":\"加入我们\",\"icon\":\"lightbulb\",\"link\":\"https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=djBfZaOL48fytzDyifpU9pcNeRBqrYlN&authKey=NUyh%2BZclnM9q7t9da7qKpYw%2FNwSaNiU2oxg0WnoZS7AV70BOF%2BMYC41VFrYzp74E&noverify=0&group_code=475823621\"}],\"features\":[{\"title\":\"绮宫梦莉\",\"icon\":\"robot\",\"details\":\"高性能的QQ/Kook机器人！\",\"link\":\"/bot/\"},{\"title\":\"PAPM\",\"icon\":\"code\",\"details\":\"高仿npm的PHP包管理器\",\"link\":\"/papm/\"},{\"title\":\"Koishi插件\",\"icon\":\"plugin\",\"details\":\"功能简单而独特的插件\",\"link\":\"/koi/\"}],\"copyright\":false,\"footer\":\"风梨团队倾心打造 | Copyright © 2018-2025 WindyPear-Team\",\"gitInclude\":[]},\"headers\":[],\"readingTime\":{\"minutes\":0.48,\"words\":143},\"filePathRelative\":\"index.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
