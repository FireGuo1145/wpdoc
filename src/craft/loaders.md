# Loader 安装

`Installer.installLoader()` 用于安装 Fabric、Forge 和 Quilt。

```ts
installLoader(options: InstallLoaderOptions): Promise<PreparedVersion>
```

## InstallLoaderOptions

```ts
type LoaderInstallType = "forge" | "fabric" | "quilt";

interface InstallLoaderOptions extends PrepareVersionOptions {
  loader: LoaderInstallType;
  minecraftVersion: string;
  baseDirectory: string;
  loaderVersion?: string;
  javaPath?: string;
  versionDirectory?: string;
  loaderVersionDirectory?: string;
  assetsDirectory?: string;
  librariesDirectory?: string;
}
```

- `loader`: 加载器类型。
- `minecraftVersion`: 原版 Minecraft 版本，例如 `1.20.1`。
- `baseDirectory`: 游戏目录，例如 `.minecraft`。
- `loaderVersion`: 可选。未传时尝试解析最新版本。
- `javaPath`: Forge installer 需要 Java，可显式传入。
- `versionDirectory`: 自定义原版/基础版本目录。
- `loaderVersionDirectory`: 自定义 loader profile 目录。
- `assetsDirectory`: 自定义 assets 目录。
- `librariesDirectory`: 自定义 libraries 目录。
- `validate`: 继承自 `PrepareVersionOptions`，默认启用。

## Fabric

Fabric 通过 `https://meta.fabricmc.net/v2` 获取 loader profile。

```ts
const prepared = await sdk.installer.installLoader({
  loader: "fabric",
  minecraftVersion: "1.20.1",
  baseDirectory: ".minecraft",
});
```

指定 Fabric loader：

```ts
await sdk.installer.installLoader({
  loader: "fabric",
  minecraftVersion: "1.20.1",
  loaderVersion: "0.16.14",
  baseDirectory: ".minecraft",
});
```

安装结果会在 `versions/` 下生成 Fabric profile 版本目录，并下载 Fabric loader 依赖库。

可通过 `loaderVersionDirectory` 指定 Fabric/Quilt/Forge profile 的实际存储目录；`versionDirectory` 则用于原版基础版本。`assetsDirectory` 和 `librariesDirectory` 可用于隔离资源与依赖库。

## Quilt

Quilt 通过 `https://meta.quiltmc.org/v3` 获取 loader profile。

```ts
await sdk.installer.installLoader({
  loader: "quilt",
  minecraftVersion: "1.20.1",
  baseDirectory: ".minecraft",
});
```

## Forge

Forge 使用官方 Maven 仓库和 installer：

```ts
await sdk.installer.installLoader({
  loader: "forge",
  minecraftVersion: "1.20.1",
  loaderVersion: "47.4.0",
  baseDirectory: ".minecraft",
});
```

`loaderVersion` 支持两种写法：

```ts
"47.4.0"
"1.20.1-47.4.0"
```

如果不传 `loaderVersion`，SDK 会读取 Forge Maven metadata，选择匹配当前 Minecraft 版本的最后一个版本。

Forge 安装流程：

1. 准备原版 Minecraft。
2. 下载 `forge-<version>-installer.jar` 到 `installers/`。
3. 执行 `java -jar installer --installClient <baseDirectory>`。
4. 读取 Forge 生成的版本 metadata。
5. 合并原版 metadata 和 Forge metadata。
6. 下载并校验 libraries、assets。

## 启动 loader 版本

使用高级入口：

```ts
const installed = await sdk.installGame({
  version: "1.20.1",
  gameDirectory: ".minecraft",
  runtimeDirectory: ".isolated/runtime/fabric",
  loader: "fabric",
  assetsDirectory: ".isolated/assets",
  librariesDirectory: ".isolated/libraries",
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

分步启动时，使用 `PreparedVersion`：

```ts
const prepared = await sdk.installer.installLoader({
  loader: "fabric",
  minecraftVersion: "1.20.1",
  baseDirectory: ".minecraft",
});

await sdk.launcher.launch(
  {
    version: prepared.metadata.id,
    gameDirectory: ".minecraft",
    assetsDirectory: prepared.assetsDirectory,
    librariesDirectory: prepared.librariesDirectory,
    versionDirectory: prepared.versionDirectory,
    clientJarPath: prepared.clientJarPath,
  },
  prepared.metadata
);
```

## 限制和注意事项

- Forge installer 会启动 Java 子进程，需要本机有可用 Java。
- Fabric/Quilt loader profile 的 libraries 常使用 Maven 坐标，SDK 会自动转换成本地 libraries 路径。
- loader 版本通常没有自己的 client jar，启动时通过 `clientJarPath` 复用原版 jar。
