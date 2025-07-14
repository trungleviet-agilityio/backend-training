#!/bin/bash

# Test Setup Script for Blog Engine E2E Tests
# This script sets up the test environment and runs the auth module e2e tests

set -e  # Exit on any error

echo "🚀 Blog Engine E2E Test Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker to continue."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm to continue."
    exit 1
fi

print_status "Checking dependencies..."

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Setup test database
print_status "Setting up test database..."

# Check if test database container already exists
if docker ps -a --format 'table {{.Names}}' | grep -q "blog-engine-test-db"; then
    print_warning "Test database container already exists. Removing..."
    docker stop blog-engine-test-db 2>/dev/null || true
    docker rm blog-engine-test-db 2>/dev/null || true
fi

# Start PostgreSQL container for testing using docker-compose
print_status "Starting PostgreSQL test database..."
docker-compose up -d postgres-test

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 5

# Check if database is responding
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose exec postgres-test pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Database is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Database failed to start after $max_attempts attempts"
        exit 1
    fi
    
    print_status "Attempt $attempt/$max_attempts - Database not ready yet, waiting..."
    sleep 2
    ((attempt++))
done

# Set environment variables for testing
export NODE_ENV=test
export JWT_SECRET=test-jwt-secret-key-for-e2e-tests
export JWT_EXPIRES_IN=1h
export LOG_LEVEL=error
export DB_TYPE=postgres
export DB_HOST=localhost
export DB_PORT=5435
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_DATABASE=blog_engine_test

print_success "Test environment configured"

# Function to run tests
run_tests() {
    local test_type=$1
    print_status "Running $test_type tests..."
    
    case $test_type in
        "auth")
            npm run test:e2e:auth
            ;;
        "all")
            npm run test:e2e
            ;;
        "coverage")
            npm run test:e2e:coverage
            ;;
        *)
            print_error "Unknown test type: $test_type"
            return 1
            ;;
    esac
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up test environment..."
    docker-compose down postgres-test 2>/dev/null || true
    print_success "Cleanup completed"
}

# Trap to ensure cleanup on script exit
trap cleanup EXIT

# Main execution
print_status "Starting tests..."

# Check if specific test type was requested
TEST_TYPE=${1:-"auth"}

case $TEST_TYPE in
    "auth"|"all"|"coverage")
        run_tests $TEST_TYPE
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [test_type]"
        echo ""
        echo "Available test types:"
        echo "  auth     - Run auth module e2e tests (default)"
        echo "  all      - Run all e2e tests"
        echo "  coverage - Run tests with coverage report"
        echo "  help     - Show this help message"
        exit 0
        ;;
    *)
        print_error "Unknown test type: $TEST_TYPE"
        echo "Use '$0 help' for available options"
        exit 1
        ;;
esac

print_success "All tests completed successfully! 🎉"
print_status "Test database will be cleaned up automatically." 