# PAPM

## 介绍

papm，全称PHP App Package Manager，是由风梨团队开发、前主要用于团队内部使用的PHP cli包管理及脚本管理工具，操作流程类似于yarn，可以看作为yarn的PHP复刻版。

## 安装

目前仅通过压缩包格式提供，请自行将papm软链接到/usr/bin

下载地址：https://registry-papm.flweb.cn/papm/papm-1.0.0.zip

## 基本概念

papm使用package.php存储包信息，返回一个array，格式参考npm的package.json。papm支持composer和原生papm两种依赖，其中原生papm包可以使用自定义脚本等附加功能。

## 使用

如前文所说，papm操作模式与yarn类似，不加任何参数为安装package.php里面的所有依赖，包括composer依赖和papm依赖。