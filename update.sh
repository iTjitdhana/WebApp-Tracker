#!/bin/bash

echo "🔄 Starting Tracker Update..."

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Build new image
echo "🔨 Building new Docker image..."
docker-compose build --no-cache

# Start containers
echo "▶️ Starting containers..."
docker-compose up -d

# Check status
echo "📊 Checking container status..."
docker-compose ps

echo "✅ Update completed!"
echo "🌐 Tracker is running at: http://localhost:3000"
echo "📝 To view logs: docker-compose logs -f tracker" 