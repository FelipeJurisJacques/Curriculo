---
name: Project Structure
description: Provides information about the technical structure, directory layout, and build system of the Curriculo project.
---

# Project Technical Structure

## Overview
This project is a web-based Curriculum Vitae (Resume) application built as a Progressive Web App (PWA). It is architected around a central `engine` which handles compilation and serving, allowing the developer to focus on the `source` and `public` content.

## Directory Layout

### Core Directories

- **`engine/`**: **DO NOT MODIFY.** This directory is a Git submodule from another project. It provides the core build system and runtime environment.
  - **Function**: It is designed to compile the project into a PWA and serve it via localhost.
  - **Role**: Handles the heavy lifting of the build process and abstraction layers.

- **`source/`**: Contains the application's source code (TypeScript/JS) that the `engine` compiles.
  - This is where you write the frontend logic (e.g., `application/index.ts`).

- **`public/`**: The root directory for the web server (Nginx).
  - Anything placed here is served directly.
  - Contains assets like YAML data files (`assets/markups/`), images, and videos.

- **`data/`**: Used by the `engine` as a **cache** directory (and for node_modules).

- **`curriculos/`**: Contains static HTML outputs or specific entry points for the curriculum display.

## Architecture & Build Flow

1.  **Engine**: The `engine` acts as the compiler and server manager. It executes within a Docker container.
2.  **Compilation**: The `engine` compiles code from the `source/` directory.
3.  **Serving**: Nginx (managed by the engine) treats the `public/` directory as its root (`/`).
4.  **Caching**: The `data/` directory allows the engine to persist cache and dependencies (node_modules) across container restarts.

## Key Data Flow
- **Content Source**: `public/assets/markups/felipe.yaml` contains the structured data (Skills, Training, Experiences).
- **Presentation**: `curriculos/curriculo.html` displays this data.
- **Logic**: `source/application/` -> Compiled by Engine -> Served as PWA.

## Build System & Commands (Docker)
The environment runs inside: `engine_progressive_web_application_typescript_container`.

**Key Commands:**
- Install dependencies: `docker exec engine_progressive_web_application_typescript_container npm install`
- Build/Run: `docker exec engine_progressive_web_application_typescript_container npx tsx /workspace/backend/engine/compiler/build.ts`
