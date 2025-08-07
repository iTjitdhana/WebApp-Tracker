#!/bin/bash

echo "=== Tracker Production Deployment Script ==="
echo "This script will deploy the Next.js tracker app on your server"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found!"
    echo "Please create .env.local with your database credentials:"
    echo "DB_HOST=localhost"
    echo "DB_USER=your_username"
    echo "DB_PASSWORD=your_password"
    echo "DB_NAME=tracker_db"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit..."
fi

# Build the application
echo ""
echo "🔨 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🚀 Starting production server..."
    echo "The app will be available at: http://your-server-ip:3000"
    echo ""
    echo "To run in background, press Ctrl+C and run: npm start &"
    echo "To stop background process, run: pkill -f 'npm start'"
    echo ""
    
    # Start the server
    npm start
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi 