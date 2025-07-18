import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError, ApplicationError } from 'n8n-workflow';
import * as puppeteer from 'puppeteer';

// Security: Define allowed themes to prevent code injection
const ALLOWED_THEMES = ['default', 'dark', 'forest', 'neutral'] as const;
type AllowedTheme = typeof ALLOWED_THEMES[number];

// Security: HTML entity encoding function to prevent XSS
function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

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
				displayName: 'Rendering Timeout (Seconds)',
				name: 'timeout',
				type: 'number',
				default: 10,
				description: 'Maximum time to wait for diagram rendering (3-60 seconds)',
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
			let browser: puppeteer.Browser | null = null;

			try {
				const mermaidCode = this.getNodeParameter('mermaidCode', i) as string;
				const theme = this.getNodeParameter('theme', i) as string;
				const backgroundColor = this.getNodeParameter('backgroundColor', i) as string;
				const width = this.getNodeParameter('width', i) as number;
				const height = this.getNodeParameter('height', i) as number;
				const scale = this.getNodeParameter('scale', i) as number;
				const timeout = this.getNodeParameter('timeout', i) as number;

				// Security: Validate and sanitize inputs
				validateMermaidInput(mermaidCode);
				const validatedTheme = validateTheme(theme);
				const timeoutMs = Math.max(3000, Math.min(60000, timeout * 1000)); // Ensure timeout is between 3-60 seconds

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

				// Security: Launch Puppeteer browser with improved security settings
				// Note: --no-sandbox is used conditionally for containerized environments
				// In production, consider removing this flag if possible
				const isContainerized = process.env.NODE_ENV === 'production' || process.env.CONTAINER === 'true';
				const browserArgs = isContainerized
					? ['--no-sandbox', '--disable-setuid-sandbox'] // For containerized environments
					: ['--disable-setuid-sandbox']; // More secure for non-containerized

				browser = await puppeteer.launch({
					headless: true,
					args: browserArgs,
				});

				try {
					const page = await browser.newPage();

					// Set viewport size
					await page.setViewport({
						width: Math.ceil(width * scale),
						height: Math.ceil(height * scale),
						deviceScaleFactor: scale,
					});

					// Security: Sanitize only CSS values, not Mermaid code content
					const sanitizedBackgroundColor = escapeHtml(backgroundColor);

					// Use local Mermaid library via page.evaluate to avoid external CDN
					const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: ${sanitizedBackgroundColor};
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        #diagram {
            background-color: ${sanitizedBackgroundColor};
        }
    </style>
</head>
<body>
    <div id="diagram">${cleanMermaidCode}</div>
</body>
</html>`;

					await page.setContent(html);

					// Use server-side Mermaid rendering to avoid external CDN dependency
					const mermaidModule = await import('mermaid');
					
					// Configure Mermaid on the server side
					mermaidModule.default.initialize({
						theme: validatedTheme,
						themeVariables: {
							background: backgroundColor,
							primaryColor: backgroundColor
						}
					});

					// Render Mermaid diagram on server side and inject SVG
					const { svg } = await mermaidModule.default.render('mermaid-diagram', cleanMermaidCode);
					
					// Inject the rendered SVG into the page
					await page.evaluate(`
						(function(svgContent, bgColor) {
							const diagramDiv = document.getElementById('diagram');
							if (diagramDiv) {
								diagramDiv.innerHTML = arguments[0];
								const svgElement = diagramDiv.querySelector('svg');
								if (svgElement) {
									svgElement.style.backgroundColor = arguments[1];
								}
							}
						})('${svg.replace(/'/g, "\\'")}', '${backgroundColor}');
					`);

					// Wait a moment for the SVG to be fully rendered in the DOM
					await page.waitForSelector('#diagram svg', { timeout: timeoutMs });

					// Take screenshot of the diagram
					const diagramElement = await page.$('#diagram svg');
					if (!diagramElement) {
						throw new NodeOperationError(
							this.getNode(),
							'Failed to render Mermaid diagram',
							{ itemIndex: i },
						);
					}

					const imageBuffer = await diagramElement.screenshot({
						type: 'png',
						omitBackground: backgroundColor === 'transparent',
					});

					// Create binary data for n8n
					const binaryPropertyName = 'data';
					const binaryData = await this.helpers.prepareBinaryData(
						Buffer.from(imageBuffer),
						`mermaid-diagram-${i}.png`,
						'image/png',
					);

					returnData.push({
						json: {
							success: true,
							filename: `mermaid-diagram-${i}.png`,
							width: width,
							height: height,
							scale: scale,
							theme: validatedTheme,
							backgroundColor: backgroundColor,
							renderingTimeoutUsed: timeoutMs / 1000,
						},
						binary: {
							[binaryPropertyName]: binaryData,
						},
					});

				} finally {
					// Security: Ensure browser cleanup even if page operations fail
					if (browser) {
						await browser.close();
						browser = null;
					}
				}

			} catch (error) {
				// Security: Ensure browser cleanup in error scenarios
				if (browser) {
					try {
						await browser.close();
					} catch (cleanupError) {
						// Log cleanup error but don't throw
						console.warn('Browser cleanup error:', cleanupError);
					}
				}

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
