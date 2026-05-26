import { Component } from '@angular/core';
import { GraphService } from '../../services/graph.service';
import { NodeType } from '../../models/graph.model';

@Component({
  selector: 'app-node-palette',
  templateUrl: './node-palette.component.html',
  styleUrls: ['./node-palette.component.css']
})
export class NodePaletteComponent {
  nodeTypes: Array<{ type: NodeType; title: string; subtitle: string; icon: string }> = [
    { type: 'start', title: 'Start', subtitle: 'Entry point', icon: 'play_arrow' },
    { type: 'end', title: 'End', subtitle: 'Exit point', icon: 'stop' },
    { type: 'llm', title: 'LLM', subtitle: 'Language model call', icon: 'smart_toy' },
    { type: 'api', title: 'API', subtitle: 'External API call', icon: 'api' },
    { type: 'conditional', title: 'Conditional', subtitle: 'Branch decision', icon: 'device_hub' }
  ];

  constructor(private graphService: GraphService) {}

  onDragStart(event: DragEvent, type: NodeType): void {
    event.dataTransfer?.setData('application/node-type', type);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  addNode(type: NodeType): void {
    this.graphService.addNode(type, 80, 80);
  }
}
