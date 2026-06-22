# Craft SDK API 文档

Craft SDK 是一个 Node.js/TypeScript Minecraft 启动器 SDK，提供版本准备、资源下载、模组加载器安装、模组安装、认证会话管理和游戏启动能力。

## 文档导航

- [快速开始](./getting-started.md)
- [自定义目录安装与启动示例](./custom-directories.md)
- [CraftSDK 高级入口](./craft-sdk.md)
- [AuthManager 认证会话](./auth-manager.md)
- [Installer 安装器](./installer.md)
- [Loader 安装](./loaders.md)
- [Downloader 下载器](./downloader.md)
- [GameLauncher 启动器](./game-launcher.md)
- [类型模型](./models.md)
- [测试命令](./testing.md)

## 模块入口

从 `src/index.ts` 导出的公开 API：

```ts
export {
  CraftSDK,
  type CraftSdkOptions,
  type InstallGameOptions,
  type LaunchGameOptions,
  type PlayGameOptions,
} from "./sdk.js";
export { AuthManager } from "./auth.js";
export { Downloader } from "./downloader.js";
export { Installer } from "./installer.js";
export { GameLauncher } from "./launcher.js";
export { API_SOURCE, API_ENDPOINTS, type ApiSource } from "./constant.js";
export type { LaunchOptions, InstallOptions } from "./models/options.js";
export type { AuthSession, UserProfile } from "./models/profile.js";
export type { VersionMetadata } from "./models/version.js";
```

## 主要能力

- 准备原版 Minecraft 版本，包括 client jar、libraries、assets index、assets objects。
- 安装 Fabric、Forge、Quilt 加载器版本。
- 按 SHA1 校验已下载文件，缓存损坏时重新下载。
- 生成 Minecraft 启动参数并启动 Java 进程。
- 保存和读取本地认证会话。
- 下载外部 mod jar 到指定 mods 目录。

## 目录约定

默认安装文件以 `gameDirectory` 作为基准目录，例如 `.minecraft`：

```text
.minecraft/
  assets/
    indexes/
    objects/
  libraries/
  versions/
```

启动时的 `gameDirectory` 是运行实例目录，会传给 Minecraft 的 `--gameDir`。如果需要版本隔离，应为每个版本或 profile 传独立的运行目录；saves、config、resourcepacks、screenshots、logs 和 `options.txt` 都会落在该目录下。
