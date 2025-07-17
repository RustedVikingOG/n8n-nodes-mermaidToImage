# COLLABORATION GUIDE: Firebase App Project

## Overview

//description of the project and it's main usecases.

---

## Project Structure & Responsibilities

//project tree showing relative path to configs, code and other files.

```
/ (root)
├── .env.dev - //description of the config
├── dev.config1.yml - the development config 1... // description here
├── src/ - Next.js application code (frontend UI, pages, components, hooks, and utilities).
│   ├── package.json, tsconfig.json
├── ./functions/
│   ├── package.json, tsconfig.json
```

example:
```
/ (root)
├── ./firebase.json Firebase configuration files for hosting, Firestore, storage, CORS, and security rules which references the firestore.rules, firestore.indexes, storage.rules, etc.
├── ./firestore.rules
├── ./firestore.indexes.json
├── ./storage.rules
├── ./cors-config.json
│
├── ./package.json, tsconfig.json, tailwind.config.ts
│   - Next.js app dependencies, TypeScript, and Tailwind CSS configuration.
├── src/
│   - Next.js application code (frontend UI, pages, components, hooks, and utilities).
├── ./functions/
│   ├── package.json, tsconfig.json
│   └── src/
│       - TypeScript backend API code for Firebase Cloud Functions.
├── ./components/
│   - Shared React components for UI, order management, store, templates, etc.
├── ./docs/
│   - Project documentation (including this file).
└── ./scripts/
    - Admin and utility scripts for project setup and management.
```

---

## Key Technologies

- **[Technology Name]**: //description of use within this project
i.e.
- **Next.js**: React-based framework for server-side rendering, routing, and static site generation.
- **Firebase**: Backend-as-a-Service for authentication, Firestore database, serverless functions, and hosting.
- **TypeScript**: Strongly-typed JavaScript for both frontend and backend code.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and theming.

---

## Project Details: File & Directory Responsibilities

### Frontend (Next.js)

**Project Structure**
- `src/`: Main application code (i.e. pages, layouts, API routes, hooks, and utilities).
- `components/`: Reusable components (i.e. UI, order, store, templates, etc.).
- `package.json`: Dependencies and scripts for the Next.js app.
- `tailwind.config.ts`: Tailwind CSS configuration (i.e. dark mode, plugins).

### Backend (Firebase Functions)

**Project Structure**
- `functions/src/`: TypeScript source code for backend APIs (Cloud Functions).
- `functions/package.json`: Dependencies and scripts for backend functions.

### Utilities, Documentation & Scripts

**Project Structure**
- `docs/`: Project documentation and blueprints.
- `scripts/`: Admin and setup scripts (e.g., initial admin setup).

## Tools

A list of tools required for this project to be run an debugged.

### Tool: [Tool name]

**Requirements**
provide a list of requirements to use this tool.

**Configurations [Tool name]**
Provide list of configuration files for the [Tool name].
- `[./path/to/config]`: description of config and what it maintains
- `[./path/to/config]`: description of config and what it maintains

### Tool: [Tool name]

**Requirements**
provide a list of requirements to use this tool.

**Configurations [Tool name]**
Provide list of configuration files for the [Tool name].
- `[./path/to/config]`: description of config and what it maintains
- `[./path/to/config]`: description of config and what it maintains

## Setup & Development

### Prerequisites

- docker cli and rancher
- // add more tools and pre-requisitives here

### Install Dependencies

```sh
// add details here
```


## Build & Deployment

### Build

// add details and commands for building the projects in this codebase

example:
- Frontend: `npm run build` (Next.js static build)
- Backend: `cd functions && npm run build`

### Deploy

Deploy  for projects in this codebase.

```sh
// add details here
```

## Debugging

Provides a set of stategies for debugging projects in this codebase.

**Debugging Strategy: Build error recovery**

```sh
// add details here
```

**DEBUGGING: GOTCHAs AND RECOVERY**

A list of tips and tricks for detailing with debugging gotchas.
NOTE: !! do not change this.

- The ERROR: "Unexpected eof" (end of file) | Can typically mean there is a missing or extra bracket/parenthesis. However, can be some times caused by mis-aligned quote types (i.e. opening quote: \' while closing quote '") or additionally by missing tags. Please rewrite the given file to fix the error even if it looks correct. Mistakes happen.
- // add more tips here

## Git Commit Best 

The require git commit policies to follow.
NOTE: !! do not change this.

**Git Commands**

- Use the `git status` command to get a clear view of what you are updating.
- Add and commit your changes with a helpful message using `git add -A && git commit -m '[HELPFUL COMMIT MESSAGE HERE]'`

**Basic Rules**
- Git commits should be a wrapper for related changes. For example, fixing two different bugs should produce two separate commits. 
- Commit Often to keep your commits small to enable better reporting on changes and git history management.
- Don't Commit Half-Done Work, only commit code when a logical component is completed. Split a feature‘s implementation into logical chunks that can be completed quickly so that you can commit often.
- Test Your Code Before You Commit. Follow the Debugging Strategies.
Resist the temptation to commit something that you «think» is completed. Test it thoroughly by making sure the code builds.
- Write clear and Good Commit Messages and keep [.docs/CHANGELOG.md] is up to date. Begin your message with a short summary of your changes (up to 50 characters as a guideline). Separate it from the following body by including a blank line. The body of your message should provide detailed answers to the following questions: – What was the motivation for the change? – How does it differ from the previous implementation? Use the imperative, present tense («change», not «changed» or «changes») to be consistent with generated messages from commands like git merge.


## Collaboration Tips

A summarization of the Collaboration tips and tricks.
NOTE: !! do not change this.

- Keep frontend and backend code separated for clarity.
- Use clear commit messages and PR descriptions.
- Document new components, APIs, and scripts in the `.docs/` folder.
- Update this guide as the project evolves.

## 🔬📚 Research

Find all the research docs related to this project in the directory [./.docs/research/].

NOTE: !! do not change this.

**‼️ Rules**

- ✅ Always provide link or path reference to resources used from this Research. Use Oxford Academic citing style, both inline and as a footnote.
- ✅ Always prefer research notes and documentation provided here over your own knowledge.

**📝 Notes**

A set of notes, as markdown files of research relating to topics relavent to this project can be found in [./.docs/research/note-*.md]. Reference these to inform implementations related this this project.

**🌐 Confluence Page documents**

Contains a list of relevant [./.docs/research/confluence_pages.md] researched in this project following the template [./.docs/ai/templates/__confluence_pages.md].

**🌐 Web link documents**

Contains a list of relevant [./.docs/research/web_links.md] researched in this project following the template [./.docs/ai/templates/__web_links.md].

