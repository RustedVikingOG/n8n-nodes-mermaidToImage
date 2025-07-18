import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError, ApplicationError } from 'n8n-workflow';
import sharp from 'sharp';
import mermaid from 'mermaid';
import { Buffer } from 'buffer';

// Security: Define allowed themes to prevent code injection
const ALLOWED_THEMES = ['default', 'dark', 'forest', 'neutral'] as const;
type AllowedTheme = typeof ALLOWED_THEMES[number];

// Security: Validate and sanitize theme parameter
function validateTheme(theme: string): AllowedTheme {
	if (ALLOWED_THEMES.includes(theme as AllowedTheme)) {
		return theme as AllowedTheme;
	}
	// Return safe default if invalid theme provided
	return 'default';
}

// Security: Validate Mermaid input length and structure (improved validation)
function validateMermaidInput(input: string): void {
	const MAX_INPUT_LENGTH = 50000; // 50KB limit

	if (!input || input.trim().length === 0) {
		throw new ApplicationError('Mermaid input cannot be empty');
	}

	if (input.length > MAX_INPUT_LENGTH) {
		throw new ApplicationError(`Mermaid input too large. Maximum ${MAX_INPUT_LENGTH} characters allowed`);
	}

	// Improved validation: Check for common Mermaid diagram types and dangerous patterns
	const mermaidPatterns = [
		/^graph\s+(TD|LR|TB|RL|BT)/m,           // Flowchart diagrams
		/^sequenceDiagram/m,                     // Sequence diagrams
		/^classDiagram/m,                        // Class diagrams
		/^stateDiagram(-v2)?/m,                  // State diagrams
		/^erDiagram/m,                           // Entity relationship diagrams
		/^gantt/m,                               // Gantt charts
		/^pie\s+title/m,                         // Pie charts
		/^journey/m,                             // User journey diagrams
		/^gitgraph/m,                            // Git graph diagrams
		/^flowchart\s+(TD|LR|TB|RL|BT)/m,       // Flowchart with explicit keyword
		/^timeline/m,                            // Timeline diagrams
		/^mindmap/m,                             // Mind maps
		/^block-beta/m,                          // Block diagrams
		/^C4Context/m,                           // C4 diagrams
		/^\s*[A-Za-z0-9_]+[\s\-\>]+/m,          // Basic node connections
	];

	// Check if input contains valid Mermaid diagram patterns
	const containsValidMermaid = mermaidPatterns.some(pattern => pattern.test(input));

	if (!containsValidMermaid) {
		// Check for basic node patterns as fallback
		const hasBasicNodePattern = /[A-Za-z0-9_]+\s*[\-\>]+\s*[A-Za-z0-9_]+/.test(input);
		if (!hasBasicNodePattern) {
			throw new ApplicationError('Input does not appear to contain valid Mermaid diagram syntax');
		}
	}

	// Security: Check for potentially dangerous patterns (script injection attempts)
	const dangerousPatterns = [
		/<script/i,
		/javascript:/i,
		/on[a-z]+\s*=/i,
		/eval\s*\(/i,
		/function\s*\(/i,
		/<iframe/i,
		/<object/i,
		/<embed/i,
	];

	const containsDangerousPattern = dangerousPatterns.some(pattern => pattern.test(input));
	if (containsDangerousPattern) {
		throw new ApplicationError('Input contains potentially dangerous content');
	}
}

export class MermaidToPng implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mermaid to PNG',
		name: 'mermaidToPng',
		icon: { light: 'file:mermaid.svg', dark: 'file:mermaid.svg' },
		group: ['transform'],
		version: 1,
		description: 'Convert Mermaid diagrams to PNG images',
		defaults: {
			name: 'Mermaid to PNG',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Mermaid Diagram',
				name: 'mermaidCode',
				type: 'string',
				typeOptions: {
					editor: 'codeNodeEditor',
					editorLanguage: 'markdown',
				},
				default: `\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\``,
				description: 'The Mermaid diagram code in markdown format',
				required: true,
			},
			{
				displayName: 'Theme',
				name: 'theme',
				type: 'options',
				default: 'default',
				options: [
					{
						name: 'Default',
						value: 'default',
					},
					{
						name: 'Dark',
						value: 'dark',
					},
					{
						name: 'Forest',
						value: 'forest',
					},
					{
						name: 'Neutral',
						value: 'neutral',
					},
				],
				description: 'The theme to use for the diagram',
			},
			{
				displayName: 'Background Color',
				name: 'backgroundColor',
				type: 'color',
				default: 'white',
				description: 'Background color for the diagram (CSS color value)',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 800,
				description: 'Width of the output image in pixels',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 600,
				description: 'Height of the output image in pixels',
			},
			{
				displayName: 'Scale',
				name: 'scale',
				type: 'number',
				default: 1,
				description: 'Scale factor for the image (1 = normal, 2 = 2x resolution)',
				typeOptions: {
					minValue: 0.5,
					maxValue: 4,
				},
			},
			{
				displayName: 'PNG Quality',
				name: 'pngQuality',
				type: 'number',
				default: 90,
				description: 'PNG compression quality (1-100, higher = better quality, larger file)',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'DPI/Resolution',
				name: 'dpi',
				type: 'options',
				default: 150,
				description: 'Output resolution in DPI for print quality',
				options: [
					{ name: 'Web Quality (72 DPI)', value: 72 },
					{ name: 'Standard Print (150 DPI)', value: 150 },
					{ name: 'High Print (300 DPI)', value: 300 },
					{ name: 'Custom', value: 'custom' },
				],
			},
			{
				displayName: 'Custom DPI',
				name: 'customDpi',
				type: 'number',
				default: 150,
				description: 'Custom DPI value when Custom is selected',
				displayOptions: {
					show: {
						dpi: ['custom'],
					},
				},
				typeOptions: {
					minValue: 72,
					maxValue: 600,
				},
			},
			{
				displayName: 'Rendering Timeout (Seconds)',
				name: 'timeout',
				type: 'number',
				default: 10,
				description: 'Timeout setting for diagram rendering (configurable for future enhancement)',
				typeOptions: {
					minValue: 3,
					maxValue: 60,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const mermaidCode = this.getNodeParameter('mermaidCode', i) as string;
				const theme = this.getNodeParameter('theme', i) as string;
				const backgroundColor = this.getNodeParameter('backgroundColor', i) as string;
				const width = this.getNodeParameter('width', i) as number;
				const height = this.getNodeParameter('height', i) as number;
				const scale = this.getNodeParameter('scale', i) as number;
				const pngQuality = this.getNodeParameter('pngQuality', i) as number;
				const dpiOption = this.getNodeParameter('dpi', i) as number | string;
				const customDpi = this.getNodeParameter('customDpi', i) as number;
				const timeout = this.getNodeParameter('timeout', i) as number;

				// Calculate final DPI value
				const dpiValue = dpiOption === 'custom' ? customDpi : (dpiOption as number);

				// Security: Validate and sanitize inputs
				validateMermaidInput(mermaidCode);
				const validatedTheme = validateTheme(theme);
				const timeoutMs = Math.max(3000, Math.min(60000, timeout * 1000)); // Ensure timeout is between 3-60 seconds

				// Note: Timeout is validated and configured but not yet implemented in mermaid.render()
				// The Mermaid library's render() method is typically fast and doesn't support timeout natively
				// This parameter is available for future enhancement when timeout support is needed

				// Extract mermaid code from markdown code blocks
				const mermaidMatch = mermaidCode.match(/```mermaid\s*([\s\S]*?)\s*```/);
				if (!mermaidMatch) {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid Mermaid markdown format. Expected \`\`\`mermaid ... \`\`\` code block.`,
						{ itemIndex: i },
					);
				}

				const cleanMermaidCode = mermaidMatch[1].trim();

				// Security: Additional validation on extracted code
				validateMermaidInput(cleanMermaidCode);

				if (!cleanMermaidCode) {
					throw new NodeOperationError(
						this.getNode(),
						'Empty Mermaid diagram code',
						{ itemIndex: i },
					);
				}

				// Initialize Mermaid with theme configuration
				mermaid.initialize({
					theme: validatedTheme,
					themeVariables: {
						background: backgroundColor,
						primaryColor: backgroundColor === 'transparent' ? '#ffffff' : backgroundColor
					},
					startOnLoad: false,
					securityLevel: 'strict'
				});

			// Generate SVG from Mermaid code
			// Note: Timeout parameter is available for future enhancement when needed
			const diagramId = `mermaid-diagram-${i}-${Date.now()}`;
			const { svg } = await mermaid.render(diagramId, cleanMermaidCode);

			if (!svg) {
				throw new NodeOperationError(
					this.getNode(),
					'Failed to generate SVG from Mermaid diagram',
					{ itemIndex: i },
				);
			}				// Configure Sharp for SVG to PNG conversion
				const finalWidth = Math.ceil(width * scale);
				const finalHeight = Math.ceil(height * scale);

				// Create Sharp pipeline for SVG to PNG conversion
				let sharpPipeline = sharp(Buffer.from(svg))
					.resize(finalWidth, finalHeight, {
						fit: 'contain',
						background: backgroundColor === 'transparent'
							? { r: 0, g: 0, b: 0, alpha: 0 }
							: backgroundColor
					});

				// Configure PNG output with quality and DPI
				const pngOptions: sharp.PngOptions = {
					quality: Math.max(1, Math.min(100, pngQuality)),
					compressionLevel: 6, // Balanced compression
					palette: false, // Use full color depth
				};

				// Convert to PNG with metadata
				const pngBuffer = await sharpPipeline
					.png(pngOptions)
					.withMetadata({
						density: dpiValue
					})
					.toBuffer();

				// Create binary data for n8n
				const binaryPropertyName = 'data';
				const binaryData = await this.helpers.prepareBinaryData(
					pngBuffer,
					`mermaid-diagram-${i}.png`,
					'image/png',
				);

				returnData.push({
					json: {
						success: true,
						filename: `mermaid-diagram-${i}.png`,
						width: finalWidth,
						height: finalHeight,
						scale: scale,
						theme: validatedTheme,
						backgroundColor: backgroundColor,
						pngQuality: pngQuality,
						dpi: dpiValue,
						conversionMethod: 'sharp',
						timeoutConfigured: timeoutMs / 1000, // Configured timeout (for future use)
					},
					binary: {
						[binaryPropertyName]: binaryData,
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: error.message,
							errorType: error.constructor.name,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
