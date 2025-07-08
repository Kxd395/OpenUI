import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { toolExecutor, ToolCall as LibToolCall, ToolResult } from '../lib/toolExecutor'

interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: ToolResult
  status: 'pending' | 'running' | 'completed' | 'error'
  error?: string
  executionTime?: number
}

interface ToolExecutorProps {
  toolCalls: ToolCall[]
  onRetry: (toolCallId: string) => void
  onExecute?: (toolCall: ToolCall) => void
}

export default function ToolExecutor({ toolCalls, onRetry, onExecute }: ToolExecutorProps) {
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set())
  const [executingCalls, setExecutingCalls] = useState<Set<string>>(new Set())

  const executeToolCall = async (toolCall: ToolCall) => {
    if (executingCalls.has(toolCall.id)) return

    setExecutingCalls(prev => new Set(prev).add(toolCall.id))
    
    try {
      const libToolCall: LibToolCall = {
        id: toolCall.id,
        name: toolCall.name,
        arguments: toolCall.arguments,
        status: 'running',
        timestamp: Date.now()
      }

      const result = await toolExecutor.executeTool(libToolCall)
      
      // Notify parent component of execution
      if (onExecute) {
        const updatedCall = {
          ...toolCall,
          result,
          status: result.success ? 'completed' as const : 'error' as const,
          error: result.error,
          executionTime: result.metadata?.executionTime
        }
        onExecute(updatedCall)
      }
    } catch (error) {
      if (onExecute) {
        const updatedCall = {
          ...toolCall,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        onExecute(updatedCall)
      }
    } finally {
      setExecutingCalls(prev => {
        const newSet = new Set(prev)
        newSet.delete(toolCall.id)
        return newSet
      })
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCalls)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCalls(newExpanded)
  }

  const renderToolResult = (result: ToolResult) => {
    if (!result.success && result.error) {
      return (
        <div className="text-xs bg-red-50 p-3 rounded border text-red-800">
          <strong>Error:</strong> {result.error}
        </div>
      )
    }

    const displayType = result.metadata?.displayType || 'text'
    const contentType = result.metadata?.contentType || 'text/plain'

    switch (displayType) {
      case 'html':
        return (
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={result.data}
              className="w-full h-96 border-0"
              title="Tool Result"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )
      
      case 'json':
        return (
          <div className="text-xs bg-blue-50 p-3 rounded border">
            <pre className="overflow-x-auto text-blue-900">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )
      
      case 'image':
        return (
          <div className="border rounded-lg overflow-hidden">
            <img 
              src={result.data} 
              alt="Tool result" 
              className="max-w-full h-auto"
            />
          </div>
        )
      
      case 'text':
      default:
        return (
          <div className="text-xs bg-gray-50 p-3 rounded border">
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )
    }
  }

  const getStatusIcon = (status: ToolCall['status']) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'running':
        return '🔄'
      case 'completed':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '❓'
    }
  }

  const getStatusColor = (status: ToolCall['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'running':
        return 'text-blue-600 bg-blue-50'
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (toolCalls.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold text-gray-900">Tool Execution</h3>
      
      {toolCalls.map((toolCall) => (
        <Card key={toolCall.id} className="border shadow-sm">
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpanded(toolCall.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(toolCall.status)}</span>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {toolCall.name}
                  </CardTitle>
                  <CardDescription>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(toolCall.status)}`}>
                      {toolCall.status}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {toolCall.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      executeToolCall(toolCall)
                    }}
                    disabled={executingCalls.has(toolCall.id)}
                  >
                    {executingCalls.has(toolCall.id) ? 'Executing...' : 'Execute'}
                  </Button>
                )}
                {toolCall.status === 'error' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRetry(toolCall.id)
                    }}
                  >
                    Retry
                  </Button>
                )}
                {toolCall.executionTime && (
                  <span className="text-xs text-gray-500">
                    {toolCall.executionTime}ms
                  </span>
                )}
                <span className="text-sm text-gray-400">
                  {expandedCalls.has(toolCall.id) ? '↑' : '↓'}
                </span>
              </div>
            </div>
          </CardHeader>
          
          {expandedCalls.has(toolCall.id) && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Arguments */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Arguments</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
                    {JSON.stringify(toolCall.arguments, null, 2)}
                  </pre>
                </div>
                
                {/* Result */}
                {toolCall.result && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Result</h4>
                    {renderToolResult(toolCall.result)}
                  </div>
                )}
                
                {/* Error */}
                {toolCall.error && (
                  <div>
                    <h4 className="text-sm font-medium text-red-700 mb-2">Error</h4>
                    <div className="text-xs bg-red-50 p-3 rounded border text-red-800">
                      {toolCall.error}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
