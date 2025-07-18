import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import * as puppeteer from 'puppeteer';

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

				if (!cleanMermaidCode) {
					throw new NodeOperationError(
						this.getNode(),
						'Empty Mermaid diagram code',
						{ itemIndex: i },
					);
				}

				// Launch Puppeteer browser
				const browser = await puppeteer.launch({
					headless: true,
					args: ['--no-sandbox', '--disable-setuid-sandbox'],
				});

				try {
					const page = await browser.newPage();

					// Set viewport size
					await page.setViewport({
						width: Math.ceil(width * scale),
						height: Math.ceil(height * scale),
						deviceScaleFactor: scale,
					});

					// Create HTML with Mermaid
					const html = `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: ${backgroundColor};
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        #diagram {
            background-color: ${backgroundColor};
        }
    </style>
</head>
<body>
    <div id="diagram">${cleanMermaidCode}</div>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: '${theme}',
            background: '${backgroundColor}',
            themeVariables: {
                background: '${backgroundColor}',
                primaryColor: '${backgroundColor}'
            }
        });
    </script>
</body>
</html>`;

					await page.setContent(html);

					// Wait for Mermaid to render
					await page.waitForSelector('svg', { timeout: 10000 });

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
							theme: theme,
							backgroundColor: backgroundColor,
						},
						binary: {
							[binaryPropertyName]: binaryData,
						},
					});

				} finally {
					await browser.close();
				}

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
