# Installer

`Installer` 负责版本准备、文件校验、assets 下载、libraries 下载、loader 安装和 mod 安装。

## 构造函数

```ts
new Installer(options?: InstallerOptions)
```

```ts
interface InstallerOptions {
  apiSource?: "mojang" | "bmclapi";
  timeoutMs?: number;
  process?: DownloadProcessCallback;
}
```

## prepareVersion()

```ts
prepareVersion(
  versionId: string,
  baseDirectory: string,
  options?: PrepareVersionOptions
): Promise<PreparedVersion>
```

准备原版 Minecraft 版本。

它会执行：

1. 下载版本 manifest。
2. 下载指定版本 metadata。
3. 下载 client jar。
4. 下载 libraries。
5. 下载 assets index。
6. 下载 assets objects。
7. 默认校验版本文件。

```ts
const prepared = await sdk.installer.prepareVersion("1.20.1", ".minecraft");
```

### PrepareVersionOptions

```ts
interface PrepareVersionOptions {
  validate?: boolean;
  process?: DownloadProcessCallback;
  versionDirectory?: string;
  assetsDirectory?: string;
  librariesDirectory?: string;
}
```

`validate` 默认是 `true`。设置为 `false` 可以跳过最终全量校验，但下载后的单文件校验仍会在部分流程中执行。

`versionDirectory` 可指定版本 metadata 和 client jar 的实际存储目录。未传时默认使用 `${baseDirectory}/versions/<versionId>`。
`assetsDirectory` 和 `librariesDirectory` 可分别指定 assets 与 libraries 的实际存储目录，用于版本隔离。

### PreparedVersion

```ts
interface PreparedVersion {
  metadata: VersionMetadata;
  versionDirectory: string;
  assetsDirectory: string;
  librariesDirectory: string;
  clientJarPath: string;
}
```

- `metadata`: 可传给 `GameLauncher.launch()` 的版本元数据。
- `versionDirectory`: 当前版本目录。
- `assetsDirectory`: 实际 assets 目录。
- `librariesDirectory`: 实际 libraries 目录。
- `clientJarPath`: 实际 client jar 路径。loader 版本通常复用原版 jar。

## installLoader()

```ts
installLoader(options: InstallLoaderOptions): Promise<PreparedVersion>
```

安装 Fabric、Forge 或 Quilt。详见 [Loader 安装](./loaders.md)。

## downloadMinecraftVersionManifest()

```ts
downloadMinecraftVersionManifest(
  targetDirectory: string,
  options?: DownloadProcessOptions
): Promise<VersionManifest>
```

下载 `version_manifest_v2.json` 到 `targetDirectory`，并返回解析后的 JSON。

## downloadVersionMetadata()

```ts
downloadVersionMetadata(
  url: string,
  targetDirectory: string,
  options?: DownloadProcessOptions
): Promise<VersionMetadata>
```

从指定 URL 下载版本 metadata 到 `targetDirectory/version.json`。

## downloadVersionMetadataById()

```ts
downloadVersionMetadataById(
  versionId: string,
  baseDirectory: string,
  options?: DownloadProcessOptions
): Promise<VersionMetadata>
```

从 manifest 查找版本，再下载对应 metadata。

`options.versionDirectory` 可覆盖 metadata 写入目录，避免按 `versionId` 拼接目录。

## downloadClientJar()

```ts
downloadClientJar(
  metadata: VersionMetadata,
  versionDirectory: string,
  options?: DownloadProcessOptions
): Promise<string>
```

下载 client jar 到 `${versionDirectory}/${metadata.id}.jar`，并按 metadata 中的 SHA1 校验。

## downloadLibraries()

```ts
downloadLibraries(
  metadata: VersionMetadata,
  baseDirectory: string,
  options?: DownloadProcessOptions & LibraryDirectoryOptions
): Promise<string[]>
```

下载版本 libraries。未传 `options.librariesDirectory` 时使用 `${baseDirectory}/libraries`。

支持两种 library 元数据：

- Mojang 标准 `downloads.artifact.path`
- Maven 坐标 `name + url`，例如 Fabric/Quilt profile 中的库

如果本地文件存在且 SHA1 不匹配，会重新下载。

## downloadAssetIndex()

```ts
downloadAssetIndex(
  metadata: VersionMetadata,
  baseDirectory: string,
  options?: DownloadProcessOptions & AssetDirectoryOptions
): Promise<string>
```

下载 assets index。未传 `options.assetsDirectory` 时使用 `${baseDirectory}/assets/indexes/<id>.json`。

## downloadAssets()

```ts
downloadAssets(
  metadata: VersionMetadata,
  baseDirectory: string,
  options?: DownloadProcessOptions & AssetDirectoryOptions
): Promise<string[]>
```

根据 assets index 下载 objects 到：

```text
assets/objects/<hash 前两位>/<hash>
```

下载并发数当前为 16。

## validateFile()

```ts
validateFile(filePath: string, expectedSha1?: string): Promise<FileValidationResult>
```

校验一个文件是否存在，以及可选的 SHA1 是否匹配。

```ts
interface FileValidationResult {
  filePath: string;
  valid: boolean;
  reason?: "missing" | "checksum_mismatch";
  expectedSha1?: string;
  actualSha1?: string;
}
```

## validateVersionFiles()

```ts
validateVersionFiles(
  metadata: VersionMetadata,
  baseDirectory: string,
  versionDirectory: string,
  clientJarPath?: string
): Promise<void>
```

校验 client jar、libraries 和 assets。loader 版本应传 `clientJarPath`，让校验指向实际原版 jar。

## validateAssets()

```ts
validateAssets(metadata: VersionMetadata, baseDirectory: string): Promise<void>
```

校验 assets index 和所有 assets objects。

## installMods()

```ts
installMods(options: InstallOptions): Promise<string[]>
```

下载 mod jar 到目标 mods 目录。

```ts
await sdk.installer.installMods({
  modPackages: [
    {
      id: "fabric-api",
      name: "Fabric API",
      version: "0.90.0",
      loader: "fabric",
      sourceUrl: "https://example.com/fabric-api.jar",
    },
  ],
  installTarget: {
    gameDirectory: ".minecraft",
    loader: "fabric",
  },
});
```

默认安装到 `${gameDirectory}/mods`。可以用 `modsDirectory` 或 `installPath` 覆盖。

`InstallOptions.process` 可跟踪 mod 下载进度。

## 下载进度回调

```ts
type DownloadProcessCallback = (progress: {
  url: string;
  filePath: string;
  downloadedBytes: number;
  totalBytes?: number;
  progress?: number;
}) => void;
```

`process` 可放在 `Installer` 构造器作为默认回调，也可放在 `prepareVersion()`、`installLoader()`、各个下载方法或 `installMods()` 的 options 中覆盖。`progress` 是 `0..1` 的比例；服务器未返回 `Content-Length` 时为空。
