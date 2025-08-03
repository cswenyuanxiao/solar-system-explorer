#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Build configuration
const config = {
  source: '.',
  output: 'dist',
  exclude: [
    'node_modules',
    '.git',
    'tests',
    '*.log',
    '.DS_Store',
    'scripts',
    'deploy-config.json',
    'package.json',
    'package-lock.json'
  ],
  include: [
    'pages/**/*',
    'css/**/*',
    'js/**/*',
    'images/**/*',
    'assets/**/*',
    'docs/**/*',
    '*.html',
    '*.xml',
    '*.txt'
  ]
};

async function build() {
  console.log('🚀 Starting build process...');
  
  try {
    // Clean output directory
    await fs.remove(config.output);
    await fs.ensureDir(config.output);
    
    console.log('📁 Creating build directory...');
    
    // Copy files to dist
    await copyFiles();
    
    // Optimize files
    await optimizeFiles();
    
    // Create deployment files
    await createDeploymentFiles();
    
    console.log('✅ Build completed successfully!');
    console.log(`📦 Build output: ${config.output}/`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function copyFiles() {
  console.log('📋 Copying files...');
  
  // Copy main files
  const filesToCopy = [
    'index.html',
    'robots.txt',
    'sitemap.xml'
  ];
  
  for (const file of filesToCopy) {
    if (await fs.pathExists(file)) {
      await fs.copy(file, path.join(config.output, file));
      console.log(`  ✅ Copied ${file}`);
    }
  }
  
  // Copy directories
  const dirsToCopy = ['pages', 'css', 'js', 'images', 'assets', 'docs'];
  
  for (const dir of dirsToCopy) {
    if (await fs.pathExists(dir)) {
      await fs.copy(dir, path.join(config.output, dir));
      console.log(`  ✅ Copied ${dir}/`);
    }
  }
}

async function optimizeFiles() {
  console.log('⚡ Optimizing files...');
  
  // Optimize HTML files
  await optimizeHTML();
  
  // Optimize CSS files
  await optimizeCSS();
  
  // Optimize JS files
  await optimizeJS();
  
  // Optimize images
  await optimizeImages();
}

async function optimizeHTML() {
  console.log('  📄 Optimizing HTML files...');
  
  const htmlFiles = await findFiles(config.output, '**/*.html');
  
  for (const file of htmlFiles) {
    try {
      let content = await fs.readFile(file, 'utf8');
      
      // Remove comments
      content = content.replace(/<!--[\s\S]*?-->/g, '');
      
      // Remove extra whitespace
      content = content.replace(/\s+/g, ' ').trim();
      
      await fs.writeFile(file, content);
      console.log(`    ✅ Optimized ${path.relative(config.output, file)}`);
    } catch (error) {
      console.warn(`    ⚠️  Could not optimize ${file}:`, error.message);
    }
  }
}

async function optimizeCSS() {
  console.log('  🎨 Optimizing CSS files...');
  
  const cssFiles = await findFiles(config.output, '**/*.css');
  
  for (const file of cssFiles) {
    try {
      let content = await fs.readFile(file, 'utf8');
      
      // Remove comments
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove extra whitespace
      content = content.replace(/\s+/g, ' ').trim();
      
      await fs.writeFile(file, content);
      console.log(`    ✅ Optimized ${path.relative(config.output, file)}`);
    } catch (error) {
      console.warn(`    ⚠️  Could not optimize ${file}:`, error.message);
    }
  }
}

async function optimizeJS() {
  console.log('  📜 Optimizing JavaScript files...');
  
  const jsFiles = await findFiles(config.output, '**/*.js');
  
  for (const file of jsFiles) {
    try {
      let content = await fs.readFile(file, 'utf8');
      
      // Remove console.log statements in production
      content = content.replace(/console\.log\([^)]*\);?/g, '');
      
      // Remove extra whitespace
      content = content.replace(/\s+/g, ' ').trim();
      
      await fs.writeFile(file, content);
      console.log(`    ✅ Optimized ${path.relative(config.output, file)}`);
    } catch (error) {
      console.warn(`    ⚠️  Could not optimize ${file}:`, error.message);
    }
  }
}

async function optimizeImages() {
  console.log('  🖼️  Optimizing images...');
  
  const imageFiles = await findFiles(config.output, '**/*.{jpg,jpeg,png,gif}');
  
  console.log(`    📊 Found ${imageFiles.length} images to optimize`);
  console.log('    ℹ️  Image optimization requires additional tools (imagemin)');
  console.log('    ℹ️  Consider running: npm install -g imagemin-cli');
}

async function createDeploymentFiles() {
  console.log('🌐 Creating deployment files...');
  
  // Create _redirects for SPA support
  const redirects = `
/*    /pages/index.html   200
`;
  
  await fs.writeFile(path.join(config.output, '_redirects'), redirects.trim());
  console.log('  ✅ Created _redirects');
  
  // Create netlify.toml
  const netlifyConfig = `
[build]
  publish = "."
  command = "npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.{jpg,jpeg,png,gif,webp}"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
`;
  
  await fs.writeFile(path.join(config.output, 'netlify.toml'), netlifyConfig.trim());
  console.log('  ✅ Created netlify.toml');
  
  // Create vercel.json
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "**/*",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/pages/index.html"
      }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  };
  
  await fs.writeFile(path.join(config.output, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
  console.log('  ✅ Created vercel.json');
}

async function findFiles(dir, pattern) {
  const { glob } = require('glob');
  try {
    const files = await glob(pattern, { cwd: dir });
    return files.map(file => path.join(dir, file));
  } catch (error) {
    console.error('Error finding files:', error);
    return [];
  }
}

// Run build
build().catch(console.error); 