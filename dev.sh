#!/bin/bash

# OpenUI Development Helper Script
# This script provides common development tasks

set -e

FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Setup function
setup() {
    print_status "Setting up OpenUI development environment..."
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists python3; then
        print_error "Python 3 is required but not installed."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is required but not installed."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    
    # Setup backend
    print_status "Setting up Python backend..."
    cd "$BACKEND_DIR"
    if [ ! -f ".venv/bin/activate" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv .venv
    fi
    source .venv/bin/activate
    pip install -e .
    cd ..
    print_success "Backend setup complete"
    
    # Setup frontend
    print_status "Setting up Node.js frontend..."
    cd "$FRONTEND_DIR"
    npm install
    cd ..
    print_success "Frontend setup complete"
    
    print_success "Development environment setup complete!"
    print_status "Run './dev.sh start' to start the development servers"
}

# Start development servers
start() {
    print_status "Starting OpenUI development servers..."
    
    # Check if OPENAI_API_KEY is set
    if [ -z "$OPENAI_API_KEY" ]; then
        print_warning "OPENAI_API_KEY not set. You can either:"
        print_warning "  1. Set it as an environment variable: export OPENAI_API_KEY=your-key-here"
        print_warning "  2. Use local Ollama models instead"
        echo ""
    fi
    
    # Start backend
    print_status "Starting backend server..."
    cd "$BACKEND_DIR"
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
    python -m openui --dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting frontend development server..."
    cd "$FRONTEND_DIR"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started!"
    print_status "Frontend: http://localhost:5173"
    print_status "Backend: http://localhost:7878"
    print_status "API Docs: http://localhost:7878/docs"
    echo ""
    print_status "Press Ctrl+C to stop all servers"
    
    # Wait for either process to exit
    wait $BACKEND_PID $FRONTEND_PID
}

# Stop development servers
stop() {
    print_status "Stopping development servers..."
    pkill -f "python -m openui" || true
    pkill -f "npm run dev" || true
    pkill -f "vite" || true
    print_success "Development servers stopped"
}

# Run tests
test() {
    print_status "Running tests..."
    
    # Backend tests
    print_status "Running backend tests..."
    cd "$BACKEND_DIR"
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
    python -m pytest tests/ -v
    cd ..
    
    # Frontend tests
    print_status "Running frontend tests..."
    cd "$FRONTEND_DIR"
    npm test
    cd ..
    
    print_success "All tests completed"
}

# Build for production
build() {
    print_status "Building for production..."
    
    # Build frontend
    print_status "Building frontend..."
    cd "$FRONTEND_DIR"
    npm run build
    cd ..
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd "$BACKEND_DIR"
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
    pip install -e .
    cd ..
    
    print_success "Production build complete"
}

# Clean build artifacts
clean() {
    print_status "Cleaning build artifacts..."
    
    # Frontend
    cd "$FRONTEND_DIR"
    rm -rf dist/ node_modules/.vite/
    cd ..
    
    # Backend
    cd "$BACKEND_DIR"
    rm -rf dist/ build/ *.egg-info/ __pycache__/
    find . -name "*.pyc" -delete
    cd ..
    
    print_success "Clean complete"
}

# Show help
help() {
    echo "OpenUI Development Helper Script"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup    Setup the development environment"
    echo "  start    Start development servers"
    echo "  stop     Stop development servers"
    echo "  test     Run all tests"
    echo "  build    Build for production"
    echo "  clean    Clean build artifacts"
    echo "  help     Show this help message"
    echo ""
}

# Main script logic
case "${1:-help}" in
    setup)
        setup
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    test)
        test
        ;;
    build)
        build
        ;;
    clean)
        clean
        ;;
    help|*)
        help
        ;;
esac
