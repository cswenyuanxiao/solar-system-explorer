# 📖 路径使用指南

## 快速开始

### 1. 检查现有页面路径
```bash
npm run check-paths
```
这个命令会检查所有HTML文件是否符合路径规则。

### 2. 创建新页面
```bash
# 创建子页面 (pages/目录下)
npm run create-page about sub

# 创建根页面 (根目录下)
npm run create-page landing root
```

### 3. 构建和部署
```bash
npm run build
npm run deploy
```

## 📋 路径规则总结

### ✅ 正确的做法

#### 子页面 (pages/*.html)
```html
<!-- 导航到其他页面 -->
<a href="index.html">Home</a>
<a href="3d-simulator.html">3D Simulator</a>

<!-- 资源文件 -->
<link rel="stylesheet" href="../css/style.css">
<script src="../js/app.js"></script>
<img src="../images/planet.jpg">
```

#### 根页面 (根目录)
```html
<!-- 导航到页面 -->
<a href="pages/index.html">Home</a>
<a href="pages/3d-simulator.html">3D Simulator</a>

<!-- 资源文件 -->
<link rel="stylesheet" href="css/style.css">
<script src="js/app.js"></script>
<img src="images/planet.jpg">
```

### ❌ 错误的做法

```html
<!-- 不要使用base标签 -->
<base href="/solar-system-explorer/">

<!-- 不要使用绝对路径 -->
<link rel="stylesheet" href="/css/style.css">

<!-- 不要使用硬编码URL -->
<a href="https://cswenyuanxiao.github.io/solar-system-explorer/pages/3d-simulator.html">
```

## 🛠️ 工具使用

### 创建页面脚本
```bash
# 语法
npm run create-page [页面名称] [页面类型]

# 示例
npm run create-page about sub        # 创建 about.html 在 pages/ 目录
npm run create-page landing root     # 创建 landing.html 在根目录
```

### 路径检查脚本
```bash
# 检查所有页面是否符合路径规则
npm run check-paths
```

### 构建脚本
```bash
# 构建项目
npm run build

# 部署到GitHub Pages
npm run deploy
```

## 📁 目录结构

```
solar-system-explorer/
├── index.html                 # 重定向页面
├── pages/                     # 所有功能页面
│   ├── index.html            # 实际主页面
│   ├── 3d-simulator.html    # 3D模拟器
│   ├── user-system.html     # 用户系统
│   └── [其他页面].html
├── css/                      # 样式文件
├── js/                       # JavaScript文件
├── images/                   # 图片资源
├── docs/                     # 文档
├── templates/                # 页面模板
└── scripts/                  # 构建脚本
```

## 🔧 模板使用

### 子页面模板
位置: `templates/sub-template.html`
- 适用于 pages/ 目录下的页面
- 资源路径使用 `../` 前缀

### 根页面模板
位置: `templates/root-template.html`
- 适用于根目录的页面
- 资源路径直接访问同级目录

## 📝 开发流程

### 1. 创建新页面
```bash
npm run create-page my-page sub
```

### 2. 编辑页面内容
- 编辑 `pages/my-page.html`
- 编辑 `css/my-page.css`
- 编辑 `js/my-page.js`

### 3. 检查路径
```bash
npm run check-paths
```

### 4. 构建和部署
```bash
npm run build
npm run deploy
```

## 🐛 常见问题

### Q: 为什么不能使用base标签？
A: base标签会导致跨页面导航问题，特别是在静态托管环境中。

### Q: 如何确保路径在不同环境下都正确？
A: 使用相对路径，让构建脚本自动处理路径转换。

### Q: 创建页面后需要做什么？
A: 
1. 编辑页面内容
2. 添加样式和功能
3. 在导航中添加链接
4. 运行路径检查
5. 构建和部署

### Q: 如何修复路径问题？
A: 
1. 运行 `npm run check-paths` 检查问题
2. 根据错误信息修复路径
3. 重新检查直到通过

## 📚 相关文档

- [路径规则文档](./PATH_RULES.md)
- [项目结构文档](./PROJECT_STRUCTURE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)

---

*最后更新: 2025年8月5日*
*版本: 1.0* 