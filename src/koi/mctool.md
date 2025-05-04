# 与MC服务器互通

### 风梨团队 · MCJPG联合打造！

[![npm](https://img.shields.io/npm/v/koishi-plugin-mctool?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-mctool)

---

## 使用

需搭配Minecraft Webhook插件食用，可查看MCJPG组织仓库：

https://github.com/MineJPGcraft/Minecraft-Webhook

### 账号绑定

正确配置插件后，玩家第一次进入服务器时会被踢出，然后服务器会将验证码显示在玩家的踢出提示中。在机器人在的群聊中输入mc.code [验证码] 即可完成账号绑定流程，至此用户将可以正常加入服务器。

### 账号冻结与解冻

为防止盗号，用户可自行进行账号的冻结与解冻，冻结的账号将无法进入服务器。

/mc.freeze 冻结账号

/mc.unfreeze 解冻账号

### 死亡信息记录

插件会记录服务器通过webhook传来的最新五条死亡记录，但由于默认传入的是英文，所以插件内置了几种翻译配对格式，不过不全。欢迎大家pr补充。

/mc.deaths 查询当前账号最新五条死亡记录

### 登录提示

为防止盗号情况的发生，用户加入服务器后会默认向玩家绑定的QQ号发送登录信息，并提示如果非本人操作请及时冻结账号。

### 玩家数

/mc.list 查看当前玩家个数和最大玩家数
