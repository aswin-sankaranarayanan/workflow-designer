import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeType, WorkflowEdge, WorkflowGraph, WorkflowNode, WorkflowNodeMeta } from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private nodesSubject = new BehaviorSubject<WorkflowNode[]>([]);
  private edgesSubject = new BehaviorSubject<WorkflowEdge[]>([]);
  private selectedNodeSubject = new BehaviorSubject<WorkflowNode | null>(null);
  private connectingSourceSubject = new BehaviorSubject<string | null>(null);

  nodes$ = this.nodesSubject.asObservable();
  edges$ = this.edgesSubject.asObservable();
  selectedNode$ = this.selectedNodeSubject.asObservable();
  connectingSource$ = this.connectingSourceSubject.asObservable();

  addNode(type: NodeType, x: number, y: number): void {
    const node: WorkflowNode = {
      id: this.nextId(type),
      type,
      label: this.defaultLabel(type),
      x,
      y,
      meta: this.defaultMeta(type)
    };

    const nodes = [...this.nodesSubject.value, node];
    this.nodesSubject.next(nodes);
    this.selectNode(node.id);
  }

  updateNode(node: WorkflowNode): void {
    const nodes = this.nodesSubject.value.map(existing => existing.id === node.id ? node : existing);
    this.nodesSubject.next(nodes);
    if (this.selectedNodeSubject.value?.id === node.id) {
      this.selectedNodeSubject.next(node);
    }
  }

  removeNode(nodeId: string): void {
    const nodes = this.nodesSubject.value.filter(node => node.id !== nodeId);
    const edges = this.edgesSubject.value.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    this.nodesSubject.next(nodes);
    this.edgesSubject.next(edges);

    if (this.selectedNodeSubject.value?.id === nodeId) {
      this.selectNode(null);
    }
  }

  selectNode(nodeId: string | null): void {
    const node = nodeId ? this.nodesSubject.value.find(existing => existing.id === nodeId) ?? null : null;
    this.selectedNodeSubject.next(node);
  }

  startConnection(sourceId: string): void {
    this.connectingSourceSubject.next(sourceId);
  }

  cancelConnection(): void {
    this.connectingSourceSubject.next(null);
  }

  connectTo(targetId: string): void {
    const sourceId = this.connectingSourceSubject.value;
    if (sourceId && sourceId !== targetId) {
      this.createEdge(sourceId, targetId);
    }
    this.cancelConnection();
  }

  exportGraph(): WorkflowGraph {
    return {
      nodes: this.nodesSubject.value.map(node => ({ ...node })),
      edges: this.edgesSubject.value.map(edge => ({ ...edge }))
    };
  }

  importGraph(graph: WorkflowGraph): void {
    this.nodesSubject.next(graph.nodes.map(node => ({ ...node })));
    this.edgesSubject.next(graph.edges.map(edge => ({ ...edge })));
    this.selectNode(null);
    this.cancelConnection();
  }

  private createEdge(sourceId: string, targetId: string): void {
    const existing = this.edgesSubject.value.some(edge => edge.source === sourceId && edge.target === targetId);
    if (!existing) {
      const edge: WorkflowEdge = {
        id: this.nextId('edge'),
        source: sourceId,
        target: targetId
      };
      this.edgesSubject.next([...this.edgesSubject.value, edge]);
    }
  }

  private defaultLabel(type: NodeType): string {
    switch (type) {
      case 'start':
        return 'Start';
      case 'end':
        return 'End';
      case 'llm':
        return 'LLM';
      case 'api':
        return 'API';
      case 'conditional':
        return 'Conditional';
      default:
        return 'Node';
    }
  }

  private defaultMeta(type: NodeType): WorkflowNodeMeta {
    return {
      name: this.defaultLabel(type),
      description: '',
      llmPrompt: '',
      apiUrl: '',
      apiMethod: 'GET',
      apiHeaders: '',
      apiBody: '',
      conditionExpression: ''
    };
  }

  private nextId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
  }
}
