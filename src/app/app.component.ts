import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphService } from './services/graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LangGraph Workflow Designer';
  graphJson = '';

  constructor(public graphService: GraphService, private snackBar: MatSnackBar) {}

  exportGraph(): void {
    this.graphJson = JSON.stringify(this.graphService.exportGraph(), null, 2);
    this.snackBar.open('Graph exported to JSON', 'Close', { duration: 1800 });
  }

  loadGraph(): void {
    try {
      const graph = JSON.parse(this.graphJson || '');
      if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
        throw new Error('Graph JSON must include nodes and edges arrays');
      }
      this.graphService.importGraph(graph);
      this.snackBar.open('Graph imported successfully', 'Close', { duration: 1800 });
    } catch (error) {
      this.snackBar.open('Invalid JSON payload', 'Close', { duration: 2800 });
    }
  }
}
