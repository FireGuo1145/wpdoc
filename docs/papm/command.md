# 命令文档

---

## **安装和初始化**

### **1. 初始化项目**
```bash
papm init
```
**描述**: 初始化项目，生成以下文件和目录：
- `package.php`: 项目配置文件。
- `php_module/init.php`: 模块加载器。

**示例**:
```bash
papm init
```

---

## **包管理命令**

### **2. 安装依赖**
```bash
papm
```
**描述**: 默认安装 `package.php` 中的所有依赖（包括 `dependencies` 和 `comdep`）。

### **3. 添加 PAPM 包**
```bash
papm add [package] [--no-conf]
```
**描述**: 从注册表下载指定包，并解压到 `/php_module` 目录。如果未指定 `--no-conf`，将自动添加到 `dependencies`。

**示例**:
```bash
papm add windypear/phpwebserver
```

### **4. 安装 Composer 包**
```bash
papm install [package] [--no-conf]
```
**描述**: 使用 Composer 安装包并添加到 `comdep`，若指定 `--no-conf`，则不会更新 `package.php`。

**示例**:
```bash
papm install monolog/monolog
```

### **5. 移除 PAPM 包**
```bash
papm remove [package] [--no-conf]
```
**描述**: 删除 `/php_module/[package]` 下的模块文件，并更新 `dependencies`。

**示例**:
```bash
papm remove windypear/phpwebserver
```

### **6. 移除 Composer 包**
```bash
papm uninstall [package] [--no-conf]
```
**描述**: 使用 Composer 移除包并更新 `comdep`。

**示例**:
```bash
papm uninstall monolog/monolog
```

---

## **模块和脚本管理**

### **7. 调用模块命令**
```bash
papm -m [command] [args...]
```
**描述**: 遍历 `/php_module` 目录下所有模块，执行其 `init.php` 文件中 `Export` 类定义的指定命令。

**示例**:
```bash
papm -m test
```

### **8. 执行自定义脚本**
```bash
papm [script]
```
**描述**: 运行 `package.php` 中 `scripts` 定义的自定义命令。

**示例**:
```bash
papm build
```

---

## **Registry管理**

### **9. 查看和修改Registry**
```bash
papm registry [set|get] [url]
```
**描述**:
- `papm registry get`: 查看当前Registry地址。
- `papm registry set [url]`: 设置新的Registry地址。

**示例**:
```bash
papm registry get
papm registry set https://registry-papm.flweb.cn
```

---

## **帮助命令**

### **10. 查看帮助**
```bash
papm help
```
**描述**: 显示帮助菜单，列出所有可用命令。

---

## **`package.php` 文件结构**

### **默认结构**
```php
<?php
return array (
  'name' => 'my-php-project',
  'version' => '1.0.0',
  'dependencies' => 
  array (
  ),
  'comdep' => 
  array (
  ),
  'scripts' => 
  array (
  ),
);
```

---

## **模块加载器**

`php_module/init.php` 提供 `importmod` 函数，用于动态导入模块。

### **使用方法**
```php
$module = importmod('example/util', ['arg1', 'arg2']);
$module->someMethod();
```

---

## **目录结构示例**
```plaintext
project/
  package.php
  php_module/
    init.php
    example/
      util/
        init.php
  vendor/
```

---

此文档涵盖了 `papm` 的所有基本功能和用法，如需扩展或定制，请参考工具实现代码。