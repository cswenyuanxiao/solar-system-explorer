#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

/**
 * 快速创建新页面的脚本
 * 使用方法: node scripts/create-page.js [页面名称] [页面类型]
 * 
 * 页面类型:
 * - sub: 子页面 (pages/目录下)
 * - root: 根页面 (根目录下)
 */

async function createPage() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('❌ 使用方法: node scripts/create-page.js [页面名称] [页面类型]');
        console.log('');
        console.log('页面类型:');
        console.log('  sub  - 子页面 (pages/目录下)');
        console.log('  root - 根页面 (根目录下)');
        console.log('');
        console.log('示例:');
        console.log('  node scripts/create-page.js about sub');
        console.log('  node scripts/create-page.js landing root');
        process.exit(1);
    }

    const pageName = args[0];
    const pageType = args[1];
    
    if (!['sub', 'root'].includes(pageType)) {
        console.log('❌ 页面类型必须是 "sub" 或 "root"');
        process.exit(1);
    }

    try {
        // 读取模板
        const templatePath = path.join(__dirname, '..', 'templates', `${pageType}-template.html`);
        const template = await fs.readFile(templatePath, 'utf8');
        
        // 生成页面内容
        const pageContent = template
            .replace(/页面标题/g, pageName.charAt(0).toUpperCase() + pageName.slice(1))
            .replace(/页面描述/g, `${pageName} 页面描述`)
            .replace(/\[page-specific\]/g, pageName)
            .replace(/主要内容标题/g, `${pageName} 主要内容`)
            .replace(/这里是页面的主要内容\.\.\./g, `这里是 ${pageName} 页面的主要内容...`);
        
        // 确定输出路径
        let outputPath;
        let cssPath;
        let jsPath;
        
        if (pageType === 'sub') {
            outputPath = path.join(__dirname, '..', 'pages', `${pageName}.html`);
            cssPath = path.join(__dirname, '..', 'css', `${pageName}.css`);
            jsPath = path.join(__dirname, '..', 'js', `${pageName}.js`);
        } else {
            outputPath = path.join(__dirname, '..', `${pageName}.html`);
            cssPath = path.join(__dirname, '..', 'css', `${pageName}.css`);
            jsPath = path.join(__dirname, '..', 'js', `${pageName}.js`);
        }
        
        // 创建页面文件
        await fs.writeFile(outputPath, pageContent);
        console.log(`✅ 创建页面: ${outputPath}`);
        
        // 创建CSS文件
        const cssContent = `/* ${pageName} 页面样式 */
.${pageName}-page {
    /* 页面特定样式 */
}

.${pageName}-hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
}

.${pageName}-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}
`;
        await fs.writeFile(cssPath, cssContent);
        console.log(`✅ 创建CSS文件: ${cssPath}`);
        
        // 创建JS文件
        const jsContent = `/**
 * ${pageName} 页面脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('${pageName} 页面加载完成');
    
    // 在这里添加页面特定的功能
    init${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page();
});

function init${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page() {
    // 初始化页面功能
    console.log('初始化 ${pageName} 页面功能');
    
    // 示例：添加事件监听器
    // const buttons = document.querySelectorAll('.${pageName}-btn');
    // buttons.forEach(button => {
    //     button.addEventListener('click', handle${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Click);
    // });
}

// function handle${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Click(event) {
//     // 处理点击事件
//     console.log('${pageName} 按钮被点击');
// }
`;
        await fs.writeFile(jsPath, jsContent);
        console.log(`✅ 创建JS文件: ${jsPath}`);
        
        // 更新导航（可选）
        console.log('');
        console.log('📝 下一步:');
        console.log(`1. 编辑 ${outputPath} 添加页面内容`);
        console.log(`2. 编辑 ${cssPath} 添加页面样式`);
        console.log(`3. 编辑 ${jsPath} 添加页面功能`);
        console.log('4. 在 shared-header.js 中添加导航链接');
        console.log('5. 运行 npm run build 构建项目');
        
        console.log('');
        console.log('✅ 页面创建完成！');
        
    } catch (error) {
        console.error('❌ 创建页面失败:', error);
        process.exit(1);
    }
}

createPage(); 