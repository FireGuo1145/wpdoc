# 自定义目录安装与启动示例

这个示例演示如何把“安装文件”和“运行实例数据”分开，适合实现多版本、多 profile 隔离。

关键点：

- `installGame().gameDirectory` 是安装基准目录。未显式传目录时，versions、assets、libraries 会默认放在它下面。
- `installGame().runtimeDirectory` 是运行实例目录。启动时它会作为 Minecraft 的 `--gameDir`，用于保存 `saves`、`config`、`resourcepacks`、`screenshots`、`logs`、`options.txt` 等运行数据。
- Minecraft 没有独立的 `savesDirectory` 启动参数。要隔离存档和配置，就给每个版本或 profile 传不同的 `runtimeDirectory` / `launchGame().gameDirectory`。
- `launchGame()` 不下载、不安装，只使用你传入的 metadata 和目录启动游戏。

## 目录布局

下面的示例会生成类似结构：

```text
.minecraft-shared/
  installers/

.minecraft-data/
  assets/
  libraries/
  versions/
    1.20.1/
    fabric-1.20.1/

.minecraft-instances/
  fabric-1.20.1/
    saves/
    config/
    resourcepacks/
    mods/
    options.txt
    logs/
    natives/
```

## 完整示例

```ts
import { resolve } from "node:path";
import { CraftSDK, API_SOURCE, type DownloadProgress } from "./src/index.js";

// 共享安装目录：只放下载器、Forge installer 这类安装过程文件。
// 这个目录不是 Minecraft 的运行目录，不应该依赖它保存 saves/config。
const installBaseDirectory = resolve(".minecraft-shared");

// 资源目录：assets index 和 assets objects 会放到这里。
// 如果多个实例使用同一套资源，可以共享这个目录。
const assetsDirectory = resolve(".minecraft-data/assets");

// 依赖库目录：Mojang libraries、Fabric/Quilt/Forge libraries 会放到这里。
// 多个实例可以共享，减少重复下载。
const librariesDirectory = resolve(".minecraft-data/libraries");

// 原版基础版本目录：原版 version.json 和 client jar 会放到这里。
// 不要只靠版本号拼路径；业务侧可以按自己的规则命名。
const baseVersionDirectory = resolve(".minecraft-data/versions/1.20.1");

// Loader profile 目录：Fabric/Quilt/Forge 生成的 loader metadata 会放到这里。
// 原版启动时不需要这个目录；安装 loader 时才需要。
const loaderVersionDirectory = resolve(".minecraft-data/versions/fabric-1.20.1");

// 运行实例目录：这是最重要的隔离目录。
// 启动时会传给 Minecraft 的 --gameDir，存档、配置、资源包、日志都会写到这里。
const runtimeDirectory = resolve(".minecraft-instances/fabric-1.20.1");

// mods 目录：通常应该放在 runtimeDirectory 下面，因为 mod 列表也是实例配置的一部分。
const modsDirectory = resolve(runtimeDirectory, "mods");

// natives 目录：JVM 参数里的 ${natives_directory} 会指向这里。
// 如果不传，SDK 默认使用 <gameDirectory>/natives/<metadata.id>。
const nativesDirectory = resolve(runtimeDirectory, "natives");

const sdk = new CraftSDK({
  // 国内网络通常建议用 BMCLAPI；需要官方源时改成 API_SOURCE.MOJANG。
  apiSource: API_SOURCE.BMCLAPI,

  // 下载超时时间，单位毫秒。
  timeoutMs: 120000,

  // 认证会话保存位置。这个文件和运行实例目录无关，可以按启动器账号体系放置。
  sessionFile: "./craft-sdk-session.json",
});

function onDownloadProgress(progress: DownloadProgress): void {
  // progress.filePath 是当前文件的目标路径，适合用于 UI 展示。
  // progress.progress 只有服务器返回 Content-Length 时才存在。
  if (progress.progress === undefined) {
    console.log(`${progress.filePath}: ${progress.downloadedBytes} bytes`);
    return;
  }

  console.log(`${progress.filePath}: ${Math.round(progress.progress * 100)}%`);
}

// 第一阶段：安装/准备文件。
// 这个阶段只下载和校验文件，不启动游戏。
const installed = await sdk.installGame({
  // Minecraft 版本。
  version: "1.20.1",

  // 安装基准目录。没有单独指定的安装文件会默认放在这个目录下。
  gameDirectory: installBaseDirectory,

  // 运行实例目录。installGame() 会把它记录到返回值 installed.gameDirectory。
  // 后续 launchGame() 使用它作为 --gameDir，实现 saves/config/resourcepacks 隔离。
  runtimeDirectory,

  // loader 可选：vanilla、fabric、forge、quilt。
  loader: "fabric",

  // 可选：固定 loader 版本。不传时 SDK 会尝试使用最新稳定版本。
  // loaderVersion: "0.16.14",

  // 原版版本目录。原版 version.json 和 client jar 会放这里。
  versionDirectory: baseVersionDirectory,

  // loader profile 目录。Fabric/Quilt/Forge metadata 会放这里。
  loaderVersionDirectory,

  // assets 和 libraries 可共享，也可按版本或实例隔离。
  assetsDirectory,
  librariesDirectory,

  // mods 默认会装到 runtimeDirectory/mods；这里显式传入是为了让目录关系更清楚。
  modsDirectory,

  // 如果希望跳过最终全量校验，可以设为 false。生产启动器通常建议保持默认 true。
  validate: true,

  // 下载进度回调。
  process: onDownloadProgress,

  // 可选：安装 mod。mod 文件会下载到 modsDirectory。
  mods: [
    {
      id: "fabric-api",
      name: "Fabric API",
      version: "0.90.0",
      loader: "fabric",
      sourceUrl: "https://example.com/fabric-api.jar",
    },
  ],
});

// 第二阶段：启动游戏。
// 这个阶段必须显式提供各目录；SDK 不会在这里下载文件。
const exitCode = await sdk.launchGame({
  // installGame() 返回的 metadata，包含 mainClass、arguments、libraries 等启动所需信息。
  metadata: installed.metadata,

  // 运行实例目录。这里等同于 Minecraft --gameDir。
  // saves/config/resourcepacks/screenshots/logs/options.txt 都会在这个目录下。
  gameDirectory: installed.gameDirectory,

  // assets 目录。必须和安装阶段使用的目录一致。
  assetsDirectory: installed.assetsDirectory,

  // libraries 目录。必须和安装阶段使用的目录一致。
  librariesDirectory: installed.librariesDirectory,

  // 当前启动版本的 metadata 目录。
  // Fabric/Quilt/Forge 时通常是 loaderVersionDirectory；原版时是 baseVersionDirectory。
  versionDirectory: installed.versionDirectory,

  // 实际 client jar 路径。loader 版本通常复用原版 client jar，所以要显式传入。
  clientJarPath: installed.clientJarPath,

  // loader 类型会影响启动器内部的默认处理和调用方自己的 UI 状态。
  loader: installed.loader,

  // natives 解压目录。该目录属于运行实例数据，建议放在 runtimeDirectory 下。
  nativesDirectory,

  // Java 路径。不传时 SDK 会自动查找系统 Java。
  // javaPath: "C:/Program Files/Java/jdk-17/bin/java.exe",

  // 内存参数。
  memory: { min: "512M", max: "2G" },

  // 附加 JVM 参数。
  jvmArgs: ["-XX:+UseG1GC"],

  // 认证方式 1：直接传已有 token。
  accessToken: "your-access-token",
  clientToken: "your-client-token",
  profileId: "your-profile-id",
  profileName: "YourPlayerName",

  // 认证方式 2：如果不传 token，SDK 会尝试读取 sessionFile；
  // 如果配置了 microsoftAuth，也可以在没有有效 session 时走微软登录。
});

console.log(`Game exited with code ${exitCode}`);
```

## 常见目录策略

共享下载文件、隔离运行实例：

```text
.minecraft-data/assets
.minecraft-data/libraries
.minecraft-data/versions/<version-or-loader>
.minecraft-instances/<profile-id>
```

完全按实例隔离：

```text
.minecraft-instances/<profile-id>/assets
.minecraft-instances/<profile-id>/libraries
.minecraft-instances/<profile-id>/versions
.minecraft-instances/<profile-id>/mods
```

如果你的启动器支持多个账号或多个整合包，推荐至少隔离 `runtimeDirectory` 和 `modsDirectory`。是否共享 `assetsDirectory` / `librariesDirectory` 取决于你是否更重视节省磁盘空间。
