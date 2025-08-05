#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

/**
 * 路径检查脚本
 * 检查所有HTML文件是否符合路径规则
 */

async function checkPaths() {
    console.log('🔍 检查路径规则...');
    
    const issues = [];
    const checkedFiles = [];
    
    // 检查pages目录下的文件
    const pagesDir = path.join(__dirname, '..', 'pages');
    if (await fs.pathExists(pagesDir)) {
        const files = await fs.readdir(pagesDir);
        for (const file of files) {
            if (file.endsWith('.html')) {
                const filePath = path.join(pagesDir, file);
                const issues = await checkFile(filePath, 'sub');
                if (issues.length > 0) {
                    console.log(`❌ ${file}:`);
                    issues.forEach(issue => console.log(`   - ${issue}`));
                } else {
                    console.log(`✅ ${file}`);
                }
                checkedFiles.push(file);
            }
        }
    }
    
    // 检查根目录的HTML文件
    const rootDir = __dirname + '/..';
    const rootFiles = await fs.readdir(rootDir);
    for (const file of rootFiles) {
        if (file.endsWith('.html') && file !== 'index.html') {
            const filePath = path.join(rootDir, file);
            const issues = await checkFile(filePath, 'root');
            if (issues.length > 0) {
                console.log(`❌ ${file}:`);
                issues.forEach(issue => console.log(`   - ${issue}`));
            } else {
                console.log(`✅ ${file}`);
            }
            checkedFiles.push(file);
        }
    }
    
    console.log('');
    console.log(`📊 检查完成: ${checkedFiles.length} 个文件`);
    
    if (issues.length === 0) {
        console.log('🎉 所有文件都符合路径规则！');
    } else {
        console.log(`⚠️  发现 ${issues.length} 个问题需要修复`);
    }
}

async function checkFile(filePath, fileType) {
    const issues = [];
    const content = await fs.readFile(filePath, 'utf8');
    
    // 检查base标签
    if (content.includes('<base href')) {
        issues.push('包含base标签 - 应该移除');
    }
    
    // 检查绝对路径（内部资源）
    const absolutePathRegex = /(href|src|data-src)="\/(?!\/)/g;
    if (absolutePathRegex.test(content)) {
        issues.push('包含绝对路径 - 应该使用相对路径');
    }
    
    // 检查硬编码的完整URL
    const fullUrlRegex = /href="https?:\/\/[^"]*solar-system-explorer[^"]*"/g;
    if (fullUrlRegex.test(content)) {
        issues.push('包含硬编码的完整URL - 应该使用相对路径');
    }
    
    // 检查相对路径格式
    if (fileType === 'sub') {
        // 子页面应该使用 ../ 访问上级目录
        const wrongRelativePathRegex = /(href|src|data-src)="(?!\.\.\/)(?!http|#)[^"]*\.(css|js|jpg|png|gif|svg)"/g;
        if (wrongRelativePathRegex.test(content)) {
            issues.push('CSS/JS/图片路径应该使用 ../ 前缀');
        }
    } else {
        // 根页面直接访问同级目录
        const wrongRelativePathRegex = /(href|src|data-src)="\.\.\/(?!http|#)[^"]*\.(css|js|jpg|png|gif|svg)"/g;
        if (wrongRelativePathRegex.test(content)) {
            issues.push('CSS/JS/图片路径不应该使用 ../ 前缀');
        }
    }
    
    // 检查导航链接
    if (fileType === 'sub') {
        // 子页面之间的导航
        const wrongNavRegex = /href="pages\//g;
        if (wrongNavRegex.test(content)) {
            issues.push('子页面导航不应该包含 pages/ 前缀');
        }
    }
    
    return issues;
}

// 运行检查
checkPaths().catch(error => {
    console.error('❌ 检查失败:', error);
    process.exit(1);
}); 