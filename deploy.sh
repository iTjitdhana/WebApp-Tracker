#!/bin/bash

echo "🚀 Starting Tracker Deployment..."

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

echo "✅ Deployment completed!"
echo "🌐 Tracker is running at: http://localhost:3000"
echo "📝 To view logs: docker-compose logs -f" 