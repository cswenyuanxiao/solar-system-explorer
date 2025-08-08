## Solar System Explorer

[English](README.md) | [中文](README.zh.md)

An interactive, responsive website for exploring our Solar System with live NASA data, charts, and education content.

### Overview
Solar System Explorer visualizes planets and missions using interactive pages and charts. It integrates NASA APIs (Images, EONET, DONKI) and provides an accessibility-friendly UI across devices.

### Live Demo
- GitHub Pages: `https://cswenyuanxiao.github.io/solar-system-explorer`

### Features
- Interactive planet pages and navigation
- Data visualization (Chart.js; basic and advanced charts)
- NASA API integrations (images, events, notifications)
- Global search, favorites, and theme switching
- Accessibility features and responsive design
- Optional PWA offline caching via Service Worker

### Project Structure
```
Solar_System_Project/
├── pages/           # All HTML pages
├── js/              # JavaScript modules
├── css/             # Stylesheets
├── images/          # Image assets
├── docs/            # Documentation
└── scripts/         # Build & deploy utilities
```

### Getting Started
- Quick local preview (Python):
```
python3 -m http.server 8000
# open http://localhost:8000/pages/index.html
```
- Or using npm scripts:
```
npm install
npm run start
```

### Build & Deploy
```
npm run build
npm run deploy:gh-pages
```
- Homepage is set in `package.json` (GitHub Pages)
- Others: `npm run deploy:netlify`, `npm run deploy:vercel`

### Scripts
- start: `serve .`
- build: `node scripts/build.js`
- deploy: `npm run build && npm run deploy:gh-pages`
- optimize: `node scripts/optimize.js`
- test: `node scripts/test.js`
- lighthouse: generate performance report

### Internationalization
- Header language switch (EN/中文 and more)
- Docs available in English and Chinese. Use the links above to switch.

### PWA & Performance
- `sw.js` implements offline strategies (cache-first, network-first, fallbacks).
- Performance improvements: lazy loading, optimized images, cache updates.

### Contributing & License
- Contributions welcome via issues/PRs.
- License: MIT. Imagery and data courtesy of NASA (follow NASA media usage).