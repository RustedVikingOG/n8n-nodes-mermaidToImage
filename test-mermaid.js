// Simple test to verify Mermaid import works
const { MermaidToPng } = require('./dist/nodes/MermaidToPng/MermaidToPng.node.js');

console.log('✅ MermaidToPng node imported successfully');
console.log('Node name:', new MermaidToPng().description.name);
console.log('Node display name:', new MermaidToPng().description.displayName);

// Test the validation function by importing mermaid
(async () => {
    try {
        const mermaid = await import('mermaid');
        console.log('✅ Mermaid library imported successfully');
        console.log('Mermaid version:', mermaid.default?.version || 'unknown');
    } catch (error) {
        console.error('❌ Failed to import mermaid:', error.message);
    }
})();
