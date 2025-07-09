import React from 'react';
import { Button } from 'components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { Sparkles } from 'lucide-react';

interface CopilotProps {
  onAction: (action: string) => void;
}

export default function Copilot({ onAction }: CopilotProps) {
  const actions = [
    { name: 'Sharpen', icon: '✨' },
    { name: 'Expand', icon: '➕' },
    { name: 'Distill', icon: '💧' },
  ];

  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => (
        <Tooltip key={action.name}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction(action.name.toLowerCase())}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <span role="img" aria-label={action.name}>{
                action.icon
              }</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{action.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
