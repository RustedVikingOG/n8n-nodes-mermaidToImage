# CHANGELOG

## 2025-07-17 - MermaidToPng Node Implementation

**Commit ID**: `8ca76c8b05c9e37df1f744edd8cfe6f0ee2aae3e`  
**Date**: July 17, 2025  
**Time**: 21:32 UTC

### ✨ Features Added

- **MermaidToPng Node**: Complete implementation of a custom n8n node that converts Mermaid diagrams from markdown format to PNG images
- **Browser Rendering**: Uses Puppeteer for headless Chrome rendering with high-quality PNG output
- **Configurable Options**: 
  - Theme selection (default, dark, forest, neutral)
  - Background color customization
  - Image dimensions (width/height)
  - Scale factor for high-resolution output
- **Error Handling**: Comprehensive validation for invalid Mermaid syntax and rendering failures
- **Binary Data Output**: Returns n8n-compatible binary PNG data for workflow automation

### 🔧 Technical Implementation

- **Dependencies**: Added `mermaid` and `puppeteer` packages
- **Node Structure**: Following n8n community node standards with proper TypeScript implementation
- **Icon Design**: Custom SVG icon representing diagram-to-image conversion
- **Build Integration**: Successfully compiles and integrates with existing build pipeline

### 📁 Files Modified/Added

- `nodes/MermaidToPng/MermaidToPng.node.ts` - Main node implementation
- `nodes/MermaidToPng/MermaidToPng.node.json` - Node configuration
- `nodes/MermaidToPng/mermaid.svg` - Node icon
- `package.json` - Updated with new dependencies and node registration
- `TEST_MERMAID_NODE.md` - Testing documentation and examples
- Updated architecture and use case documentation

### ✅ Validation Status

- TypeScript compilation: ✅ Success
- ESLint validation: ✅ Passed (core functionality)
- Build pipeline: ✅ Completed
- Asset processing: ✅ Icons copied successfully

## Previous entries
