# 帮助菜单扩展

[![npm](https://img.shields.io/npm/v/@windypear/koishi-plugin-menuextend?style=flat-square)](https://www.npmjs.com/package/@windypear/koishi-plugin-menuextend)

可以便捷的对帮助菜单进行分类，并注册子菜单指令。也可用于帮助菜单分类。

## 配置项

### prefix

指令前缀，指的是koishi全局配置里的指令前缀。用于文字生成。

### categories

分类字典，也就是要注册的指令分类。键名为指令名称。

#### categories.xxx.description

分类的描述，也就是指令描述。

#### categories.xxx.header

帮助菜单开头的文本，如：“当前可用的指令列表：”。

#### categories.xxx.footer

帮助菜单结尾的文本，如：“输入 “/help 指令名”以获取该指令详细帮助信息”。

#### categories.xxx.commands

要在菜单里包含的指令和描述的字典。键名为指令名，description为指令描述。

## 使用方法

在配置项填入要进行的分类以及分类下的指令，调用该分类的指令即可显示指令列表。插件无法获取指令列表，只能自行分类并填入。