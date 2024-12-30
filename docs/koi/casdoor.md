## Casdoor 账号系统对接

由于团队需求，我们开发了一个与casdoor账号系统对接的插件，目前支持最基本的登录（需要给机器人发送回调URL）以及修改score（我们这里统称为积分）。

casdoor的相关使用教程建议去自行查看，反正是一个sso、oauth等的开源鉴权系统。

开源链接：https://github.com/WindyPear-Team/koishi-plugin-adapter-casdoor

npm包名：koishi-plugin-adapter-casdoor[![npm](https://img.shields.io/npm/v/koishi-plugin-adapter-casdoor?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-adapter-casdoor)

### 配置插件

创建一个组织（不建议使用build-in），什么都可以随便取，但score建议开启（不开也没关系），用于当做积分系统。

创建该组织下的一个应用，专用于bot，然后把应用id和应用秘钥复制下来备用。新增一个回调链接，最好是一个无论传递什么参数都返回空白html的网页。

将Casdoor地址、应用id、应用秘钥、组织名、回调的网页链接填到插件配置里面，后端地址如果可以的话尽量使用内网地址（更快一些），不行的话就用前面写的Casdoor地址。

### 使用

输入“cas bind”可以生成账号绑定的链接，用户进入这个链接就会来到casdoor的登录页面。登录之后，会返回到之前设置的空白回调查。现在，用户只需要输入cas link [回调页链接]就可以绑定casdoor账号了，是不是很简单？

### 目前存在的问题

我们不是很会对接权限系统和rate-limit，导致设置积分以及单日签到次数限制还没做，请自行在后台指令管理里面加上喔！