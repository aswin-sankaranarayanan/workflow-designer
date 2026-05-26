# Workflow Designer

A modern Angular-based workflow builder designed to model complex process flows with drag-and-drop node composition, conditional branching, LLM and API integrations, and JSON import/export.

## 🚀 Project Overview

This application demonstrates a polished, production-ready workflow design experience built with Angular 14 and Angular Material.

Key capabilities:
- Drag and drop workflow nodes onto a canvas
- Configure node metadata for LLM prompts, API calls, and conditions
- Create directional connections between nodes
- Edit node properties in a live panel
- Export and import graph state as structured JSON
- Reactive state management with RxJS and Angular services

## ✨ Features

- **Node palette** with reusable building blocks: `Start`, `End`, `LLM`, `API`, and `Conditional`
- **Canvas flow editor** with draggable nodes and connection creation
- **Properties panel** for editing node details and serializing workflow intent
- **JSON workflow export/import** for persistence, versioning, and integration
- **Clean Angular architecture** using services, observables, and reactive forms

## 🧩 Technical Highlights

- Built with **Angular 14**
- Uses **Angular Material** for accessible UI components
- Uses **Angular CDK DragDrop** for interactive canvas behavior
- Uses **Reactive Forms** for real-time node metadata editing
- Implements a **shared `GraphService`** to keep canvas, palette, and properties in sync
- Supports **workflow serialization** with a strongly typed graph model

## 📁 What’s inside

- `src/app/components/node-palette/` — node selection and drag source
- `src/app/components/canvas/` — interactive canvas, node layout, and edge rendering
- `src/app/components/node-properties/` — dynamic form-driven node configuration
- `src/app/services/graph.service.ts` — centralized graph state, node lifecycle, and edge management
- `src/app/models/graph.model.ts` — typed workflow graph and node metadata definitions

## 🛠️ Run locally

```bash
npm install
npm start
```

Then open `http://localhost:4200/` in your browser.

## ✅ Why this repo stands out

- Demonstrates end-to-end UI/UX for a workflow design product
- Shows practical use of **Angular Material** and **RxJS observable patterns**
- Highlights ability to model workflows with **LLM, API, and conditional nodes**
- Positioned for hiring managers looking for frontend developers with strong application architecture skills

## 💡 Potential next steps

- Add **persistent storage** via local storage or backend API
- Support **undo/redo** and **multi-selection editing**
- Add **visual edge labels**, **connection validation**, and **node grouping**
- Add **unit/e2e tests** to validate workflow behavior

## 📌 Notes

This repository is a great example of an interactive UX-focused application built with Angular and modern frontend best practices.
