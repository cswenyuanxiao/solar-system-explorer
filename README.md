Solar System Explorer

An interactive solar system exploration site with NASA API data integration.

## Project Overview

Solar System Explorer is a web-based platform that presents information about the solar system, visualizes data, and provides educational resources. It integrates NASA API data and offers interactive charts and simulations for exploring planets and related phenomena.

---
## Project Structure

```
Solar_System_Project/
├── pages/           # All HTML pages
│   ├── index.html   # Home page (Solar System overview)
│   ├── charts.html  # Data visualization page
│   ├── education.html # Education resources page
│   ├── api.html     # NASA API integration page
│   └── *.html       # Individual planet detail pages
├── css/             # Stylesheets
│   ├── style.css    # Main stylesheet
│   ├── charts.css   # Chart styles
│   ├── education.css # Education page styles
│   └── *.css        # Other styles
├── js/              # JavaScript files
│   ├── app.js       # Main application logic
│   ├── charts.js    # Charting features
│   ├── lazy-loading.js # Image lazy loading
│   └── *.js         # Other modules
├── images/          # Image assets
│   ├── sun.jpg      # Sun image
│   ├── earth.jpg    # Earth image
│   └── *.jpg        # Other planet images
├── scripts/         # Build scripts
│   ├── build.js     # Build script
│   └── fix-paths.js # Path correction script
└── docs/            # Documentation
```

---
## Getting Started

### Local Development
```
# Start a local server
python3 -m http.server 8000

# Open the main page
http://localhost:8000/pages/index.html
```

### Path Rules
- Local development: use relative paths `../css/`, `../js/`, `../images/`
- Deployment: build scripts adjust to `css/`, `js/`, `images/`

### Build & Deploy
```
# Install dependencies
npm install

# Build project
npm run build

# Deploy to GitHub Pages
npm run deploy:gh-pages
```

---
## Online Access
- GitHub Pages: `https://cswenyuanxiao.github.io/solar-system-explorer`

---
## Key Features
- Planet exploration, data visualization charts, NASA API integration, education resources, responsive design, image lazy loading, optimized downloads

---
## Tech Stack
- HTML5 / CSS3 / JavaScript
- Chart.js (data visualization)
- NASA API (real-time data)
- GitHub Pages (deployment)

---
## Notes
- All pages reside in the `pages/` directory
- Asset files live in the root `css/`, `js/`, and `images/` directories
- Build outputs are placed in `dist/`
- Local development uses relative paths; deployment adjusts automatically

# Solar System Explorer

一个交互式的太阳系探索网站，集成了NASA API数据。

## 📁 项目结构

```
Solar_System_Project/
├── pages/           # 所有HTML页面
│   ├── index.html   # 主页面（太阳系概览）
│   ├── charts.html  # 数据可视化页面
│   ├── education.html # 教育资源页面
│   ├── api.html     # NASA API集成页面
│   └── *.html       # 各星球详情页面
├── css/             # 样式文件
│   ├── style.css    # 主样式文件
│   ├── charts.css   # 图表样式
│   ├── education.css # 教育页面样式
│   └── *.css        # 其他样式文件
├── js/              # JavaScript文件
│   ├── app.js       # 主应用逻辑
│   ├── charts.js    # 图表功能
│   ├── lazy-loading.js # 图片懒加载
│   └── *.js         # 其他功能模块
├── images/          # 图片资源
│   ├── sun.jpg      # 太阳图片
│   ├── earth.jpg    # 地球图片
│   └── *.jpg        # 其他星球图片
├── scripts/         # 构建脚本
│   ├── build.js     # 构建脚本
│   └── fix-paths.js # 路径修复脚本
└── docs/            # 项目文档
```

## 🚀 开发指南

### 本地开发
```bash
# 启动本地服务器
python3 -m http.server 8000

# 访问主页面
http://localhost:8000/pages/index.html
```

### 路径规则
- **本地开发**: 所有页面使用相对路径 `../css/`, `../js/`, `../images/`
- **部署环境**: 构建脚本自动调整为 `css/`, `js/`, `images/`

### 构建和部署
```bash
# 构建项目
npm run build

# 部署到GitHub Pages
npm run deploy:gh-pages
```

## 🌐 在线访问
- **GitHub Pages**: https://cswenyuanxiao.github.io/solar-system-explorer

## 📋 功能特性
- ✅ 太阳系行星探索
- ✅ 数据可视化图表
- ✅ NASA API集成
- ✅ 教育资源
- ✅ 响应式设计
- ✅ 图片懒加载
- ✅ 下载功能优化

## 🔧 技术栈
- HTML5 / CSS3 / JavaScript
- Chart.js (数据可视化)
- NASA API (实时数据)
- GitHub Pages (部署)

## 📝 注意事项
- 所有页面都在 `pages/` 目录下
- 资源文件在根目录的 `css/`, `js/`, `images/` 目录
- 构建输出在 `dist/` 目录
- 本地开发使用相对路径，部署时自动调整 