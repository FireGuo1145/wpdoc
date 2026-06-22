# GameLauncher

`GameLauncher` 负责把 `LaunchOptions` 和 `VersionMetadata` 转换成 Java 启动参数，并启动游戏进程。

## launch()

```ts
launch(options: LaunchOptions, metadata: VersionMetadata): Promise<number>
```

返回 Java 进程退出码。

## LaunchOptions

```ts
interface LaunchOptions {
  version: string;
  javaPath?: string;
  memory?: {
    min?: string;
    max?: string;
  };
  jvmArgs?: string[];
  gameArgs?: string[];
  loader?: "vanilla" | "forge" | "fabric" | "quilt";
  mods?: ModPackage[];
  modInstallTarget?: ModInstallTarget;
  authSession?: AuthSession;
  librariesDirectory?: string;
  nativesDirectory?: string;
  clientJarPath?: string;
  gameDirectory: string;
  assetsDirectory: string;
  versionDirectory: string;
  extraEnvironment?: Record<string, string>;
}
```

## 参数构建规则

### 运行实例目录

`gameDirectory` 会作为 Java 进程 `cwd`，并传给 Minecraft 的 `--gameDir`。这就是 saves、config、resourcepacks、screenshots、logs 和 `options.txt` 的隔离目录；Minecraft 没有独立的 `savesDirectory` 启动参数。

### Java 路径

如果 `javaPath` 未传，SDK 调用 `findJavaExecutable()` 自动查找 Java。

### 内存参数

```ts
memory: { min: "512M", max: "2G" }
```

会生成：

```text
-Xms512M -Xmx2G
```

### Classpath

classpath 由两部分组成：

1. client jar
2. metadata 中的 libraries

client jar 优先使用 `options.clientJarPath`。如果未传，使用：

```text
<versionDirectory>/<metadata.jar 或 metadata.id>.jar
```

libraries 支持：

- `downloads.artifact.path`
- Maven 坐标推导路径

Windows 使用 `;` 拼接 classpath，其他平台使用 `:`。

如果传入 `librariesDirectory`，classpath 会从该目录解析 libraries；否则使用 `${gameDirectory}/libraries`。
如果传入 `nativesDirectory`，`${natives_directory}` 会使用该目录；否则使用 `${gameDirectory}/natives/<metadata.id>`。

### Game arguments

如果 metadata 有 `arguments.game`，SDK 按 Mojang 模板替换变量：

```text
${auth_player_name}
${version_name}
${game_directory}
${assets_root}
${assets_index_name}
${auth_uuid}
${auth_access_token}
${clientid}
```

如果 metadata 没有 `arguments.game`，SDK 使用旧版默认参数：

```text
--username
--version
--gameDir
--assetsDir
--assetIndex
--uuid
--accessToken
--clientId
```

未启用的 feature rules 会被跳过，例如 demo、quick play、自定义分辨率等。

## 示例

```ts
const prepared = await sdk.installer.prepareVersion("1.20.1", ".minecraft");

const exitCode = await sdk.launcher.launch(
  {
    version: prepared.metadata.id,
    gameDirectory: ".minecraft",
    assetsDirectory: ".minecraft/assets",
    versionDirectory: prepared.versionDirectory,
    clientJarPath: prepared.clientJarPath,
    memory: { min: "512M", max: "2G" },
    authSession: sdk.auth.loadSession(),
  },
  prepared.metadata
);
```
