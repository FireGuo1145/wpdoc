# 模块基础结构

## 模块目录结构
模块存放于 `php_module` 目录下，每个模块具有唯一的路径，格式如下：
```
php_module/<scope>/<module>
```
每个模块的初始化文件为 `init.php`，该文件中需定义一个类，用于处理模块命令。

## 模块初始化文件（init.php）
模块必须包含一个 `init.php` 文件，该文件中需要定义以下内容：
1. **模块主类**  
   类名格式为：`<Scope><Module>`，例如：
   - 模块路径 `php_module/windypear/phppack`
   - 主类名 `WindypearPhppack`

2. **模块命令处理方法**  
   模块主类中可以定义公开的（`public`）方法，用于处理模块命令。如果方法被定义为private，将不会被命令系统解析。

---

## 通用要求

- 主类的类名以及导出函数名尽量保证唯一，避免与其他模块发生冲突。发生冲突时会出现无法执行指令或优先级不同的情况。
- 类名和方法名需遵循标准命名规范。
- **所有模块的主类名称必须与模块路径相对应**，例如：
  - 模块路径 `php_module/example/utilities`
  - 主类名 `ExampleUtilities`

---

## 常用功能 API

### 1. 模块命令执行
模块命令通过主类的公开方法处理：
```php
public function <commandName>($currentDir, $args)
{
    // 模块命令逻辑
}
```

#### 参数说明
- `$currentDir`：当前项目运行目录的绝对路径。
- `$args`：命令行传递的参数（数组），已被papm处理过，从$args[0]开始为用户传递的参数，非commandName。

#### 返回值
- 没有具体返回值，仅输出操作结果。

#### 示例
```php
public function sayHello($currentDir, $args)
{
    echo "Hello from module in $currentDir! Arguments: " . implode(", ", $args) . "\n";
}
```

---

### 2. 模块安装流程
模块通过命令自动安装至项目目录。安装流程：
1. 下载压缩包到临时目录。
2. 解压到 `php_module/<scope>/<module>`。
3. 更新项目的 `package.php` 文件。

---

### 3. 模块卸载流程
模块卸载时，删除以下内容：
1. 模块目录 `php_module/<scope>/<module>`。
2. 项目配置文件 `package.php` 中的模块依赖记录。

---

### 4. 导出类
papm模块支持导出类，用户可通过importmod('scope/module',$option)方式导入从模块导出的类。init.php示例如下：
```php
class Export
{
    private $options;

    public function __construct($options = [])
    {
        $this->options = $options;
    }

    public function sayHello()
    {
        return "Hello from example/util!";
    }

    public function getOptions()
    {
        return $this->options;
    }
}
```
其中，__construct是该类的构造函数，$options是一个array，表示导入时设置的参数。需要注意的是，模块的导出类必须命名为Export以便正确解析。

---

## API 接口示例

### 模块初始化模板
以下是一个标准的 `init.php` 文件模板：
```php
<?php
class ExampleUtilities
{
    public function greet($currentDir, $args)
    {
        echo "Greetings from ExampleUtilities module!\n";
    }

    public function sum($currentDir, $args)
    {
        $total = array_sum($args);
        echo "The sum is: $total\n";
    }
}
```

---

### 使用命令调用模块方法
#### 1. 调用模块命令
命令格式：
```
papm -m <commandName> [args...]
```

#### 示例：
调用模块中的 `greet` 方法：
```bash
papm -m greet
```
为防止出现多个模块注册同一方法，请确保函数名唯一。

调用模块中的 `sum` 方法并传递参数：
```bash
papm -m sum 1 2 3
```

---

### 模块内的 Package 配置文件
模块包含自己的 `package.php` 文件，结构与一般项目类似：
```php
<?php
return [
    'name' => 'example/utilities',
    'version' => '1.0.0',
    'dependencies' => [],
];
```

---

### 项目配置文件
项目根目录下的 `package.php` 用于管理全局依赖，结构如下：
```php
<?php
return [
    'name' => 'my-php-project',
    'version' => '1.0.0',
    'dependencies' => [
        'example/utilities' => '1.0.0',
    ],
    'comdep' => [],
    'scripts' => [],
];
```

---

### 常用操作命令

#### 1. 安装模块
```bash
papm add <scope/module>
```

#### 2. 卸载模块
```bash
papm remove <scope/module>
```

#### 3. 执行模块命令
```bash
papm -m <commandName> [args...]
```

#### 4. 初始化模块为项目（目录需为空）
```bash
papm init [package] [version]
```