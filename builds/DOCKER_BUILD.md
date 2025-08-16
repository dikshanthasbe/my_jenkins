# 🐳 Docker Build Guide

This document explains how to build and deploy Jenmon (Jenkins Monitor) using Docker.

## 📋 Prerequisites

- Docker installed and running
- Access to container registry (optional for pushing images)

## 🏗️ Building Images

### Application Image (Jenmon App)

```bash
# Build the Docker image
docker build -f builds/Dockerfile.app -t docker.cloud.digite.com/digite/jenmon:1.2.0 .

# Test the build
docker run -d -p 8501:8501 --name jenmon jenmon:latest
```

### Database Image (Jenmon DB)

```bash
# Build the database image (uses local init script from db/init/01_init.sql)
docker build -f builds/Dockerfile.db -t docker.cloud.digite.com/digite/jenmon-db:1.0 .

# Test the database image
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=jenkins_dashboard \
  -e POSTGRES_USER=jenkins_user \
  -e POSTGRES_PASSWORD=your-password \
  --name jenmon-db \
  jenmon-db:15.13-v1.0.0
```

## 🚀 Running with Environment Variables

### Application Container

```bash
docker run -d -p 8501:8501 \
  -e JENKINS_BASE_URL=https://your-jenkins.com/ \
  -e JENKINS_USERNAME=your-username \
  -e JENKINS_PASSWORD=your-password \
  -e DB_TYPE=postgresql \
  -e POSTGRES_HOST=jenmon-db \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_DB=jenkins_dashboard \
  -e POSTGRES_USER=jenkins_user \
  -e POSTGRES_PASSWORD=your-password \
  --name jenmon \
  jenmon:latest
```

### Database Container

```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=jenkins_dashboard \
  -e POSTGRES_USER=jenkins_user \
  -e POSTGRES_PASSWORD=your-password \
  --name jenmon-db \
  jenmon-db:15.13-v1.0.0
```

## 📦 Registry Integration

### Push to Registry

```bash
# Tag images for registry
docker tag jenmon:latest your-registry/jenmon:latest
docker tag jenmon-db:15.13-v1.0.0 your-registry/jenmon-db:15.13-v1.0.0

# Push to registry
docker push your-registry/jenmon:latest
docker push your-registry/jenmon-db:15.13-v1.0.0
```

### Pull from Registry

```bash
# Pull the images
docker pull your-registry/jenmon:latest
docker pull your-registry/jenmon-db:15.13-v1.0.0

# Run the containers
docker run -d -p 8501:8501 \
  -e JENKINS_BASE_URL=https://your-jenkins.com/ \
  -e JENKINS_USERNAME=your-username \
  -e JENKINS_PASSWORD=your-password \
  --name jenmon \
  your-registry/jenmon:latest
```

## 🔧 Image Details

### Application Image (`Dockerfile.app`)
- **Base**: `python:3.11-slim-bullseye`
- **Port**: 8501 (Streamlit)
- **Features**: Jenkins API integration, PostgreSQL support, Streamlit UI

### Database Image (`Dockerfile.db`)
- **Base**: `postgres:15.13`
- **Port**: 5432 (PostgreSQL)
- **Features**: Pre-configured schema, indexes, views, triggers
- **Init Script**: Uses `db/init/01_init.sql` from this repository

## 🏷️ Versioning Strategy

### Application Image
- **Tag**: `latest`, `1.0.0`, `1.1.0`
- **Rebuild**: When application code changes

### Database Image
- **Tag**: `15.13-v1.0.0`, `15.13-v1.1.0`
- **Rebuild**: When init script changes or PostgreSQL version updates

## 🧹 Cleanup

```bash
# Stop and remove containers
docker stop jenmon jenmon-db
docker rm jenmon jenmon-db

# Remove images
docker rmi jenmon:latest jenmon-db:15.13-v1.0.0

# Remove volumes (if using named volumes)
docker volume rm jenkins_dashboard_postgres_data
``` 