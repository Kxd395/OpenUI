# Development Setup Guide

## Prerequisites

- Python 3.8+ with pip
- Node.js 18+ with npm
- Git

## Quick Start

### Option 1: Use the startup script (Recommended)
```bash
./start.sh
```

### Option 2: Manual setup

#### Backend Setup
```bash
cd backend
pip install -e .
export OPENAI_API_KEY=your-key-here  # Or 'xxx' for Ollama only
python -m openui --dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## VS Code Tasks

Use `Ctrl+Shift+P` and type "Tasks: Run Task" to access these tasks:

### Build Tasks
- **Start Dev Environment** - Runs the startup script
- **Build All** - Builds both frontend and backend
- **Frontend: Install Dependencies** - Installs npm packages
- **Frontend: Build** - Builds the React app for production
- **Frontend: Dev Server** - Starts Vite dev server with hot reload
- **Backend: Install Dependencies** - Installs Python packages
- **Backend: Run FastAPI (Dev)** - Starts FastAPI with auto-reload
- **Backend: Run FastAPI (Prod)** - Starts FastAPI in production mode

### Test Tasks
- **Test All** - Runs all tests (frontend + backend)
- **Frontend: Test** - Runs Vitest tests
- **Frontend: Lint** - Runs ESLint with auto-fix
- **Backend: Test** - Runs pytest

### Docker Tasks
- **Docker: Build Backend** - Builds backend Docker image
- **Docker: Run Backend** - Runs backend in Docker container

## Debugging

Use `F5` or the Debug panel to start debugging:

- **Debug Backend (FastAPI)** - Debug the FastAPI server
- **Debug Backend Tests** - Debug pytest tests
- **Debug TUI App** - Debug the terminal UI application

## Environment Variables

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your-openai-api-key
WANDB_API_KEY=your-wandb-key  # Optional
GITHUB_CLIENT_ID=your-github-client-id  # For OAuth
GITHUB_CLIENT_SECRET=your-github-client-secret  # For OAuth
```

## Project Structure

```
OpenUI/
├── backend/                 # FastAPI Python backend
│   ├── openui/             # Main package
│   │   ├── server.py       # FastAPI application
│   │   ├── __main__.py     # Entry point
│   │   └── ...
│   ├── tests/              # Backend tests
│   └── pyproject.toml      # Python dependencies
├── frontend/               # React TypeScript frontend
│   ├── src/                # Source code
│   ├── dist/               # Built files
│   └── package.json        # Node.js dependencies
└── .vscode/                # VS Code configuration
```

## Development Workflow

1. **Start Development**: Run `./start.sh` or use the VS Code task
2. **Make Changes**: Edit files with auto-reload enabled
3. **Run Tests**: Use VS Code tasks or `npm test` / `pytest`
4. **Debug**: Use VS Code debugging configuration
5. **Build**: Use "Build All" task before deployment

## Ports

- Frontend (Vite): http://localhost:5173
- Backend (FastAPI): http://localhost:7878
- FastAPI Docs: http://localhost:7878/docs

## Troubleshooting

### Backend won't start
- Check if Python packages are installed: `pip list`
- Verify Python version: `python --version`
- Check for port conflicts on 7878

### Frontend won't start
- Check if Node.js packages are installed: `npm list`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for port conflicts on 5173

### Build issues
- Clean build artifacts: `npm run clean` (frontend) or `rm -rf dist/` (backend)
- Reinstall dependencies
- Check for TypeScript/linting errors

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
