#!/bin/bash

# Demo Setup Script for Blog Engine
# Demonstrates the complete Docker Compose setup with PostgreSQL databases

set -e

echo "🚀 Blog Engine Docker Demo"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_success "All prerequisites are installed!"

# Install dependencies
print_status "Installing npm dependencies..."
npm install --silent
print_success "Dependencies installed!"

# Clean up any existing containers
print_status "Cleaning up existing containers..."
docker-compose down -v 2>/dev/null || true
print_success "Cleanup completed!"

# Start development database
print_status "Starting development database (PostgreSQL on port 5434)..."
npm run db:dev
sleep 5

# Check development database health
print_status "Checking development database health..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres-dev pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Development database is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Development database failed to start"
        exit 1
    fi
    
    echo "  Waiting for database... ($attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

# Start test database
print_status "Starting test database (PostgreSQL on port 5435)..."
npm run db:test
sleep 5

# Check test database health
print_status "Checking test database health..."
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres-test pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Test database is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Test database failed to start"
        exit 1
    fi
    
    echo "  Waiting for database... ($attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

# Show running containers
print_status "Docker containers status:"
docker-compose ps

# Test database connections
print_status "Testing database connections..."

print_status "  Testing development database connection..."
if docker-compose exec -T postgres-dev psql -U postgres -d blog_engine_dev -c "SELECT 'Development DB Connected!' as status;" > /dev/null 2>&1; then
    print_success "  Development database connection successful!"
else
    print_error "  Development database connection failed!"
fi

print_status "  Testing test database connection..."
if docker-compose exec -T postgres-test psql -U postgres -d blog_engine_test -c "SELECT 'Test DB Connected!' as status;" > /dev/null 2>&1; then
    print_success "  Test database connection successful!"
else
    print_error "  Test database connection failed!"
fi

# Build the application
print_status "Building the application..."
npm run build
print_success "Application built successfully!"

# Run a quick test
print_status "Running auth module e2e tests..."
export NODE_ENV=test
export DB_PORT=5435
export DB_DATABASE=blog_engine_test

if npm run test:e2e:auth --silent; then
    print_success "Auth tests passed!"
else
    print_warning "Some tests may have failed - check the output above"
fi

# Start additional services
print_status "Starting Redis and PgAdmin..."
docker-compose up -d redis pgadmin
sleep 3

print_success "🎉 Demo setup completed successfully!"
echo ""
echo "📊 Service Status:"
echo "==================="
echo "✅ Development Database: PostgreSQL on port 5434"
echo "✅ Test Database: PostgreSQL on port 5435" 
echo "✅ Redis Cache: Redis on port 6379"
echo "✅ PgAdmin: Web UI on port 8080"
echo ""
echo "🔗 Quick Access:"
echo "================="
echo "📖 PgAdmin: http://localhost:8080"
echo "   - Email: admin@blogengine.com"
echo "   - Password: admin123"
echo ""
echo "🛠️  Development Commands:"
echo "========================="
echo "npm run start:dev          # Start the application"
echo "npm run test:e2e:auth      # Run auth tests"
echo "npm run docker:logs        # View service logs"
echo "npm run docker:down        # Stop all services"
echo ""
echo "📚 Full documentation: ./DOCKER-SETUP.md"
echo ""

# Optional: Show logs for a few seconds
print_status "Showing recent logs (Ctrl+C to exit)..."
sleep 2
docker-compose logs --tail=10 postgres-dev postgres-test
