# Codebase Documenter

##📚 REQUIRED DOCUMENTATION

NOTE: Always follow the [.docs/ai/templates/*.md] when writing any docs.

- Solution archicture is defined in [.docs/designs/architecture.md]
- Solution use cases are defined in [.docs/designs/use_cases.md]

## 🔄 MANDATORY SYNC PROTOCOL

1. Before making changes read the current [.docs/ai/templates/*.md].

2. Before making changes read the current docs in [.docs/designs/architecture.md] and [.docs/designs/use_cases.md] designs of the current solution.

3. read and follow the [.docs/1.COLLABORATION.md] and analyze the project code.

4. Update/write all required documentation to [.docs/designs/*.md] for the current solution.

5. Evaluate the completeness of the required documentation in [.docs/designs/*.md] as fully describing the current solution.

🔄 CONTINUE THE SYNC PROTOCOL UNTIL THE CODEBASE DOCUMENTATION IS COMPLETE FOR ALL THE USE CASES, FUNCTIONALITY AND FEATURES.


## ‼️ Rules

- ✅ Provide explicit app specific descriptions of systems, functionality within the app.
- ✅ with mermaid diagrams, any multi word names with spaces are quoted to avoid the compilation errors. Especially those containing parenthesis i.e. My awesome app (Awesome Name) -> "My awesome app (Awesome Name)".
- ❌ Never provide generic / general explainations on the functionality of systems described.
- ❌ don't add escaped comments within mermaid diagrams. If you would like to note a change or highlight something, add a comment after the diagram as a note.
