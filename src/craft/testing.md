# 测试命令

测试入口在 `src/test/`：

```text
src/test/
  common.ts
  index.ts
  vanilla.ts
  fabric.ts
  forge.ts
```

`package.json` 脚本：

```json
{
  "scripts": {
    "test": "node --loader ts-node/esm src/test/index.ts"
  }
}
```

## 命令

```bash
yarn test
yarn test vanilla
yarn test fabric
yarn test forge
yarn test all
yarn test --help
```

- `yarn test` 默认运行 `vanilla`。
- `vanilla` 启动原版。
- `fabric` 安装并启动 Fabric。
- `forge` 安装并启动 Forge。
- `all` 按顺序运行 vanilla、Fabric、Forge。

## 环境变量

```bash
MC_VERSION=1.20.1
MC_GAME_DIR=.minecraft
MC_ACCESS_TOKEN=...
MC_CLIENT_TOKEN=...
MC_PROFILE_ID=...
MC_PROFILE_NAME=...
FABRIC_LOADER_VERSION=0.16.14
FORGE_LOADER_VERSION=47.4.0
```

示例：

```bash
MC_VERSION=1.20.1 yarn test fabric
FABRIC_LOADER_VERSION=0.16.14 yarn test fabric
FORGE_LOADER_VERSION=47.4.0 yarn test forge
```

## 测试认证

如果没有设置 `MC_ACCESS_TOKEN` 等环境变量，测试使用内置测试 token：

```text
test-access-token-12345
test-client-token-12345
test-profile-id-12345
TestPlayer
```

这种 token 可以用于检查本地启动流程，但 Realms 等在线服务会认证失败。

## 注意

这些测试会真实启动 Minecraft 客户端，不是单元测试。首次运行会下载版本文件、libraries、assets 和 loader 依赖，耗时较长。
