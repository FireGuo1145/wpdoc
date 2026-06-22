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

const installed = await sdk.installGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  runtimeDirectory: ".minecraft-instances/vanilla-1.20.1",
  loader: "vanilla",
});

const exitCode = await sdk.launchGame({
  metadata: installed.metadata,
  gameDirectory: installed.gameDirectory,
  assetsDirectory: installed.assetsDirectory,
  librariesDirectory: installed.librariesDirectory,
  versionDirectory: installed.versionDirectory,
  clientJarPath: installed.clientJarPath,
  loader: installed.loader,
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
const installed = await sdk.installGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  runtimeDirectory: ".minecraft-instances/fabric-1.20.1",
  loader: "fabric",
});

await sdk.launchGame({
  metadata: installed.metadata,
  gameDirectory: installed.gameDirectory,
  assetsDirectory: installed.assetsDirectory,
  librariesDirectory: installed.librariesDirectory,
  versionDirectory: installed.versionDirectory,
  clientJarPath: installed.clientJarPath,
  loader: installed.loader,
  accessToken: "access-token",
  clientToken: "client-token",
  profileId: "profile-id",
  profileName: "Player",
});
```

指定加载器版本：

```ts
await sdk.installGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  runtimeDirectory: ".minecraft-instances/fabric-1.20.1",
  loader: "fabric",
  loaderVersion: "0.16.14",
});
```

## 启动 Forge

```ts
await sdk.installGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  runtimeDirectory: ".minecraft-instances/forge-1.20.1",
  loader: "forge",
  loaderVersion: "47.4.0",
});
```

`loaderVersion` 可以传完整 Forge Maven 版本，例如 `1.20.1-47.4.0`，也可以只传 `47.4.0`。

## 分步安装和启动

```ts
const installed = await sdk.installGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  runtimeDirectory: ".isolated/runtime/fabric",
  loader: "fabric",
  versionDirectory: ".isolated/versions/1.20.1",
  loaderVersionDirectory: ".isolated/versions/fabric",
  assetsDirectory: ".isolated/assets",
  librariesDirectory: ".isolated/libraries",
  modsDirectory: ".isolated/mods",
  mods: [
    {
      id: "example",
      name: "Example Mod",
      version: "1.0.0",
      loader: "fabric",
      sourceUrl: "https://example.com/example.jar",
    },
  ],
});

await sdk.launchGame({
  metadata: installed.metadata,
  gameDirectory: installed.gameDirectory,
  assetsDirectory: installed.assetsDirectory,
  librariesDirectory: installed.librariesDirectory,
  versionDirectory: installed.versionDirectory,
  clientJarPath: installed.clientJarPath,
  loader: installed.loader,
});
```
