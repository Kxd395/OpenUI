#!/bin/bash

# OpenUI Build Script
# This script sets up the entire development environment

set -e  # Exit on any error

echo "🚀 OpenUI Build & Setup Script"
echo "================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or later."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or later is required. Current version: $(node --version)"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
if [ "$(echo "$PYTHON_VERSION < 3.8" | bc -l)" -eq 1 ]; then
    echo "❌ Python 3.8 or later is required. Current version: $(python3 --version)"
    exit 1
fi

echo "✅ Version requirements met"

# Check available ports
echo "🔍 Checking port availability..."
check_port 7878 || echo "⚠️  Backend port 7878 is in use - you may need to stop existing processes"
check_port 5173 || echo "⚠️  Frontend port 5173 is in use - you may need to stop existing processes"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "🔧 Running npm install..."
    npm install
else
    echo "📂 node_modules exists, checking if package.json is newer..."
    if [ "package.json" -nt "node_modules" ]; then
        echo "🔧 package.json is newer, running npm install..."
        npm install
    else
        echo "✅ Frontend dependencies are up to date"
    fi
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend

# Install the package in editable mode
echo "🔧 Installing backend package in editable mode..."
/usr/local/bin/python -m pip install -e .

# Check if additional development dependencies are needed
if [ -f "requirements-dev.txt" ]; then
    echo "🔧 Installing development dependencies..."
    /usr/local/bin/python -m pip install -r requirements-dev.txt
fi

# Install linting and formatting tools if not present
echo "🔧 Installing development tools..."
/usr/local/bin/python -m pip install black pylint pytest pytest-asyncio

cd ..

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "   • To start development environment: ./start.sh"
echo "   • To run frontend only: cd frontend && npm run dev"
echo "   • To run backend only: cd backend && python -m openui --dev"
echo "   • Frontend will be available at: http://localhost:5173"
echo "   • Backend API will be available at: http://localhost:7878"
echo ""
echo "🔑 Environment variables:"
echo "   • Set OPENAI_API_KEY for OpenAI models (optional)"
echo "   • Install Ollama for local models (optional)"
echo ""
echo "📚 Available VS Code tasks:"
echo "   • Ctrl+Shift+P → Tasks: Run Task"
echo "   • Choose from build, test, lint tasks for frontend/backend"
