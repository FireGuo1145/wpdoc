---
title: 移动应用接入（Broker）
icon: mobile
order: 4
---

# 移动应用接入（Broker 模式）

移动 App 不像 Web 那样有"浏览器跳转"，传统 OAuth 在 App 内通过 WebView 完成授权又容易遭到钓鱼。**风梨通行证为移动端提供了一种 Broker 模式**：

> 你的移动 App 通过自定义 scheme（如 `myapp://oauth/callback`）发起授权请求 → **风梨社区 App** 接管授权流程 → 用户在风梨社区 App 中确认 → 风梨社区 App 把授权码回传到你的 App 的自定义 scheme。

整个过程不需要打开 WebView，体验类似于"用微信 / Apple 一键登录"。

## 前置条件

- 用户**手机已安装风梨社区 App**（如未安装，需要引导跳转下载页）
- 你的应用类型在开发者中心注册为 `mobile`
- 你的应用回调地址为自定义 scheme，例如 `myapp://oauth/callback`（必须事先在开发者中心登记）

## 流程总览

```
┌──────────┐                   ┌──────────────┐                ┌──────────────┐
│ 你的 App │ 1. 跳深链         │ 风梨社区 App │ 2. 用户已登录？│ 风梨通行证   │
│          │ ────────────────► │              │   否 → 登录页  │              │
│          │ oidcs-broker://   │              │   是 → 同意页  │              │
│          │ authorize?...     │              │ ────────────► │              │
│          │                   │              │ ◄─────────────│              │
│          │                   │ 3. 用户同意   │   颁发授权码  │              │
│          │                   │              │                │              │
│          │ 4. 回深链          │              │                │              │
│          │ ◄────────────────│              │                │              │
│          │ myapp://oauth/    │              │                │              │
│          │ callback?code=... │              │                │              │
│          │                   │              │                │              │
│          │ 5. 你的 App 拿 code + verifier 直接调用 token 端点 → access_token │
└──────────┘                   └──────────────┘                └──────────────┘
```

## 第一步：在开发者中心登记

应用类型选 **mobile**，回调地址写自定义 scheme，例如：

```
myapp://oauth/callback
```

::: warning Scheme 命名约定
- 必须全小写、字母数字
- 至少 3 个字符
- 建议加上你的应用名前缀以避免冲突，例如 `windyblog-ios://oauth/callback`
:::

## 第二步：移动端配置自定义 scheme

### Android（uni-app / 原生）

`AndroidManifest.xml`：

```xml
<activity android:name=".MainActivity" ...>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" android:host="oauth" />
  </intent-filter>
</activity>
```

uni-app `manifest.json`：

```json
{
  "app-plus": {
    "distribute": {
      "android": {
        "schemes": "myapp"
      }
    }
  }
}
```

### iOS

`Info.plist`：

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>myapp</string></array>
  </dict>
</array>
```

## 第三步：发起授权

在你的 App 内构造一个 `oidcs-broker://authorize` 深链并打开它。社区 App 会接管：

```js
import crypto from 'crypto-js' // 或任意 SHA-256 库

function generateCodeVerifier() {
  // 32 字节 base64url
  const arr = new Uint8Array(32)
  for (let i = 0; i < 32; i++) arr[i] = Math.floor(Math.random() * 256)
  return base64url(arr)
}

function sha256Base64Url(input) {
  return base64url(crypto.SHA256(input).toString(crypto.enc.Hex))
}

function startBrokerLogin() {
  const state = randomString(24)
  const nonce = randomString(24)
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = sha256Base64Url(codeVerifier)

  // 自己存好 verifier，之后换 token 用
  uni.setStorageSync('oidc_pending', JSON.stringify({ state, nonce, codeVerifier }))

  const url = new URL('oidcs-broker://authorize')
  url.searchParams.set('client_id', 'your-client-id')
  url.searchParams.set('redirect_uri', 'myapp://oauth/callback')
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('state', state)
  url.searchParams.set('nonce', nonce)
  url.searchParams.set('code_challenge', codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')

  // 跳转风梨社区 App
  if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.openURL) {
    plus.runtime.openURL(url.toString())
  } else {
    window.location.href = url.toString()
  }
}
```

::: tip 没装风梨社区 App 怎么办
深链调用失败时，可以兜底跳到下载页：<https://account.flweb.cn/download>。可以通过捕获跳转异常或在 5 秒后未拿到回调来判断。
:::

## 第四步：处理回调

社区 App 完成授权后会调用你的自定义 scheme：

```
myapp://oauth/callback?code=abcdef123&state=xxx
```

uni-app 在 `App.vue` 里监听 `plus.runtime.arguments`：

```js
// App.vue
export default {
  onLaunch() { this.handle() },
  onShow() { this.handle() },
  methods: {
    handle() {
      const raw = (typeof plus !== 'undefined' && plus.runtime && plus.runtime.arguments) || ''
      if (!raw || raw.indexOf('myapp://oauth/callback') !== 0) return
      const url = new URL(raw)
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      if (!code) return
      this.exchangeCode(code, state)
    }
  }
}
```

::: tip 安卓系统行为
安卓 5.0+ 在 cold start 时会把启动 intent 的 data 放在 `plus.runtime.arguments`；warm start 通过 onShow 也能拿到。两个钩子都要监听。
:::

## 第五步：拿 code 换 token

注意 **移动应用不要保存 client_secret 在 App 内**（容易反编译泄漏）。我们已经在开发者中心为 `mobile` 类型的应用允许了"无 client_secret 的 token 交换"，只要 PKCE 校验通过即可。

```js
async function exchangeCode(code, state) {
  const pending = JSON.parse(uni.getStorageSync('oidc_pending') || '{}')
  if (state !== pending.state) throw new Error('state mismatch')

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'myapp://oauth/callback',
    client_id: 'your-client-id',
    code_verifier: pending.codeVerifier
  })

  const res = await uni.request({
    url: 'https://account.flweb.cn/v1/login/oauth/token',
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    data: body.toString()
  })

  const tokens = res.data
  // tokens.access_token / refresh_token / id_token / expires_in / scope
  uni.setStorageSync('my_session', JSON.stringify({
    ...tokens,
    expiresAt: Date.now() + tokens.expires_in * 1000
  }))
}
```

## 第六步：获取用户资料 / 刷新 token

与 [Web 应用](./web.md) 完全相同：

```js
// 获取用户
uni.request({
  url: 'https://account.flweb.cn/v1/login/oauth/userinfo',
  header: { authorization: `Bearer ${session.access_token}` }
})

// 刷新
uni.request({
  url: 'https://account.flweb.cn/v1/login/oauth/token',
  method: 'POST',
  header: { 'content-type': 'application/x-www-form-urlencoded' },
  data: `grant_type=refresh_token&refresh_token=${rt}&client_id=your-client-id`
})
```

## 完整流程图

```
你的 App      风梨社区 App           account.flweb.cn
  │              │                        │
  │ ① 深链跳转    │                        │
  │─────────────►│                        │
  │              │ ② 用户登录/同意页       │
  │              │───────────────────────►│
  │              │                        │
  │              │ ③ 颁发授权码 + 回调     │
  │              │◄───────────────────────│
  │              │                        │
  │ ④ 回调深链   │                        │
  │◄─────────────│                        │
  │              │                        │
  │ ⑤ POST /token + code + code_verifier  │
  │──────────────────────────────────────►│
  │ ⑥ access_token + id_token             │
  │◄──────────────────────────────────────│
```

## 安全建议

- **不要保存 client_secret 在 App 内**。`mobile` 类型应用允许 token 端点省略 `client_secret`，PKCE 已经能保证安全。
- 把 `access_token` 和 `refresh_token` 存到平台安全存储：
  - Android: `EncryptedSharedPreferences`
  - iOS: Keychain
  - uni-app: `uni.setStorageSync` 在 App 包里默认走系统数据目录，已经受应用沙箱保护，但**最好不要导出到云备份**。
- 同一个用户在多设备上登录时，refresh_token 是绑定设备指纹的，**不要把它在多设备间共享**。
- 退出登录时调用 `/v1/login/oauth/revoke` 撤销 refresh_token。

## 桌面客户端（额外说明）

桌面应用同样支持 Broker，但因为没有"风梨社区桌面 App"，桌面端走的是另一条路径：**公钥指纹签名 + 本地浏览器回环**。详见 [API 参考 § Desktop 端点](./api.md#desktop-端点)。
