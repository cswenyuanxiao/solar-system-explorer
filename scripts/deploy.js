#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const platforms = {
  'github-pages': {
    name: 'GitHub Pages',
    command: 'npm run deploy:gh-pages',
    description: 'Deploy to GitHub Pages'
  },
  'netlify': {
    name: 'Netlify',
    command: 'npm run deploy:netlify',
    description: 'Deploy to Netlify'
  },
  'vercel': {
    name: 'Vercel',
    command: 'npm run deploy:vercel',
    description: 'Deploy to Vercel'
  }
};

async function deploy() {
  console.log('🚀 Starting deployment process...');
  
  const args = process.argv.slice(2);
  const platform = args[0] || 'github-pages';
  
  if (!platforms[platform]) {
    console.error(`❌ Unknown platform: ${platform}`);
    console.log('Available platforms:');
    Object.keys(platforms).forEach(p => {
      console.log(`  - ${p}: ${platforms[p].description}`);
    });
    process.exit(1);
  }
  
  try {
    // Check if dist directory exists
    if (!await fs.pathExists('dist')) {
      console.log('📦 Building project first...');
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    console.log(`🌐 Deploying to ${platforms[platform].name}...`);
    
    // Run deployment command
    execSync(platforms[platform].command, { stdio: 'inherit' });
    
    console.log(`✅ Successfully deployed to ${platforms[platform].name}!`);
    
    // Show deployment URLs
    await showDeploymentInfo(platform);
    
  } catch (error) {
    console.error(`❌ Deployment to ${platforms[platform].name} failed:`, error.message);
    process.exit(1);
  }
}

async function showDeploymentInfo(platform) {
  console.log('\n📋 Deployment Information:');
  
  switch (platform) {
    case 'github-pages':
      console.log('🌐 GitHub Pages URL: https://your-username.github.io/solar-system-explorer');
      console.log('📝 Update package.json with your GitHub username');
      break;
      
    case 'netlify':
      console.log('🌐 Netlify URL: Check your Netlify dashboard');
      console.log('📝 Custom domain can be configured in Netlify settings');
      break;
      
    case 'vercel':
      console.log('🌐 Vercel URL: Check your Vercel dashboard');
      console.log('📝 Custom domain can be configured in Vercel settings');
      break;
  }
  
  console.log('\n📚 Next Steps:');
  console.log('1. Test your deployed site');
  console.log('2. Configure custom domain (optional)');
  console.log('3. Set up continuous deployment');
  console.log('4. Monitor performance with Lighthouse');
}

// Run deployment
deploy().catch(console.error); 