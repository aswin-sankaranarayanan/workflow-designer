import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GraphService } from '../../services/graph.service';
import { NodeType, WorkflowEdge, WorkflowNode } from '../../models/graph.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  nodes: WorkflowNode[] = [];
  edges: WorkflowEdge[] = [];
  selectedNodeId: string | null = null;
  connectingSource: string | null = null;
  draggingNodeId: string | null = null;
  private subscription = new Subscription();
  private dragUpdateSubject = new Subject<{ nodeId: string; x: number; y: number }>();

  constructor(private graphService: GraphService) {
    // Debounce drag updates to reduce excessive updates and improve smoothness
    this.subscription.add(
      this.dragUpdateSubject
        .pipe(debounceTime(8))
        .subscribe(({ nodeId, x, y }) => {
          const node = this.nodes.find(n => n.id === nodeId);
          if (node) {
            this.graphService.updateNode({ ...node, x, y });
          }
        })
    );
  }

  ngOnInit(): void {
    this.subscription.add(this.graphService.nodes$.subscribe(nodes => this.nodes = nodes));
    this.subscription.add(this.graphService.edges$.subscribe(edges => this.edges = edges));
    this.subscription.add(this.graphService.selectedNode$.subscribe(selected => this.selectedNodeId = selected?.id ?? null));
    this.subscription.add(this.graphService.connectingSource$.subscribe(active => this.connectingSource = active));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const type = event.dataTransfer?.getData('application/node-type');
    if (type) {
      const canvas = event.currentTarget as HTMLElement;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - 80;
      const y = event.clientY - rect.top - 24;
      this.graphService.addNode(type as NodeType, x, y);
    }
  }

  onDragStart(event: CdkDragStart, node: WorkflowNode): void {
    this.draggingNodeId = node.id;
  }

  onDragEnd(event: CdkDragEnd, node: WorkflowNode): void {
    const dragPos = event.source.getFreeDragPosition();
    const newX = Math.round(node.x + dragPos.x);
    const newY = Math.round(node.y + dragPos.y);

    // Final update with snapping to grid (8px)
    const gridSize = 8;
    const snappedX = Math.round(newX / gridSize) * gridSize;
    const snappedY = Math.round(newY / gridSize) * gridSize;

    this.graphService.updateNode({ ...node, x: snappedX, y: snappedY });
    this.draggingNodeId = null;

    // reset the transform applied by cdkDrag so the element's left/top reflect the new coordinates
    try {
      event.source.reset();
    } catch (e) {
      // ignore if reset is not available for some CDK versions
    }
  }

  selectNode(node: WorkflowNode): void {
    this.graphService.selectNode(node.id);
  }

  toggleConnection(node: WorkflowNode, event: MouseEvent): void {
    event.stopPropagation();
    if (this.connectingSource === node.id) {
      this.graphService.cancelConnection();
      return;
    }

    if (this.connectingSource) {
      this.graphService.connectTo(node.id);
      return;
    }

    this.graphService.startConnection(node.id);
  }

  edgeCoords(edge: WorkflowEdge): { x1: number; y1: number; x2: number; y2: number } {
    const source = this.nodes.find(node => node.id === edge.source);
    const target = this.nodes.find(node => node.id === edge.target);
    if (!source || !target) {
      return { x1: 0, y1: 0, x2: 0, y2: 0 };
    }

    // Node dimensions: width=180px, min-height=100px
    const nodeWidth = 180;
    const nodeHeight = 100;

    return {
      x1: source.x + nodeWidth / 2,  // Bottom middle of source node
      y1: source.y + nodeHeight,
      x2: target.x + nodeWidth / 2,  // Top middle of target node
      y2: target.y
    };
  }
}
