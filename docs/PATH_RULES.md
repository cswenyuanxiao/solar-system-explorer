# 📁 路径处理规则文档

## 概述
本文档定义了Solar System Explorer项目中所有页面和资源文件的路径处理规则，确保项目的一致性和可维护性。

## 🎯 核心原则

### 1. 不使用base标签
- ❌ 禁止使用 `<base href="...">` 标签
- ✅ 使用相对路径进行导航
- 原因：base标签会导致跨页面导航问题

### 2. 相对路径优先
- ✅ 优先使用相对路径
- ❌ 避免使用绝对路径（除非外部资源）
- 确保项目在不同环境下都能正常工作

## 📂 目录结构规范

```
solar-system-explorer/
├── index.html                 # 主页面（重定向）
├── pages/                     # 所有功能页面
│   ├── index.html            # 实际主页面
│   ├── 3d-simulator.html    # 3D模拟器
│   ├── user-system.html     # 用户系统
│   ├── charts.html          # 数据图表
│   ├── education.html       # 教育模块
│   ├── api.html            # API功能
│   ├── search.html         # 搜索功能
│   └── [planet].html       # 行星页面
├── css/                      # 样式文件
├── js/                       # JavaScript文件
├── images/                   # 图片资源
└── docs/                     # 文档
```

## 🔗 路径规则

### 从根页面 (pages/index.html) 导航
```html
<!-- 导航到其他页面 -->
<a href="3d-simulator.html">3D Simulator</a>
<a href="user-system.html">User System</a>
<a href="charts.html">Charts</a>

<!-- 导航到资源文件 -->
<link rel="stylesheet" href="../css/style.css">
<script src="../js/app.js"></script>
<img src="../images/planet.jpg">
```

### 从子页面 (pages/*.html) 导航
```html
<!-- 导航到其他页面 -->
<a href="index.html">Home</a>
<a href="3d-simulator.html">3D Simulator</a>
<a href="user-system.html">User System</a>

<!-- 导航到资源文件 -->
<link rel="stylesheet" href="../css/style.css">
<script src="../js/app.js"></script>
<img src="../images/planet.jpg">
```

### 从根目录 (index.html) 导航
```html
<!-- 导航到页面 -->
<a href="pages/index.html">Home</a>
<a href="pages/3d-simulator.html">3D Simulator</a>

<!-- 导航到资源文件 -->
<link rel="stylesheet" href="css/style.css">
<script src="js/app.js"></script>
<img src="images/planet.jpg">
```

## 📝 HTML模板规则

### 页面头部模板
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - Solar System Explorer</title>
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="../css/style.css?v=20240803">
    <link rel="stylesheet" href="../css/shared-header.css?v=20240803">
    <link rel="stylesheet" href="../css/[page-specific].css?v=20240803">
</head>
<body>
    <header>
        <!-- Shared header will be dynamically injected here by shared-header.js -->
    </header>
    
    <main>
        <!-- 页面内容 -->
    </main>
    
    <!-- JavaScript文件 -->
    <script src="../js/shared-header.js"></script>
    <script src="../js/[page-specific].js"></script>
</body>
</html>
```

### 根页面头部模板
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - Solar System Explorer</title>
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="css/style.css?v=20240803">
    <link rel="stylesheet" href="css/shared-header.css?v=20240803">
    <link rel="stylesheet" href="css/[page-specific].css?v=20240803">
</head>
<body>
    <header>
        <!-- Shared header will be dynamically injected here by shared-header.js -->
    </header>
    
    <main>
        <!-- 页面内容 -->
    </main>
    
    <!-- JavaScript文件 -->
    <script src="js/shared-header.js"></script>
    <script src="js/[page-specific].js"></script>
</body>
</html>
```

## 🚫 禁止的做法

### 1. 不要使用base标签
```html
<!-- ❌ 错误 -->
<head>
    <base href="/solar-system-explorer/">
    <!-- 其他内容 -->
</head>
```

### 2. 不要使用绝对路径（内部资源）
```html
<!-- ❌ 错误 -->
<link rel="stylesheet" href="/css/style.css">
<script src="/js/app.js"></script>
<img src="/images/planet.jpg">
```

### 3. 不要使用硬编码的完整URL（内部链接）
```html
<!-- ❌ 错误 -->
<a href="https://cswenyuanxiao.github.io/solar-system-explorer/pages/3d-simulator.html">
    3D Simulator
</a>
```

## ✅ 推荐的做法

### 1. 使用相对路径
```html
<!-- ✅ 正确 -->
<a href="3d-simulator.html">3D Simulator</a>
<link rel="stylesheet" href="../css/style.css">
<script src="../js/app.js"></script>
```

### 2. 使用版本号缓存
```html
<!-- ✅ 正确 -->
<link rel="stylesheet" href="../css/style.css?v=20240803">
<script src="../js/app.js?v=20240803"></script>
```

### 3. 使用data-src进行懒加载
```html
<!-- ✅ 正确 -->
<img data-src="../images/planet.jpg" alt="Planet" class="lazy">
```

## 🔧 构建脚本规则

### 构建脚本必须遵循的规则
1. **移除所有base标签**
2. **修复相对路径**
3. **确保导航链接正确**
4. **处理版本号**

```javascript
// 构建脚本示例规则
content = content.replace(/<base href="[^"]*">/g, ''); // 移除base标签
content = content.replace(/(href|src|data-src)="\.\.\//g, '$1="../'); // 修复相对路径
```

## 📋 检查清单

创建新页面时，请确保：

- [ ] 没有使用base标签
- [ ] 所有内部链接使用相对路径
- [ ] CSS和JS文件路径正确
- [ ] 图片资源路径正确
- [ ] 导航链接指向正确的页面
- [ ] 版本号已添加（如适用）
- [ ] 懒加载图片使用data-src

## 🐛 常见问题

### Q: 为什么不能使用base标签？
A: base标签会导致跨页面导航问题，特别是在GitHub Pages等静态托管环境中。

### Q: 如何处理外部资源？
A: 外部资源（如CDN）可以使用绝对URL，但内部资源必须使用相对路径。

### Q: 如何确保路径在不同环境下都正确？
A: 使用相对路径，并让构建脚本自动处理路径转换。

## 📚 相关文档

- [构建脚本](./scripts/build.js)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [项目结构](./PROJECT_STRUCTURE.md)

---

*最后更新: 2025年8月5日*
*版本: 1.0* 