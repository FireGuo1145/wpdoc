# 快速开始

## 安装依赖

```bash
yarn install
```

## 启动原版

```ts
import { CraftSDK, API_SOURCE } from "./src/index.js";

const sdk = new CraftSDK({
  apiSource: API_SOURCE.MOJANG,
  sessionFile: "./craft-sdk-session.json",
  timeoutMs: 120000,
});

const exitCode = await sdk.playGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  loader: "vanilla",
  accessToken: "access-token",
  clientToken: "client-token",
  profileId: "profile-id",
  profileName: "Player",
  memory: { min: "512M", max: "2G" },
  jvmArgs: ["-XX:+UseG1GC"],
});

console.log(exitCode);
```

## 启动 Fabric

```ts
await sdk.playGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  loader: "fabric",
  accessToken: "access-token",
  clientToken: "client-token",
  profileId: "profile-id",
  profileName: "Player",
});
```

指定加载器版本：

```ts
await sdk.playGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  loader: "fabric",
  loaderVersion: "0.16.14",
  accessToken: "access-token",
  clientToken: "client-token",
  profileId: "profile-id",
  profileName: "Player",
});
```

## 启动 Forge

```ts
await sdk.playGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  loader: "forge",
  loaderVersion: "47.4.0",
  accessToken: "access-token",
  clientToken: "client-token",
  profileId: "profile-id",
  profileName: "Player",
});
```

`loaderVersion` 可以传完整 Forge Maven 版本，例如 `1.20.1-47.4.0`，也可以只传 `47.4.0`。

## 分步安装和启动

```ts
const prepared = await sdk.installer.prepareVersion("1.20.1", ".minecraft");

await sdk.installer.installMods({
  modPackages: [
    {
      id: "example",
      name: "Example Mod",
      version: "1.0.0",
      loader: "fabric",
      sourceUrl: "https://example.com/example.jar",
    },
  ],
  installTarget: { gameDirectory: ".minecraft", loader: "fabric" },
});

await sdk.launcher.launch(
  {
    version: prepared.metadata.id,
    gameDirectory: ".minecraft",
    assetsDirectory: ".minecraft/assets",
    versionDirectory: prepared.versionDirectory,
    clientJarPath: prepared.clientJarPath,
  },
  prepared.metadata
);
```
