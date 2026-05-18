/**
 * @file AIBadge Component
 * @description Badge component to show AI assistance type for templates
 */

import { Brain, FileCode2, Terminal, Zap, Bot, Cable } from 'lucide-react';
import type { Template } from '@/data/features/handoffsTemplates';

interface AIBadgeProps {
  type: Template['aiAssist'];
  claudePath?: string;
}

export function AIBadge({ type, claudePath }: AIBadgeProps) {
  if (!type) {
    return null;
  }

  const config = {
    skill: {
      icon: <Brain size={10} />,
      label: 'Skill',
      color: 'bg-violet-100 text-violet-700 border-violet-200',
    },
    rule: {
      icon: <FileCode2 size={10} />,
      label: 'Rule',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    command: {
      icon: <Terminal size={10} />,
      label: 'Command',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    hook: {
      icon: <Zap size={10} />,
      label: 'Hook',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    agent: {
      icon: <Bot size={10} />,
      label: 'Agent',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    mcp: {
      icon: <Cable size={10} />,
      label: 'MCP',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
  };

  const c = config[type];

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[9px] font-semibold ${c.color}`}
      title={claudePath}
    >
      {c.icon} {c.label}
    </span>
  );
}
