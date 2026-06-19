# AuthManager

`AuthManager` 管理本地认证会话。当前实现接受外部传入 token，不负责完整 Microsoft/Mojang OAuth 登录流程。

## 构造函数

```ts
new AuthManager(options?: AuthOptions)
```

```ts
interface AuthOptions {
  sessionFile?: string;
}
```

`sessionFile` 默认是 `craft-sdk-session.json`。

## loginWithToken()

```ts
loginWithToken(
  accessToken: string,
  clientToken: string,
  profileId: string,
  profileName: string
): Promise<AuthSession>
```

创建并保存本地 session。

```ts
const session = await sdk.auth.loginWithToken(
  "access-token",
  "client-token",
  "uuid",
  "Player"
);
```

## saveSession()

```ts
saveSession(session: AuthSession): void
```

把 session 写入 `sessionFile`。

## loadSession()

```ts
loadSession(): AuthSession | undefined
```

从 `sessionFile` 读取 session。文件不存在时返回 `undefined`。

## createProfile()

```ts
createProfile(username: string, session?: AuthSession): UserProfile
```

创建一个简单的用户 profile 对象。

## AuthSession

```ts
interface AuthSession {
  accessToken: string;
  clientToken: string;
  selectedProfile?: { id: string; name: string };
  profile?: { id: string; name: string };
  userProperties?: Record<string, unknown>;
  availableProfiles?: Array<{ id: string; name: string }>;
  timestamp: number;
}
```

## 注意事项

使用测试 token 可以启动离线流程，但 Minecraft 仍会尝试访问 Realms 等在线服务，日志里可能出现认证失败。这不等于本地启动失败。
