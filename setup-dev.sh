#!/bin/bash

# OpenUI Development Setup Script
# This script configures the development environment with proper tooling

set -e

echo "🛠️  OpenUI Development Environment Setup"
echo "========================================"

# Create .vscode settings if they don't exist
if [ ! -f ".vscode/settings.json" ]; then
    echo "⚙️  Creating VS Code settings..."
    mkdir -p .vscode
    cat > .vscode/settings.json << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.organizeImports": "explicit",
        "source.fixAll.eslint": "explicit"
    },
    "python.defaultInterpreterPath": "/usr/local/bin/python",
    "python.terminal.activateEnvironment": false,
    "typescript.preferences.importModuleSpecifier": "relative",
    "eslint.workingDirectories": ["frontend"],
    "files.associations": {
        "*.md": "markdown"
    },
    "emmet.includeLanguages": {
        "typescript": "html",
        "typescriptreact": "html"
    },
    "tailwindCSS.includeLanguages": {
        "typescript": "html",
        "typescriptreact": "html"
    },
    "css.validate": false,
    "scss.validate": false,
    "less.validate": false
}
EOF
    echo "✅ VS Code settings created"
fi

# Create .vscode extensions recommendations
if [ ! -f ".vscode/extensions.json" ]; then
    echo "📦 Creating VS Code extensions recommendations..."
    cat > .vscode/extensions.json << 'EOF'
{
    "recommendations": [
        "ms-python.python",
        "ms-python.pylint",
        "ms-python.black-formatter",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ms-vscode.vscode-typescript-next",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-json",
        "redhat.vscode-yaml",
        "ms-vscode-remote.remote-containers"
    ]
}
EOF
    echo "✅ VS Code extensions recommendations created"
fi

# Create .gitignore additions if needed
if ! grep -q "# IDE files" .gitignore 2>/dev/null; then
    echo "📝 Adding IDE-related entries to .gitignore..."
    cat >> .gitignore << 'EOF'

# IDE files
.vscode/settings.json
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
*.log

# Environment files
.env.local
.env.development.local
.env.test.local
.env.production.local

# Python cache
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
pip-log.txt
pip-delete-this-directory.txt

# Node modules and build artifacts
node_modules/
dist/
build/
.next/
out/

# Testing
coverage/
.nyc_output
.coverage
htmlcov/

# Misc
.cache
.parcel-cache
EOF
    echo "✅ .gitignore updated"
fi

# Create frontend linting configuration
cd frontend

# Check if .eslintrc.json exists and update it
if [ -f ".eslintrc.json" ]; then
    echo "✅ ESLint configuration already exists"
else
    echo "⚙️  Creating ESLint configuration..."
    cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  }
}
EOF
    echo "✅ ESLint configuration created"
fi

# Create Prettier configuration
if [ ! -f ".prettierrc.json" ]; then
    echo "⚙️  Creating Prettier configuration..."
    cat > .prettierrc.json << 'EOF'
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF
    echo "✅ Prettier configuration created"
fi

cd ../backend

# Create Python development configuration
if [ ! -f "pyproject.toml" ] || ! grep -q "\[tool.black\]" pyproject.toml; then
    echo "⚙️  Adding Python development tools configuration..."
    cat >> pyproject.toml << 'EOF'

[tool.black]
line-length = 100
target-version = ['py38']
include = '\.pyi?$'
extend-exclude = '''
/(
  __pycache__
  | \.git
  | \.mypy_cache
  | \.tox
  | \.venv
  | _build
  | buck-out
  | build
  | dist
)/
'''

[tool.pylint]
max-line-length = 100
disable = ["C0111", "R0903"]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
addopts = "-v --tb=short"
EOF
    echo "✅ Python tools configuration added"
fi

cd ..

# Create a development requirements file for backend
if [ ! -f "backend/requirements-dev.txt" ]; then
    echo "📦 Creating development requirements file..."
    cat > backend/requirements-dev.txt << 'EOF'
# Development dependencies
black>=23.0.0
pylint>=2.15.0
pytest>=7.0.0
pytest-asyncio>=0.21.0
pytest-cov>=4.0.0
pre-commit>=3.0.0

# Testing utilities
httpx>=0.24.0
respx>=0.20.0

# Type checking
mypy>=1.0.0
types-requests>=2.28.0
EOF
    echo "✅ Development requirements file created"
fi

# Create pre-commit configuration
if [ ! -f ".pre-commit-config.yaml" ]; then
    echo "⚙️  Creating pre-commit configuration..."
    cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict

  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
        files: ^backend/

  - repo: https://github.com/pycqa/pylint
    rev: v3.0.0a6
    hooks:
      - id: pylint
        files: ^backend/
        args: [--disable=all, --enable=unused-import]

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.44.0
    hooks:
      - id: eslint
        files: ^frontend/.*\.(js|jsx|ts|tsx)$
        additional_dependencies:
          - eslint@8.44.0
          - '@typescript-eslint/eslint-plugin@5.61.0'
          - '@typescript-eslint/parser@5.61.0'

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.0
    hooks:
      - id: prettier
        files: ^frontend/.*\.(js|jsx|ts|tsx|json|css|md)$
EOF
    echo "✅ Pre-commit configuration created"
fi

# Create a Makefile for common tasks
if [ ! -f "Makefile" ]; then
    echo "⚙️  Creating Makefile for common tasks..."
    cat > Makefile << 'EOF'
.PHONY: help install build test lint clean dev

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	cd backend && /usr/local/bin/python -m pip install -e .
	cd backend && /usr/local/bin/python -m pip install -r requirements-dev.txt

build: ## Build the project
	@echo "🏗️  Building project..."
	cd frontend && npm run build

test: ## Run all tests
	@echo "🧪 Running tests..."
	cd frontend && npm test
	cd backend && /usr/local/bin/python -m pytest

lint: ## Run linting
	@echo "🔍 Running linting..."
	cd frontend && npm run lint
	cd backend && /usr/local/bin/python -m black --check openui/
	cd backend && /usr/local/bin/python -m pylint openui/

format: ## Format code
	@echo "✨ Formatting code..."
	cd frontend && npm run format
	cd backend && /usr/local/bin/python -m black openui/

clean: ## Clean build artifacts
	@echo "🧹 Cleaning..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.cache
	find backend -name "__pycache__" -type d -exec rm -rf {} +
	find backend -name "*.pyc" -delete

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	./start.sh

setup: ## Setup development environment
	@echo "🛠️  Setting up development environment..."
	./setup-dev.sh

docker-build: ## Build with Docker
	@echo "🐳 Building with Docker..."
	docker-compose build

docker-up: ## Start with Docker
	@echo "🐳 Starting with Docker..."
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "🐳 Stopping Docker containers..."
	docker-compose down

docker-logs: ## Show Docker logs
	@echo "📜 Showing Docker logs..."
	docker-compose logs -f
EOF
    echo "✅ Makefile created"
fi

echo ""
echo "✅ Development environment setup completed!"
echo ""
echo "🎯 Next steps:"
echo "   • Run './build.sh' to install dependencies and build"
echo "   • Run 'make dev' or './start.sh' to start development"
echo "   • Run 'make help' to see all available commands"
echo ""
echo "🔧 Development tools available:"
echo "   • make install - Install all dependencies"
echo "   • make build - Build the project"
echo "   • make test - Run all tests"
echo "   • make lint - Run linting"
echo "   • make format - Format code"
echo "   • make clean - Clean build artifacts"
echo ""
echo "📝 VS Code integration:"
echo "   • Ctrl+Shift+P → Tasks: Run Task (see all available tasks)"
echo "   • Install recommended extensions when prompted"
echo "   • Code formatting and linting will run automatically"
