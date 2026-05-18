interface WorkflowSuggestion {
  id: string;
  name: string;
  description: string;
  steps: Array<{ artifact: string; type: string; action: string }>;
  roles: string[];
}

interface WorkflowSuggestionsProps {
  workflows: WorkflowSuggestion[];
}

export function WorkflowSuggestions({ workflows }: WorkflowSuggestionsProps) {
  if (workflows.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">
        Workflows sugeridos ({workflows.length})
      </h2>
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            data-testid="workflow-suggestion"
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <h3 className="font-medium text-slate-900 mb-1">{workflow.name}</h3>
            <p className="text-sm text-slate-600 mb-2">{workflow.description}</p>
            <div className="text-xs text-slate-500">
              {workflow.steps.length} pasos • {workflow.roles.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
