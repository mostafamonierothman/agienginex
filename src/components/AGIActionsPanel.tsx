
import React from 'react';
import { Button } from '@/components/ui/button';

interface AGIActionsPanelProps {
  onAction: (action: string) => void;
}

export const AGIActionsPanel: React.FC<AGIActionsPanelProps> = ({ onAction }) => {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" onClick={() => onAction('start the loop')}>
        🟢 Start AGI Loop
      </Button>
      <Button size="sm" variant="secondary" onClick={() => onAction('stop the loop')}>
        🔴 Stop AGI Loop
      </Button>
      <Button size="sm" variant="secondary" onClick={() => onAction('run agent chain')}>
        🔗 Run Agent Chain
      </Button>
      <Button size="sm" variant="secondary" onClick={() => onAction('status')}>
        📊 Show Status
      </Button>
      <Button size="sm" variant="secondary" onClick={() => onAction('reflect on performance')}>
        🧠 Reflect/Evaluate
      </Button>
      <Button size="sm" variant="outline" onClick={() => {
        const goal = prompt("New Goal (describe):");
        if (goal) onAction(`add goal: ${goal}`);
      }}>
        🎯 Add Goal
      </Button>
      <Button size="sm" variant="outline" onClick={() => onAction('Who am I?')}>
        👤 Who am I?
      </Button>
    </div>
  );
};
