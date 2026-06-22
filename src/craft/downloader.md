# Downloader

`Downloader` 是低层下载封装，适合需要直接下载清单或指定 URL 时使用。大多数启动流程应优先使用 `Installer` 或 `CraftSDK.installGame()`。

## 构造函数

```ts
new Downloader(options?: DownloaderOptions)
```

```ts
interface DownloaderOptions {
  apiSource?: "mojang" | "bmclapi";
  timeoutMs?: number;
  process?: DownloadProcessCallback;
}
```

## getEndpoints()

```ts
getEndpoints(): ApiEndpoints
```

返回当前 API 来源对应的端点。

## download()

```ts
download(url: string, targetPath: string, options?: DownloaderDownloadOptions): Promise<string>
```

下载任意 URL 到目标路径，返回 `targetPath`。

```ts
await sdk.downloader.download(
  "https://example.com/file.jar",
  ".minecraft/downloads/file.jar"
);
```

`options.process` 可跟踪单个文件下载进度：

```ts
await sdk.downloader.download(
  "https://example.com/file.jar",
  ".minecraft/downloads/file.jar",
  {
    process: ({ filePath, downloadedBytes, totalBytes, progress }) => {
      console.log(filePath, downloadedBytes, totalBytes, progress);
    },
  }
);
```

## downloadVersionManifest()

```ts
downloadVersionManifest(targetPath: string, options?: DownloaderDownloadOptions): Promise<string>
```

下载 Minecraft 版本清单到指定路径。

## getLibrariesBase()

```ts
getLibrariesBase(): string
```

返回 libraries Maven 基础地址。

## getAssetsBase()

```ts
getAssetsBase(): string
```

返回 assets objects 基础地址。

## API 来源

```ts
API_SOURCE.MOJANG
API_SOURCE.BMCLAPI
```

`API_ENDPOINTS` 包含：

```ts
interface ApiEndpoints {
  versionManifest: string;
  librariesBase: string;
  assetsBase: string;
  javaRuntimeBase?: string;
}
```

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

`progress` 是 `0..1` 的比例。服务器未返回 `Content-Length` 时，`totalBytes` 和 `progress` 为空。
