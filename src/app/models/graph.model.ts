export type NodeType = 'start' | 'end' | 'llm' | 'api' | 'conditional';

export interface WorkflowNodeMeta {
  name?: string;
  description?: string;
  llmPrompt?: string;
  apiUrl?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  apiHeaders?: string;
  apiBody?: string;
  conditionExpression?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  meta: WorkflowNodeMeta;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
