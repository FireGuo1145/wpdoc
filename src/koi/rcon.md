# MC多服务器管理

这玩意是应客户奇奇怪怪的要求做的，可以注册多个指令管理不同服务器。

[![npm](https://img.shields.io/npm/v/koishi-plugin-multi-rcon?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-multi-rcon)

开源地址：https://github.com/WindyPear-Team/koishi-plugin-multi-rcon.git

## 配置

在配置项里面，可以添加多个服务器。

### 服务器名

用于显示，每次执行命令会显示是从哪个服务器来的

### 命令名称

顾名思义，就是自定义一个命令。注意哦，目前没有鉴权机制，要限制使用命令的话自行去指令管理里面弄权限。

### 指令映射

指令映射的话，可以用来缩短比较长的指令。他会将你调用的指令的前面替换为映射的指令。

比如现在有个指令映射是“白名单”->“whitelist add”，那么执行“白名单 FireGuo”的时候实际执行的就是“whitelist add FireGuo”。当然，可以用它映射整串指令，灵活性挺高的。

不过他只会替换前面，如果中间出现了他不会替换掉。

## 使用

这个插件使用起来很方便，假如自定义的指令是server1，那就可以通过调用“server1 [xxx]”来执行指令。例如：

```
server1 kick FireGuo
```

“喂喂喂，谁把我踢出去了啊喂！”

......

咳咳，言归正传，接在指令后面的参数会原封不动地输回服务器。

总之就是非常好用！