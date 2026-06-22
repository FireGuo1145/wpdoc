# AuthManager

`AuthManager` 管理本地认证会话，并内置 Microsoft/Xbox/Minecraft Services 登录链路。

## 构造函数

```ts
new AuthManager(options?: AuthOptions)
```

```ts
interface AuthOptions {
  sessionFile?: string;
  microsoftAuth?: MicrosoftAuthOptions;
}
```

`sessionFile` 默认是 `craft-sdk-session.json`。

## Microsoft 设备码登录

适合桌面启动器和 CLI，不需要本地 HTTP 回调服务。

```ts
const session = await sdk.auth.loginWithMicrosoftDeviceCode({
  clientId: "your-microsoft-app-client-id",
  onVerification: ({ verificationUri, userCode, message }) => {
    console.log(message);
    console.log(`Open ${verificationUri} and enter ${userCode}`);
  },
});
```

SDK 会自动完成：

1. Microsoft OAuth device code。
2. Xbox Live `user/authenticate`。
3. XSTS `xsts/authorize`。
4. Minecraft Services `login_with_xbox`。
5. Minecraft profile 获取。
6. 写入本地 `AuthSession`。

## Microsoft 授权码登录

适合有 redirect URI 的应用。

```ts
const url = sdk.auth.getMicrosoftAuthorizationUrl({
  clientId: "your-microsoft-app-client-id",
  redirectUri: "http://localhost:3000/callback",
  state: "csrf-token",
});

// 浏览器回调拿到 code 后：
const session = await sdk.auth.loginWithMicrosoftAuthorizationCode(code, {
  clientId: "your-microsoft-app-client-id",
  redirectUri: "http://localhost:3000/callback",
});
```

## 刷新 Microsoft 会话

```ts
const session = sdk.auth.loadSession();
if (sdk.auth.isSessionExpired(session)) {
  await sdk.auth.refreshMicrosoftSession(session);
}
```

`loginWithMicrosoftDeviceCode()` 默认请求 `XboxLive.signin offline_access`，因此会话中会保存 `refreshToken`。

## 外部 Token 登录

```ts
await sdk.auth.loginWithToken(
  "access-token",
  "client-token",
  "uuid",
  "Player"
);
```

这个方法保留给已经由外部系统完成认证的场景。

## AuthSession

```ts
interface AuthSession {
  accessToken: string;
  clientToken: string;
  provider?: "external" | "microsoft";
  expiresAt?: number;
  refreshToken?: string;
  xuid?: string;
  selectedProfile?: { id: string; name: string };
  profile?: { id: string; name: string };
  userProperties?: Record<string, unknown>;
  availableProfiles?: Array<{ id: string; name: string }>;
  timestamp: number;
}
```
