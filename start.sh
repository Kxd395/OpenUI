#!/bin/bash

# OpenUI startup script
echo "🚀 Starting OpenUI..."

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY not set. You can either:"
    echo "   1. Set it as an environment variable: export OPENAI_API_KEY=your-key-here"
    echo "   2. Use local Ollama models instead"
    echo ""
fi

# Start the backend in the background
echo "🔧 Starting backend server..."
cd backend
/workspaces/OpenUI/.venv/bin/python -m openui --dev &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 3

# Start the frontend in development mode
echo "🎨 Starting frontend development server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ OpenUI is starting up!"
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend: http://localhost:7878"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
