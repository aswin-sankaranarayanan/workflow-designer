import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GraphService } from '../../services/graph.service';
import { WorkflowNode } from '../../models/graph.model';

@Component({
  selector: 'app-node-properties',
  templateUrl: './node-properties.component.html',
  styleUrls: ['./node-properties.component.css']
})
export class NodePropertiesComponent implements OnInit, OnDestroy {
  selectedNode: WorkflowNode | null = null;
  nodeForm = new FormGroup({
    label: new FormControl(''),
    description: new FormControl(''),
    llmPrompt: new FormControl(''),
    apiUrl: new FormControl(''),
    apiMethod: new FormControl('GET'),
    apiHeaders: new FormControl(''),
    apiBody: new FormControl(''),
    conditionExpression: new FormControl('')
  });

  private subscription = new Subscription();

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.subscription.add(this.graphService.selectedNode$.subscribe(node => {
      this.selectedNode = node;
      this.loadForm(node);
    }));

    this.subscription.add(this.nodeForm.valueChanges.subscribe(() => this.saveForm()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadForm(node: WorkflowNode | null): void {
    if (!node) {
      this.nodeForm.reset({ apiMethod: 'GET' }, { emitEvent: false });
      return;
    }

    this.nodeForm.setValue({
      label: node.label,
      description: node.meta.description || '',
      llmPrompt: node.meta.llmPrompt || '',
      apiUrl: node.meta.apiUrl || '',
      apiMethod: node.meta.apiMethod || 'GET',
      apiHeaders: node.meta.apiHeaders || '',
      apiBody: node.meta.apiBody || '',
      conditionExpression: node.meta.conditionExpression || ''
    }, { emitEvent: false });
  }

  saveForm(): void {
    if (!this.selectedNode) {
      return;
    }

    const updated: WorkflowNode = {
      ...this.selectedNode,
      label: this.nodeForm.controls.label.value || this.selectedNode.label,
      meta: {
        ...this.selectedNode.meta,
        description: this.nodeForm.controls.description.value || '',
        llmPrompt: this.nodeForm.controls.llmPrompt.value || '',
        apiUrl: this.nodeForm.controls.apiUrl.value || '',
        apiMethod: (this.nodeForm.controls.apiMethod.value as any) || 'GET',
        apiHeaders: this.nodeForm.controls.apiHeaders.value || '',
        apiBody: this.nodeForm.controls.apiBody.value || '',
        conditionExpression: this.nodeForm.controls.conditionExpression.value || ''
      }
    };

    this.graphService.updateNode(updated);
  }

  deleteNode(): void {
    if (!this.selectedNode) {
      return;
    }
    this.graphService.removeNode(this.selectedNode.id);
  }
}
