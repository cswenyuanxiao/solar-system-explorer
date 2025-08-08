#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function build() {
    console.log('🚀 Starting a fresh build process (v5)...');
    
    const outputDir = 'dist';

    // 1. Clean and create output directory
    console.log(`🧹 Cleaning directory: ${outputDir}`);
    await fs.remove(outputDir);
    await fs.ensureDir(outputDir);
    await fs.ensureDir(path.join(outputDir, 'pages'));
    console.log(`📦 Created directory structure: ${outputDir}`);

    // 2. Copy asset directories
    const assetDirs = ['css', 'js', 'images', 'docs'];
    for (const dir of assetDirs) {
        const sourcePath = path.join(__dirname, '..', dir);
        const destPath = path.join(outputDir, dir);
        if (await fs.pathExists(sourcePath)) {
            await fs.copy(sourcePath, destPath);
            console.log(`📂 Copied ${dir}/ to ${outputDir}/${dir}/`);
        }
    }

    // 3. Process and copy HTML files
    console.log('📄 Processing and copying HTML files...');
    const pagesDir = path.join(__dirname, '..', 'pages');
    const sourceHtmlFiles = await fs.readdir(pagesDir);
    
    for (const file of sourceHtmlFiles) {
        if (!file.endsWith('.html')) continue;

        const sourcePath = path.join(pagesDir, file);
        let content = await fs.readFile(sourcePath, 'utf8');
        
        // Remove base tag completely
        content = content.replace(/<base href="[^"]*">/g, '');
        
        // Fix relative paths for pages in subdirectory
        content = content.replace(/(href|src|data-src)="\.\.\//g, '$1="../');
        
        // Fix navigation links to work correctly
        content = content.replace(/href="((?!http|#)[^"]+\.html)"/g, (match, p1) => {
            if (p1 === 'index.html') {
                return `href="../index.html"`;
            }
            if (p1.startsWith('pages/')) {
                return `href="${p1}"`;
            }
            return `href="${p1}"`;
        });
        
        const destPath = path.join(outputDir, 'pages', file);
        await fs.writeFile(destPath, content);
        console.log(`   ✨ Processed and copied ${file} to ${path.relative(process.cwd(), destPath)}`);
    }
    
    // 4. Process main index.html (or synthesize a redirect when missing)
    const mainIndexPath = path.join(__dirname, '..', 'index.html');
    if (await fs.pathExists(mainIndexPath)) {
        let content = await fs.readFile(mainIndexPath, 'utf8');
        
        // Remove base tag completely
        content = content.replace(/<base href="[^"]*">/g, '');
        
        // Fix relative paths for root directory
        content = content.replace(/(href|src|data-src)="\.\.\//g, '$1="');
        
        // Fix navigation links
        content = content.replace(/href="((?!http|#)[^"]+\.html)"/g, (match, p1) => {
            if (p1 === 'index.html') {
                return `href="index.html"`;
            }
            if (p1.startsWith('pages/')) {
                return match;
            }
            return `href="pages/${p1}"`;
        });
        
        await fs.writeFile(path.join(outputDir, 'index.html'), content);
        console.log(`   ✨ Processed and copied index.html to ${outputDir}/index.html`);
    } else {
        // If there is no root index.html in repo, create a lightweight redirect to pages/index.html
        const redirect = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./pages/index.html"><title>Redirecting…</title><link rel="canonical" href="./pages/index.html"></head><body><p>If you are not redirected automatically, <a href="./pages/index.html">click here</a>.</p></body></html>`;
        await fs.writeFile(path.join(outputDir, 'index.html'), redirect);
        console.log(`   ✨ Created redirect index.html -> pages/index.html`);
    }
    
    const rootFiles = ['robots.txt', 'sitemap.xml', 'manifest.json', 'sw.js'];
    for (const file of rootFiles) {
        const sourcePath = path.join(__dirname, '..', file);
        if (await fs.pathExists(sourcePath)) {
            await fs.copy(sourcePath, path.join(outputDir, file));
            console.log(`📄 Copied ${file} to root`);
        }
    }

    // Ensure a root 404.html exists for GitHub Pages
    try {
        const pages404 = path.join(__dirname, '..', 'pages', '404.html');
        if (await fs.pathExists(pages404)) {
            let content404 = await fs.readFile(pages404, 'utf8');
            // Adjust relative asset paths from ../ to ./ for root usage
            content404 = content404.replace(/(href|src|data-src)="\.+\/(css|js|images)\//g, '$1="./$2/');
            await fs.writeFile(path.join(outputDir, '404.html'), content404);
            console.log('   ✨ Created root 404.html');
        }
    } catch (e) {
        console.warn('   ⚠️ Could not create root 404.html', e);
    }

    console.log('✅ Build completed successfully!');
    console.log('🔧 Removed base tags and fixed navigation paths');
}

build().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});
