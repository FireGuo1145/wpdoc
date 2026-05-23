---
title: 风梨通行证 OIDC 接入指南
icon: key
index: true
order: 1
---

# 风梨通行证 OIDC 开发者文档

**风梨通行证（OIDCS）** 是风梨团队提供的统一身份认证服务，基于标准的 [OpenID Connect 1.0](https://openid.net/connect/) 与 OAuth 2.0 协议，向开发者开放。第三方应用可以借助风梨通行证完成"一键登录"、获取用户基础资料（UID、用户名、头像、邮箱、手机号等）。

## 服务概览

| 名称 | 地址 | 用途 |
|------|------|------|
| 通行证主站 | <https://account.flweb.cn> | 用户登录、个人资料管理、Issuer |
| 开发者中心 | <https://connect.flweb.cn> | 注册账号、创建/管理应用、查看 client_id/secret |
| 社区移动端 | 风梨社区 App | 同时提供移动端的 Broker 授权 |

OIDC Issuer 为 `https://account.flweb.cn`，对应的元数据可在 <https://account.flweb.cn/.well-known/openid-configuration> 自助发现。

## 支持的接入模式

| 模式 | 适用场景 | 文档 |
|------|----------|------|
| **Web 应用（Authorization Code + PKCE）** | 普通网站、SPA、后端服务 | [Web 应用接入](./web.md) |
| **Mobile Broker（深链 + 风梨社区 App）** | 安卓/iOS 移动 App，需借助风梨社区 App 代理授权 | [移动应用接入](./mobile.md) |
| **Desktop（公钥指纹签名）** | 桌面客户端，需通过开发者中心登记公钥指纹 | 参见 [API 参考](./api.md) |

## 开始之前

1. 阅读 [注册开发者账号与创建应用](./register.md)，拿到 `client_id` 与 `client_secret`
2. 根据你的应用形态选择 Web 或 Mobile 接入流程
3. 跑通 demo 后，可以查阅 [API 参考](./api.md) 了解更高级的能力（如自动续签、用户资料更新事件等）

## 支持的 Scope

| Scope | 含义 |
|-------|------|
| `openid` | 必填。表示请求 OIDC 身份令牌 |
| `profile` | 用户名、头像、签名等公开资料 |
| `email` | 邮箱地址 |
| `phone` | 手机号 |

实际可获取的字段以应用申请时勾选的 scope 为准。**请只申请你确实需要的最小权限**，过度索权可能在审核时被拒绝。

## 名词约定

- **UID**：风梨通行证内的唯一用户编号，8 位数字字符串，作为 OIDC 的 `sub`
- **Broker**：风梨社区 App 内置的"代理授权器"，负责在移动端为其它 App 完成 OAuth 流程
- **Issuer**：身份发行方，固定为 `https://account.flweb.cn`

## 反馈

接入过程中遇到问题，请通过开发者中心右下角的反馈入口提交，或在 [GitHub Issue](https://github.com/WindyPear-Team) 中开 issue。
