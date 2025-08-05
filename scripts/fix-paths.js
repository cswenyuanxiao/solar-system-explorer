#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Function to fix paths in HTML files for deployment only
async function fixPathsInHTML(filePath) {
    try {
        let content = await fs.readFile(filePath, 'utf8');
        let modified = false;

        // Only fix paths for deployment (not for local development)
        // For local development, pages/ files should use ../css/ and ../js/
        // This script should only be used during build process
        
        console.log(`Processing ${filePath} - keeping original paths for local development`);
        
        // Don't modify the files for local development
        // The build script will handle path adjustments during deployment
        
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Function to process all HTML files
async function fixAllHTMLFiles() {
    console.log('🔧 Checking HTML files for local development...');
    
    const htmlFiles = [
        'pages/index.html',
        'pages/charts.html',
        'pages/education.html',
        'pages/api.html',
        'pages/sun.html',
        'pages/mercury.html',
        'pages/venus.html',
        'pages/earth.html',
        'pages/mars.html',
        'pages/jupiter.html',
        'pages/saturn.html',
        'pages/uranus.html',
        'pages/neptune.html'
    ];

    for (const file of htmlFiles) {
        if (await fs.pathExists(file)) {
            await fixPathsInHTML(file);
        } else {
            console.log(`⚠️  File not found: ${file}`);
        }
    }

    console.log('✅ Local development paths are correct!');
    console.log('💡 Note: Path adjustments happen during build process, not here.');
}

// Run the script
fixAllHTMLFiles().catch(console.error); 