# Solar System Explorer（太阳系探索器）

[English](README.md) | [中文](README.zh.md)

一个交互式、响应式的太阳系探索网站，集成 NASA 实时数据、数据图表与教育内容。

## 概览
Solar System Explorer 通过交互式页面与图表可视化行星与任务数据，集成多种 NASA API（如 Images、EONET、DONKI 等），并提供良好的无障碍与移动端体验。

## 在线演示
- GitHub Pages：`https://cswenyuanxiao.github.io/solar-system-explorer`

## 功能
- 交互式行星页面与导航
- 数据可视化（Chart.js：基础与高级图表）
- NASA API 集成（图片、事件、通知）
- 全局搜索、收藏与主题切换
- 无障碍与响应式设计
- 可选 PWA 离线缓存（Service Worker）

## 项目结构
```
Solar_System_Project/
├── pages/（站点页面）
├── js/（JavaScript 模块）
├── css/（样式文件）
├── images/（图片资源）
├── docs/（文档）
└── scripts/（构建与部署脚本）
```

## 快速开始
- 使用 Python 本地预览：
```
python3 -m http.server 8000
# 打开 http://localhost:8000/pages/index.html
```
- 或使用 npm 脚本：
```
npm install
npm run start
```

## 构建与部署
```
npm run build
npm run deploy:gh-pages
```
- `homepage` 已在 `package.json` 中配置（GitHub Pages）
- 其他平台：`npm run deploy:netlify`、`npm run deploy:vercel`

## 常用脚本
- start：`serve .`
- build：`node scripts/build.js`
- deploy：`npm run build && npm run deploy:gh-pages`
- optimize：`node scripts/optimize.js`
- test：`node scripts/test.js`
- lighthouse：生成性能报告

## 国际化（i18n）
- 站点在页眉支持语言切换（英文/中文等）。
- 文档提供中英文版本。通过顶部链接切换阅读语言。

## PWA 与性能
- `sw.js` 实现离线缓存策略（缓存优先、网络优先、降级回退）。
- 性能优化包括懒加载、优化图片与缓存更新等。

## 贡献与许可
- 欢迎提交 Issue/PR 改进网站与文档。
- 许可证：MIT；图片与数据来源：NASA（请遵循 NASA 媒体使用规范）。
