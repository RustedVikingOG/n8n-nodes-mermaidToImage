# n8n Nodes Starter Architecture

This document contains the architectural design of the n8n nodes starter solution with the focus on the high level components and how they interact. The solution provides a foundational framework for developing custom n8n workflow nodes with TypeScript.

## High-level Component definitions & use

Describes the definitions and use of each component in the design, its technology and the scope of the use of any services.

**System components**

**Node Development Framework**

The core framework that provides the structure and tooling for creating custom n8n nodes. Built on TypeScript with strict typing and modern JavaScript features, this component handles node registration, compilation, and packaging for distribution.

**Core Functionality: Node Development Framework**

- **TypeScript Compilation**: Compiles TypeScript source files to JavaScript with ES2019 target and strict type checking
- **Asset Processing**: Copies node icons and static assets from source to distribution directory via Gulp build tasks
- **Package Registration**: Registers compiled nodes and credentials with n8n through package.json configuration
- **Development Server**: Provides watch mode for real-time compilation during development

**Architecture Diagram of component: Node Development Framework**

```mermaid
---
title: n8n Node Development Framework Architecture
---
flowchart TD
    "Source Code" --> "TypeScript Compiler"
    "TypeScript Compiler" --> "Compiled JavaScript"
    "Icon Assets" --> "Gulp Build Tasks"
    "Gulp Build Tasks" --> "Processed Assets"
    "Compiled JavaScript" --> "Distribution Directory"
    "Processed Assets" --> "Distribution Directory"
    "Distribution Directory" --> "npm Package"
    "npm Package" --> "n8n Node Registry"
```

**Node Implementation System**

Individual node implementations that define workflow automation capabilities. Each node implements the INodeType interface and provides specific functionality for workflow automation, including data transformation, API interactions, and custom business logic.

**Core Functionality: Node Implementation System**

- **Data Processing**: Processes input data through configurable parameters and returns transformed output
- **Parameter Validation**: Validates user-provided parameters and handles type conversion
- **Error Handling**: Implements comprehensive error handling with continue-on-fail functionality
- **API Integration**: Provides HTTP request capabilities with authentication and routing configuration

**Architecture Diagram of component: Node Implementation System**

```mermaid
---
title: Node Implementation System Architecture
---
flowchart TD
    "n8n Workflow Engine" --> "Node Input Data"
    "Node Input Data" --> "Parameter Processing"
    "Parameter Processing" --> "Business Logic Execution"
    "Business Logic Execution" --> "API Calls"
    "API Calls" --> "Data Transformation"
    "Data Transformation" --> "Output Data"
    "Output Data" --> "n8n Workflow Engine"
    "Error Handler" --> "Continue on Fail Logic"
    "Continue on Fail Logic" --> "Error Output"
```

**Credential Management System**

Authentication and credential handling system that securely manages API keys, tokens, and other authentication data required for external service integrations. Implements n8n's credential interface for secure storage and injection.

**Core Functionality: Credential Management System**

- **Credential Definition**: Defines input fields for various authentication methods (tokens, API keys, domains)
- **Secure Storage**: Encrypts and stores credential data within n8n's credential vault
- **Authentication Injection**: Automatically injects credentials into HTTP requests via headers or other methods
- **Credential Testing**: Validates credential functionality through test API calls

**Architecture Diagram of component: Credential Management System**

```mermaid
---
title: Credential Management System Architecture
---
flowchart TD
    "User Credential Input" --> "Credential Validation"
    "Credential Validation" --> "Encrypted Storage"
    "Encrypted Storage" --> "n8n Credential Vault"
    "Node Execution Request" --> "Credential Retrieval"
    "Credential Retrieval" --> "Authentication Injection"
    "Authentication Injection" --> "HTTP Request Headers"
    "HTTP Request Headers" --> "External API"
    "Credential Test Endpoint" --> "Validation Response"
```

**MermaidToPng Rendering System**

Browser-based diagram rendering system that converts Mermaid markdown syntax into PNG images using headless browser automation. Provides configurable output options for theme, size, and styling while handling complex diagram types and error scenarios.

**Core Functionality: MermaidToPng Rendering System**

- **Markdown Processing**: Extracts Mermaid diagram code from markdown code blocks with validation
- **Browser Automation**: Uses Puppeteer for headless Chrome rendering with configurable viewport settings
- **Diagram Rendering**: Leverages Mermaid.js library for client-side diagram generation and SVG output
- **Image Conversion**: Captures high-quality PNG screenshots with transparency and scaling support
- **Binary Integration**: Converts image buffers to n8n-compatible binary data format for workflow automation

**Architecture Diagram of component: MermaidToPng Rendering System**

```mermaid
---
title: MermaidToPng Rendering System Architecture
---
flowchart TD
    "Mermaid Markdown Input" --> "Code Extraction"
    "Code Extraction" --> "HTML Template Generation"
    "Configuration Parameters" --> "HTML Template Generation"
    "HTML Template Generation" --> "Puppeteer Browser"
    "Mermaid CDN Library" --> "Puppeteer Browser"
    "Puppeteer Browser" --> "SVG Rendering"
    "SVG Rendering" --> "PNG Screenshot"
    "PNG Screenshot" --> "Buffer Processing"
    "Buffer Processing" --> "n8n Binary Data"
    "n8n Binary Data" --> "Workflow Output"
```

**Build and Distribution Pipeline**

Automated build system that compiles source code, processes assets, validates code quality, and prepares packages for distribution to the npm registry for community use.

**Core Functionality: Build and Distribution Pipeline**

- **Code Compilation**: Transforms TypeScript source files into distributable JavaScript modules
- **Quality Assurance**: Runs ESLint with n8n-specific rules to ensure code quality and compliance
- **Asset Processing**: Copies and optimizes icon files and other static assets
- **Package Validation**: Validates package configuration and dependencies before publication

**Architecture Diagram of component: Build and Distribution Pipeline**

```mermaid
---
title: Build and Distribution Pipeline Architecture
---
flowchart TD
    "Source Files" --> "ESLint Validation"
    "ESLint Validation" --> "TypeScript Compilation"
    "TypeScript Compilation" --> "JavaScript Output"
    "Icon Assets" --> "Gulp Processing"
    "Gulp Processing" --> "Optimized Assets"
    "JavaScript Output" --> "Distribution Package"
    "Optimized Assets" --> "Distribution Package"
    "Distribution Package" --> "npm Registry"
    "npm Registry" --> "n8n Community Nodes"
```
