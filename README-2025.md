# OpenUI - Updated for 2025

Building UI components can be a slog. OpenUI aims to make the process fun, fast, and flexible. It's also a tool we're using at [W&B](https://wandb.com) to test and prototype our next generation tooling for building powerful applications on top of LLMs.

## ✨ What's New (2025 Update)

- **🔥 Latest OpenAI Models**: Updated to use GPT-4o, GPT-4o Mini, and o1 models
- **🎯 Improved Prompting**: Enhanced system prompts for better UI generation
- **💰 Smart Pricing**: Automatic model-based pricing multipliers
- **📱 Better Responsive Design**: Enhanced mobile and tablet support
- **🛡️ Enhanced Security**: Updated dependencies and security practices

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ 
- Node.js 18+
- OpenAI API key (recommended) or Ollama for local models

### 1. Clone and Setup

```bash
git clone https://github.com/wandb/openui
cd openui
```

### 2. Set up your OpenAI API Key

```bash
export OPENAI_API_KEY="your-key-here"
```

### 3. Start the Application

```bash
# Easy way - use our start script
./start.sh

# Or manually:
# Terminal 1 - Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e .
python -m openui --dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

### 4. Open in Browser

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7878

## 🎨 Available Models

### OpenAI Models (Recommended)
- **GPT-4o** - Latest multimodal model, excellent for complex UI generation
- **GPT-4o Mini** - Faster and more cost-effective
- **GPT-4 Turbo** - High-quality code generation
- **o1 Preview & o1 Mini** - Advanced reasoning models
- **GPT-3.5 Turbo** - Fast and cost-effective

### Local Models (via Ollama)
- **CodeLlama** - Code-focused model
- **Llava** - Vision-capable model
- And many more available through Ollama

## 🔧 Configuration

### Environment Variables

```bash
# Required for OpenAI models
export OPENAI_API_KEY="your-key-here"

# Optional configurations
export OPENUI_ENVIRONMENT="development"  # or "production"
export OPENUI_MAX_TOKENS="700000"       # Usage limits
export DATABASE="path/to/database.db"   # Custom database path
```

### Model Selection

You can change models in the Settings (gear icon) or programmatically:

```javascript
// Frontend - change default model
// Edit: frontend/src/state/atoms/prompts.ts
export const modelAtom = atomWithStorage('model', 'gpt-4o')
```

## 📦 Docker Support

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Pull a model for Ollama
docker exec -it openui-ollama-1 ollama pull llava

# Access at http://localhost:7878
```

### Manual Docker Build

```bash
cd backend
docker build . -t wandb/openui --load
docker run -p 7878:7878 -e OPENAI_API_KEY wandb/openui
```

## 🔍 Features

### UI Generation
- **Text to UI**: Describe what you want and get working HTML/CSS
- **Image to UI**: Upload screenshots and recreate them
- **Iterative Refinement**: Ask for changes and improvements
- **Framework Conversion**: Convert to React, Svelte, Vue, etc.

### Developer Experience
- **Live Preview**: See changes in real-time
- **Code Export**: Copy generated code
- **History**: Track your UI generation sessions
- **Sharing**: Share your creations with others

### Modern Standards
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and semantic HTML
- **Dark Mode**: Automatic dark/light mode support

## 🛠️ Development

### Project Structure

```
openui/
├── backend/          # Python FastAPI backend
│   ├── openui/       # Main application code
│   ├── tests/        # Backend tests
│   └── pyproject.toml
├── frontend/         # React/TypeScript frontend
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json
└── docker-compose.yaml
```

### API Endpoints

- `POST /v1/chat/completions` - OpenAI-compatible chat endpoint
- `GET /api/models` - List available models
- `POST /api/share` - Share UI components
- `GET /api/share/{id}` - Retrieve shared components

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version (3.8+)
- Verify virtual environment is activated
- Ensure all dependencies are installed

**Frontend build fails:**
- Check Node.js version (18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**OpenAI API errors:**
- Verify your API key is valid
- Check your OpenAI account has sufficient credits
- Ensure you have access to the models you're trying to use

**Ollama models not loading:**
- Ensure Ollama is running: `ollama serve`
- Pull the model: `ollama pull codellama`
- Check model compatibility

## 📄 License

Apache 2.0 License - see LICENSE file for details.

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/wandb/openui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/wandb/openui/discussions)
- **Discord**: [W&B Community](https://wandb.me/discord)

## 🙏 Acknowledgments

- OpenAI for their amazing models
- Ollama for local model support
- The open-source community for contributions
- W&B for supporting this project

---

**Happy UI Building! 🎨✨**
