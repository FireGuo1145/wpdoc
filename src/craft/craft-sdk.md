# CraftSDK

`CraftSDK` 是推荐使用的高级入口。它组合了 `AuthManager`、`Downloader`、`Installer` 和 `GameLauncher`。

## 构造函数

```ts
new CraftSDK(options?: CraftSdkOptions)
```

### CraftSdkOptions

```ts
interface CraftSdkOptions {
  apiSource?: "mojang" | "bmclapi";
  timeoutMs?: number;
  sessionFile?: string;
  process?: DownloadProcessCallback;
}
```

- `apiSource`: API 来源，默认 `API_SOURCE.MOJANG`。
- `timeoutMs`: 下载超时时间，默认由各模块使用 `30000`。
- `sessionFile`: 认证会话文件路径，默认 `craft-sdk-session.json`。
- `process`: 默认下载进度回调，会透传给 `downloader` 和 `installer`。

## 属性

```ts
sdk.auth: AuthManager
sdk.downloader: Downloader
sdk.installer: Installer
sdk.launcher: GameLauncher
```

## installGame()

```ts
installGame(options: InstallGameOptions): Promise<InstalledGame>
```

安装流程只负责准备文件，不启动游戏：

1. 准备原版版本，或安装指定 loader 版本。
2. 下载 client jar、libraries、assets。
3. 安装传入的 mod。
4. 返回实际使用的版本、assets、libraries 和 client jar 路径。

### InstallGameOptions

```ts
interface InstallGameOptions {
  version: string;
  gameDirectory: string;
  runtimeDirectory?: string;
  loader?: "vanilla" | "forge" | "fabric" | "quilt";
  loaderVersion?: string;
  versionDirectory?: string;
  loaderVersionDirectory?: string;
  assetsDirectory?: string;
  librariesDirectory?: string;
  modsDirectory?: string;
  javaPath?: string;
  validate?: boolean;
  process?: DownloadProcessCallback;
  mods?: Array<{
    id: string;
    name: string;
    version: string;
    sourceUrl: string;
    fileName?: string;
    loader?: string;
  }>;
}
```

- `gameDirectory`: 安装基准目录。未显式传资源目录时，versions/assets/libraries 会默认放在它下面。
- `runtimeDirectory`: 运行实例目录。用于启动时的 `--gameDir`，隔离 saves、config、resourcepacks、screenshots、logs、`options.txt` 等运行数据。未传时等于 `gameDirectory`。
- `versionDirectory`: 自定义原版/基础版本目录。未传时使用 `<gameDirectory>/versions/<version>`。
- `loaderVersionDirectory`: 自定义 loader profile 目录。未传时使用 `<gameDirectory>/versions/<loader-version-id>`。
- `assetsDirectory`: 自定义 assets 目录。未传时使用 `<gameDirectory>/assets`。
- `librariesDirectory`: 自定义 libraries 目录。未传时使用 `<gameDirectory>/libraries`。
- `modsDirectory`: 自定义 mods 目录。未传时使用 `<gameDirectory>/mods`。

### InstalledGame

```ts
interface InstalledGame {
  metadata: VersionMetadata;
  loader: "vanilla" | "forge" | "fabric" | "quilt";
  baseDirectory: string;
  gameDirectory: string;
  assetsDirectory: string;
  librariesDirectory: string;
  versionDirectory: string;
  clientJarPath: string;
}
```

## launchGame()

```ts
launchGame(options: LaunchGameOptions): Promise<number>
```

启动流程不下载、不安装，只读取认证会话并启动 Java 进程。为了支持版本隔离，启动时必须显式提供 `assetsDirectory`、`librariesDirectory` 和 `versionDirectory`。
`gameDirectory` 是运行实例目录，会传给 Minecraft 的 `--gameDir`，因此 saves、config、resourcepacks、screenshots、logs 和 `options.txt` 都会落在这个目录下。Minecraft 没有独立的 `savesDirectory` 启动参数。

```ts
interface LaunchGameOptions {
  metadata: VersionMetadata;
  gameDirectory: string;
  assetsDirectory: string;
  librariesDirectory: string;
  versionDirectory: string;
  clientJarPath?: string;
  nativesDirectory?: string;
  loader?: "vanilla" | "forge" | "fabric" | "quilt";
  accessToken?: string;
  clientToken?: string;
  profileId?: string;
  profileName?: string;
  memory?: { min?: string; max?: string };
  jvmArgs?: string[];
  gameArgs?: string[];
  javaPath?: string;
  extraEnvironment?: Record<string, string>;
}
```

### 分离式示例

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

## playGame()

```ts
playGame(options: PlayGameOptions): Promise<number>
```

兼容入口。内部等价于先调用 `installGame()`，再调用 `launchGame()`。需要版本隔离时应优先使用分离式 API。

`process` 可覆盖构造器中的默认下载进度回调。回调参数结构：

完整的自定义目录安装与启动示例见 [自定义目录安装与启动示例](./custom-directories.md)。

```ts
type DownloadProcessCallback = (progress: {
  url: string;
  filePath: string;
  downloadedBytes: number;
  totalBytes?: number;
  progress?: number;
}) => void;
```

### 认证规则

如果同时传入 `accessToken`、`clientToken`、`profileId`、`profileName`，SDK 会调用 `loginWithToken()` 写入 session。

如果没有传入完整认证参数，SDK 会尝试从 `sessionFile` 读取 session。两者都没有时抛出错误：

```text
No valid session found. Please provide authentication credentials.
```

### Loader 规则

- `loader` 缺省为 `vanilla`。
- `fabric`、`forge`、`quilt` 会先调用 `installer.installLoader()`。
- `loaderVersion` 透传给对应 loader 安装逻辑。
- loader 版本启动时仍复用原版 client jar，通过 `clientJarPath` 显式传给 launcher。
