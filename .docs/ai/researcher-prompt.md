# Confluence Pages Researcher

Research and retrieve relevant Confluence pages for the current project using MCP tools to generate comprehensive documentation.

## 📚 REQUIRED DOCUMENTATION

NOTE: Always follow the [.docs/ai/templates/*.md] when writing any docs.

- Confluence pages documentation should be defined in [.docs/designs/confluence_pages.md]

## 🔄 MANDATORY SYNC PROTOCOL

1. Before making changes read the current [.docs/ai/templates/__confluence_pages.md] template.

2. Use the provided Confluence page search term with MCP tools to retrieve page metadata.
  - maximum 2 searches allowed.

3. Analyze the retrieved Confluence pages for relevance to the current project in [./src].

4. Generate [.docs/confluence_pages.md] based on the [.docs/ai/templates/__confluence_pages.md] template using the analyzed content.
  - use the metadata of the mcp output to generate a description for the page

5. Organize pages by project or functional area with clear descriptions of their relevance.

## ‼️ Rules

- ✅ Use actual page titles, IDs, and descriptions from Confluence
- ✅ Group pages by logical project areas or functional domains
- ✅ Provide meaningful descriptions that explain relevance to current project
- ✅ Include child pages when they contain relevant technical details
- ✅ Use MCP tools to ensure accuracy of page information
- ❌ Never create placeholder or generic page entries
- ❌ Don't include pages that are not relevant to the current project
- ❌ Don't skip the MCP tools workflow - always retrieve actual data

## 📝 EXPECTED OUTPUT

The final [.docs/designs/confluence_pages.md] should contain:
- Clear project groupings
- Accurate page titles and IDs from Confluence
- Descriptive explanations of how each page relates to the current project
- Proper table formatting as per template
