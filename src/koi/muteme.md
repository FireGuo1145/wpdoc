# 禁言我

[![npm](https://img.shields.io/npm/v/@windypear/koishi-plugin-muteme?style=flat-square)](https://www.npmjs.com/package/@windypear/koishi-plugin-muteme)

muteme，顾名思义就是禁言我，可以让机器人禁言你随机时间，仅供娱乐。

插件名：@windypear/koishi-plugin-muteme

注：适配器需要有禁言功能，目前只在onebot上面进行了实验。

## 配置项

### 禁言模式

有两种模式，随机时间和固定时间，随机时间时可以设置最大值和最小值。

### muteme提示信息

在banMessage里面可以填写被禁言时的提示信息，变量{time}代表被禁言的时间，纯数字，单位是秒。

### mutehim

这个附加功能其实是没有事干的时候随便加上去的，可以做到禁言随机成员，而且有一定概率禁言自己。概率的最大值是1，可以乘上100换成百分制。

mutehim禁言提示信息有两个变量，{time}是禁言时间，{name}是被禁言的用户名。

## 使用方法

很简单，指令muteme是禁言自己，指令mutehim是禁言随机成员。例如，指令前缀是斜线，就使用以下方式：

```
/muteme
/mutehim

```