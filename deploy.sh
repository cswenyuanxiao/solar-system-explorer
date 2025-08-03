#!/bin/bash

# Solar System Explorer - Deployment Script
# This script provides easy deployment options for the project

echo "🚀 Solar System Explorer - Deployment Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to build the project
build_project() {
    echo "📦 Building project..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✅ Build completed successfully!"
    else
        echo "❌ Build failed!"
        exit 1
    fi
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    echo "🌐 Deploying to GitHub Pages..."
    
    # Check if gh-pages is installed
    if ! npm list gh-pages &> /dev/null; then
        echo "📦 Installing gh-pages..."
        npm install gh-pages --save-dev
    fi
    
    # Deploy
    npm run deploy:gh-pages
    if [ $? -eq 0 ]; then
        echo "✅ Successfully deployed to GitHub Pages!"
        echo "🌐 Your site will be available at: https://your-username.github.io/solar-system-explorer"
        echo "📝 Remember to update package.json with your GitHub username"
    else
        echo "❌ GitHub Pages deployment failed!"
        exit 1
    fi
}

# Function to serve locally
serve_locally() {
    echo "🏠 Serving project locally..."
    
    # Check if serve is installed
    if ! npm list serve &> /dev/null; then
        echo "📦 Installing serve..."
        npm install serve --save-dev
    fi
    
    echo "🌐 Starting local server..."
    echo "📱 Your site will be available at: http://localhost:3000"
    echo "🛑 Press Ctrl+C to stop the server"
    
    npm run serve
}

# Function to show help
show_help() {
    echo "Usage: ./deploy.sh [option]"
    echo ""
    echo "Options:"
    echo "  build     - Build the project for deployment"
    echo "  deploy    - Build and deploy to GitHub Pages"
    echo "  serve     - Serve the project locally"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh build"
    echo "  ./deploy.sh deploy"
    echo "  ./deploy.sh serve"
}

# Main script logic
case "${1:-help}" in
    "build")
        build_project
        ;;
    "deploy")
        build_project
        deploy_github_pages
        ;;
    "serve")
        serve_locally
        ;;
    "help"|*)
        show_help
        ;;
esac 