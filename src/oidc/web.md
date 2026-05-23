---
title: Web 应用接入
icon: globe
order: 3
---

# Web 应用接入

Web 应用使用标准的 **Authorization Code + PKCE** 流程接入风梨通行证。本文以 Node.js / Express 为示例，思路同样适用于 PHP、Python、Go 等服务端框架，以及 SPA（React/Vue）。

## 接入概览

```
┌────────┐                     ┌────────────┐                    ┌──────────────┐
│ 用户   │  1. 点击"通行证登录" │ 你的网站   │ 2. 重定向到 authorize │ account.flweb.cn │
│        │ ───────────────────►│            │ ──────────────────►│              │
│        │                     │            │                    │              │
│        │ 3. 用户在通行证页面登录并同意授权                                      │
│        │ ◄──────────────────────────────────────────────────────────────────── │
│        │                     │            │  4. redirect_uri + code            │
│        │                     │ 你的网站   │ ◄──────────────────│              │
│        │                     │ /callback  │                    │              │
│        │                     │            │ 5. POST /token + code + verifier   │
│        │                     │            │ ──────────────────►│              │
│        │                     │            │ ◄──────────────────│              │
│        │                     │            │   access_token / id_token          │
└────────┘                     └────────────┘                    └──────────────┘
```

## 端点速查

| 名称 | URL |
|------|-----|
| Issuer | `https://account.flweb.cn` |
| Discovery | `https://account.flweb.cn/.well-known/openid-configuration` |
| JWKS | `https://account.flweb.cn/.well-known/jwks.json` |
| Authorize | `https://account.flweb.cn/v1/login/oauth/authorize` |
| Token | `https://account.flweb.cn/v1/login/oauth/token` |
| Userinfo | `https://account.flweb.cn/v1/login/oauth/userinfo` |

`id_token` 使用 **RS256** 签名，可通过 JWKS 获取公钥校验。

## 一步步实现

### 1. 准备 PKCE

PKCE 让授权码即使在中间环节被截获也无法被换取 token。**强烈建议所有 Web 应用（包括有 client_secret 的后端应用）都启用 PKCE。**

```js
import crypto from 'node:crypto';

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function toCodeChallengeS256(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}
```

### 2. 发起授权请求

```js
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser());

const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'https://blog.example.com/callback';
const ISSUER = 'https://account.flweb.cn';

app.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = toCodeChallengeS256(codeVerifier);

  // 把 state / verifier / nonce 存到 httpOnly cookie 或服务端会话
  res.cookie('oidc_pending', JSON.stringify({ state, nonce, codeVerifier }), {
    httpOnly: true, sameSite: 'lax', secure: true, maxAge: 10 * 60 * 1000
  });

  const url = new URL(`${ISSUER}/v1/login/oauth/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  res.redirect(url.toString());
});
```

### 3. 处理回调，换取 Token

```js
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const pending = JSON.parse(req.cookies.oidc_pending || '{}');
  res.clearCookie('oidc_pending');

  if (!code || !state || state !== pending.state) {
    return res.status(400).send('Invalid state');
  }

  const tokenRes = await fetch(`${ISSUER}/v1/login/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code_verifier: pending.codeVerifier
    })
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(500).send(`Token exchange failed: ${err}`);
  }

  const tokens = await tokenRes.json();
  // tokens = { access_token, refresh_token, id_token, expires_in, token_type: 'Bearer', scope }

  // 在这里把 access_token / refresh_token 存到你的服务端会话里
  // 不要返回给前端
  req.session = { ...tokens, expiresAt: Date.now() + tokens.expires_in * 1000 };
  res.redirect('/');
});
```

### 4. 校验 id_token（推荐）

```js
import * as jose from 'jose';

const JWKS = jose.createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

async function verifyIdToken(idToken, expectedNonce) {
  const { payload } = await jose.jwtVerify(idToken, JWKS, {
    issuer: ISSUER,
    audience: CLIENT_ID
  });
  if (expectedNonce && payload.nonce !== expectedNonce) {
    throw new Error('nonce mismatch');
  }
  return payload;
  // payload.sub === 用户 UID
}
```

### 5. 获取用户资料

获取到 access_token 后，调用 userinfo 端点：

```js
const res = await fetch(`${ISSUER}/v1/login/oauth/userinfo`, {
  headers: { Authorization: `Bearer ${tokens.access_token}` }
});
const user = await res.json();
// {
//   sub: '12345678',
//   preferred_username: 'alice',
//   email: 'alice@example.com',
//   email_verified: true,
//   picture: 'https://account.flweb.cn/api/public/avatars/xxx.webp',
//   phone_number: '+86 138...'   // 仅在 scope 含 phone 时返回
// }
```

### 6. 刷新 Token

access_token 默认 15 分钟过期；可用 refresh_token 续签：

```js
const res = await fetch(`${ISSUER}/v1/login/oauth/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  })
});
```

返回结构同 token 端点。**refresh_token 可能轮换**（响应里出现新的 refresh_token），请总是覆盖保存。

## SPA（纯前端）接入

如果你的应用没有后端，只有浏览器端代码：

1. 注册应用时**不要使用 client_secret**（前端 SPA 应注册为 type=web 但只使用 PKCE）
2. token 端点的 `client_secret` 参数留空
3. 把 access_token 和 refresh_token 存在内存 / `sessionStorage`（**不要存 localStorage**，防 XSS）
4. 实际线上 SPA 建议反向代理一个最小的后端来持有 refresh_token，再以 cookie 形式向 SPA 暴露会话

## 错误处理

| 场景 | 现象 | 处理 |
|------|------|------|
| `redirect_uri` 不在白名单 | authorize 直接返回 400 | 检查后台登记的回调地址是否与请求一致 |
| `state` 不匹配 | 回调失败 | 用户可能跨设备打开或被攻击；提示重新登录 |
| `invalid_grant` | token 端点 400 | code 已用过 / 已过期（5 分钟），引导重新登录 |
| `id_token` 校验失败 | jwtVerify 抛错 | 检查时钟、aud、iss、签名公钥缓存 |

## 安全 Checklist

- [x] 始终使用 PKCE（即使有 client_secret）
- [x] 校验 `state` 与 `nonce`
- [x] 校验 `id_token` 的签名、`iss`、`aud`、过期时间
- [x] `client_secret` 仅在服务端使用，永远不出现在前端打包产物
- [x] access_token / refresh_token 不要写进 localStorage
- [x] 回调地址全部使用 https（本机调试除外）
- [x] 退出登录时调用 `/v1/login/oauth/revoke`（即将开放）撤销 refresh_token

## 完整 Demo

参考 [`packages/connect`](https://github.com/WindyPear-Team) 仓库 —— 它本身就是一个生产中的 OIDC Web 客户端，用 Express + EJS 实现，可以照搬。
