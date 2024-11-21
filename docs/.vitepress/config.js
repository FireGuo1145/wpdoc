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
        sidebar: {
            // 当用户位于 `bot` 目录时，会显示此侧边栏
            '/bot/': [
                {
                    text: 'bot文档',
                    items: [
                        { text: '概览', link: '/bot/' },
                        { text: 'B站解析', link: '/bot/bili' },
                        { text: '娶群友', link: '/bot/waifu' },
                        { text: 'MC查询', link: '/bot/mc' },
                        { text: '音乐下载', link: '/bot/mudl' },
                        { text: '积分系统', link: '/bot/credit' },
                        { text: 'AI聊天', link: '/bot/ai' },
                        { text: '娱乐功能', link: '/bot/games' },
                        { text: '游戏查询', link: '/bot/gameinfo' }
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/WindyPear-Team" },
        ],
        footer: {
            message: '风梨团队',
            copyright: 'Copyright © 2018-2024 <a href="https://www.flweb.cn/">WindyPear-Team</a> 版权所有'
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