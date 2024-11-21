export default {
    head: [
        ['link', { rel: 'icon', href: '/logo2.png' }],
    ],
    title: '风梨团队文档',
    lastUpdated: true,
    description: '风梨团队',
    lang: 'zh-CN',
    themeConfig: {
        siteTitle: '风梨团队文档', //站点标题
        logo: "//api.flweb.cn/logos/logo.webp",
        description: '',
        nav: [
            { text: "主页", link: "/" },
            { text: "bot文档", link: "/bot/" },
            { text: "组织开源项目", link: "/osp/" },
            { text: "风梨网", link: "https://www.flweb.cn/" },
            {
              text: "友情链接",
              items: [
                { text: "MCJPG", link: "https://mcjpg.org/" }
              ]
            }
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/WindyPear-Team" },
        ],
        footer: {
            message: '风梨团队',
            copyright: 'Copyright © 2018-2024 <a href="https://www.flweb.cn/">WindyPear-Team</a>  版权所有'
        },
        lastUpdatedText: "最近更新时间",
        search: {
            provider: "local",
            options: {
              translations: {
                button: {
                  buttonText: "搜索文章",
                  buttonAriaLabel: "搜索文章",
                },
                modal: {
                  noResultsText: "无法找到相关结果",
                  resetButtonTitle: "清除查询条件",
                  footer: {
                    selectText: "选择",
                    navigateText: "切换",
                  },
                },
              },
            },
          },
    },
};
