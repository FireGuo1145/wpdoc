# 类型模型

本文档汇总公开类型和重要内部 metadata 类型。

## API 来源

```ts
const API_SOURCE = {
  MOJANG: "mojang",
  BMCLAPI: "bmclapi",
} as const;

type ApiSource = "mojang" | "bmclapi";
```

```ts
interface ApiEndpoints {
  versionManifest: string;
  librariesBase: string;
  assetsBase: string;
  javaRuntimeBase?: string;
}
```

## Mod 类型

```ts
type LoaderType = "forge" | "fabric" | "quilt" | "vanilla";

interface ModPackage {
  id: string;
  name: string;
  version: string;
  loader: LoaderType;
  sourceUrl: string;
  fileName?: string;
  installDir?: string;
}

interface ModInstallTarget {
  gameDirectory: string;
  loader: LoaderType;
  modsDirectory?: string;
  installPath?: string;
}
```

## 安装选项

```ts
interface InstallOptions {
  modPackages: ModPackage[];
  installTarget: ModInstallTarget;
}
```

```ts
interface DownloadOptions {
  version: string;
  targetDirectory: string;
  timeoutMs?: number;
}
```

## 认证类型

```ts
interface AuthSession {
  accessToken: string;
  clientToken: string;
  selectedProfile?: {
    id: string;
    name: string;
  };
  profile?: {
    id: string;
    name: string;
  };
  userProperties?: Record<string, unknown>;
  availableProfiles?: Array<{ id: string; name: string }>;
  timestamp: number;
}
```

```ts
interface UserProfile {
  username: string;
  uuid?: string;
  email?: string;
  session?: AuthSession;
}
```

## 版本 metadata

```ts
interface VersionMetadata {
  id: string;
  assets: string;
  assetIndex: AssetIndex;
  downloads: {
    client: LibraryArtifact;
    server?: LibraryArtifact;
    client_mappings?: LibraryArtifact;
    server_mappings?: LibraryArtifact;
  };
  libraries: LibraryEntry[];
  mainClass: string;
  arguments?: {
    game?: Array<string | { rules?: LibraryRule[]; value: string | string[] }>;
    jvm?: Array<string | { rules?: LibraryRule[]; value: string | string[] }>;
  };
  minimumLauncherVersion: number;
  inheritsFrom?: string;
  jar?: string;
}
```

### LibraryEntry

```ts
interface LibraryEntry {
  name: string;
  url?: string;
  downloads?: {
    artifact?: LibraryArtifact;
    classifiers?: Record<string, LibraryArtifact>;
  };
  rules?: LibraryRule[];
  natives?: Record<string, string>;
  extract?: {
    exclude?: string[];
  };
}
```

`url` 用于 Fabric/Quilt 等 loader profile 中的 Maven base URL。

### LibraryArtifact

```ts
interface LibraryArtifact {
  path: string;
  sha1?: string;
  size?: number;
  url?: string;
}
```

### AssetIndex

```ts
interface AssetIndex {
  id: string;
  sha1: string;
  size: number;
  totalSize: number;
  url: string;
}
```

### VersionManifest

```ts
interface VersionManifest {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: VersionManifestEntry[];
}
```
