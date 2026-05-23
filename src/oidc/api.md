---
title: API 参考
icon: code
order: 5
---

# API 参考

本节列出所有公开端点、参数、返回值与错误码。

## OIDC 元数据

```
GET https://account.flweb.cn/.well-known/openid-configuration
```

返回符合 OIDC Discovery 规范的 JSON：

```json
{
  "issuer": "https://account.flweb.cn",
  "authorization_endpoint": "https://account.flweb.cn/v1/login/oauth/authorize",
  "token_endpoint": "https://account.flweb.cn/v1/login/oauth/token",
  "userinfo_endpoint": "https://account.flweb.cn/v1/login/oauth/userinfo",
  "jwks_uri": "https://account.flweb.cn/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "profile", "email", "phone"],
  "code_challenge_methods_supported": ["S256", "plain"],
  "token_endpoint_auth_methods_supported": ["none", "client_secret_basic", "client_secret_post"]
}
```

## JWKS

```
GET https://account.flweb.cn/.well-known/jwks.json
```

返回签名公钥集合，用于校验 `id_token` 签名。

## Authorize

```
GET https://account.flweb.cn/v1/login/oauth/authorize
```

**Query 参数**：

| 名称 | 必填 | 说明 |
|------|------|------|
| `response_type` | ✔ | 固定 `code` |
| `client_id` | ✔ | 应用 ID |
| `redirect_uri` | ✔ | 回调地址，必须与登记一致 |
| `scope` | ✔ | 空格分隔的 scope 列表，必须包含 `openid` |
| `state` | 推荐 | CSRF 防护，回调时原样返回 |
| `nonce` | 推荐 | 防 id_token 重放，会写入 id_token |
| `code_challenge` | ✔ (PKCE) | PKCE challenge |
| `code_challenge_method` | ✔ (PKCE) | `S256` 或 `plain`（强烈推荐 S256）|
| `prompt` | — | 标准值，例如 `login` 强制重新登录 |
| `max_age` | — | 单位秒，超过则强制重新认证 |

**响应**：用户同意后 302 跳转 `redirect_uri?code=...&state=...`

## Token

```
POST https://account.flweb.cn/v1/login/oauth/token
Content-Type: application/x-www-form-urlencoded
```

### 授权码换 token（grant_type=authorization_code）

| 字段 | 必填 | 说明 |
|------|------|------|
| `grant_type` | ✔ | `authorization_code` |
| `code` | ✔ | authorize 返回的 code |
| `redirect_uri` | ✔ | 必须与 authorize 时一致 |
| `client_id` | ✔ | 应用 ID |
| `client_secret` | Web/Desktop 必填，Mobile 省略 | |
| `code_verifier` | ✔ (PKCE) | 原始 verifier |

### 刷新 token（grant_type=refresh_token）

| 字段 | 必填 | 说明 |
|------|------|------|
| `grant_type` | ✔ | `refresh_token` |
| `refresh_token` | ✔ | 之前颁发的 refresh_token |
| `client_id` | ✔ | 应用 ID |
| `client_secret` | Web/Desktop 必填 | |
| `scope` | — | 只能是原 scope 的子集 |

**成功响应**：

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "id_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "openid profile email"
}
```

**错误响应**（标准 OAuth）：

```json
{ "error": "invalid_grant", "error_description": "code expired" }
```

常见 error 码：

| code | 含义 |
|------|------|
| `invalid_request` | 参数缺失或格式错误 |
| `invalid_client` | `client_id` / `client_secret` 错误 |
| `invalid_grant` | code 已用 / 过期 / verifier 不匹配 |
| `unauthorized_client` | 应用未审核通过或被禁用 |
| `unsupported_grant_type` | 不支持的 grant_type |

## Userinfo

```
GET https://account.flweb.cn/v1/login/oauth/userinfo
Authorization: Bearer <access_token>
```

**响应**：

```json
{
  "sub": "12345678",
  "preferred_username": "alice",
  "profile": "alice",
  "email": "alice@example.com",
  "email_verified": true,
  "picture": "https://account.flweb.cn/api/public/avatars/abc.webp",
  "phone_number": "+8613800000000",
  "updated_at": 1735689600
}
```

返回的字段取决于颁发 token 时的 scope：

| Scope | 包含字段 |
|-------|----------|
| `openid` | `sub` |
| `profile` | `preferred_username`、`profile`、`picture`、`updated_at` |
| `email` | `email`、`email_verified` |
| `phone` | `phone_number`、`phone_number_verified` |

## Desktop 端点

桌面客户端**不可携带 client_secret**（容易反编译）。我们用另一种方式保证安全：**应用注册时登记公钥指纹**，每次发起授权时由桌面客户端用对应的私钥**签名 attestation**，服务端校验签名后才允许授权。

### 1. 客户端生成密钥对

```bash
openssl genrsa -out client.key 2048
openssl rsa -in client.key -pubout -out client.pub
# 计算指纹（SHA-256 of PEM 公钥）
openssl dgst -sha256 client.pub
```

把指纹（小写 hex）登记到开发者中心 `publisher_thumbprints` 字段，可登记多个（多设备 / 多构建）。

### 2. 发起授权

调用：

```
POST https://account.flweb.cn/api/broker/desktop/session
Content-Type: application/json

{
  "broker_client_id": "your-desktop-client-id",
  "target_client_id": "your-desktop-client-id",
  "redirect_uri": "http://127.0.0.1:53124/callback",
  "scope": "openid profile email",
  "state": "...",
  "nonce": "...",
  "code_challenge": "...",
  "code_challenge_method": "S256",
  "attestation": {
    "nonce": "<random>",
    "timestamp": <unix ms>,
    "public_key_pem": "<PEM>",
    "signature": "<base64(sign(payload))>"
  }
}
```

attestation payload 是以下字段以 `\n` 拼接：

```
nonce
timestamp
broker_client_id
target_client_id
redirect_uri
code_challenge
code_challenge_method
```

服务端会：
1. 校验签名与指纹
2. 在浏览器中打开授权页（直接打开本机浏览器，回到 `http://127.0.0.1:<port>/callback`）
3. 用户登录后，code 返回到客户端，再走标准的 `/v1/login/oauth/token` 换 token（**省略 client_secret**）

## 撤销 Token（即将开放）

```
POST https://account.flweb.cn/v1/login/oauth/revoke
Content-Type: application/x-www-form-urlencoded
```

字段：

| 字段 | 说明 |
|------|------|
| `token` | 要撤销的 access_token / refresh_token |
| `token_type_hint` | `access_token` 或 `refresh_token` |
| `client_id` / `client_secret` | 同 token 端点 |

## 速率限制

公开端点统一限流：

- 同 IP：15 分钟 1000 次
- 同 client_id：15 分钟 5000 次
- token 端点单独限流：每用户每分钟 60 次

超出会返回 429。响应头会有标准的 `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset`。

## id_token 校验示例

`id_token` 是一个 RS256 JWT，header 形如：

```json
{ "alg": "RS256", "kid": "oidcs-account-rs256", "typ": "JWT" }
```

payload：

```json
{
  "iss": "https://account.flweb.cn",
  "sub": "12345678",
  "aud": "your-client-id",
  "exp": 1735690500,
  "iat": 1735689600,
  "auth_time": 1735689500,
  "nonce": "abc...",
  "preferred_username": "alice",
  "email": "alice@example.com",
  "picture": "https://account.flweb.cn/api/public/avatars/xxx.webp"
}
```

校验项（jose / jsonwebtoken / golang-jwt 等库的标准 verify 选项都覆盖）：

- 签名：从 JWKS 取出对应 `kid` 的公钥校验
- `iss` 必须严格等于 `https://account.flweb.cn`
- `aud` 必须等于你的 `client_id`
- `exp` 必须未过期
- `nonce` 必须与 authorize 时下发的 nonce 一致

## 用户头像

头像 URL 形如 `https://account.flweb.cn/api/public/avatars/<uuid>.webp`，支持公开访问、无需鉴权。

- 文件格式：webp，max 512×512
- CDN 缓存：30 天，immutable
- 没头像的用户 `picture` 字段为空字符串

## 错误码全表

参见上面 Token 章节。其它 4xx/5xx 错误一般会带 JSON：

```json
{ "error": "ERROR_CODE", "message": "human readable" }
```

ERROR_CODE 列表（节选）：

| 码 | 含义 |
|----|------|
| `UNAUTHORIZED` | 缺少或 token 无效 |
| `INVALID_REQUEST` | 参数缺失 |
| `INVALID_BROKER_CLIENT` | broker_client_id 不是合法的移动 Broker |
| `BROKER_SESSION_INVALID` | broker 会话已过期或不匹配 |
| `LOGIN_SESSION_EXPIRED` | 登录中间态过期，需要重走 |
| `HUMAN_VERIFICATION_FAILED` | 人机校验失败 |
| `TARGET_REDIRECT_URI_INVALID` | 目标应用的回调地址未登记 |
