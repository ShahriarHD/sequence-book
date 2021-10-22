import path from 'path';
import { readFile } from '../utils/file';

declare type Context = Record<string, any>;

export class TemplateRenderer {
    private content: string;
    private context: Context;

    constructor(template: string, context: Context) {
        this.content = template;
        this.context = getFlatContext(context);
    }

    public render(): string {
        let previousContent = '';

        while (previousContent !== this.content) {
            previousContent = this.content;

            this
                .renderIncludes()
                .renderUse()
                .injectContext()
                .renderForLoops()
        }

        return this.content;
    }

    private renderIncludes(): TemplateRenderer {
        const templatesDir = 'src/templates/';
        const includeRegex = /@include\s+(?<name>\w+)/g;
        this.content = this.content.replace(
            includeRegex,
            (_: any, name: string) => {
                const fileName = name.endsWith('.html') ? name : `${name}.html`;
                const filePath = path.join(templatesDir, fileName);

                return readFile(filePath);
            }
        );

        return this;
    }

    private renderUse(): TemplateRenderer {
        const componentsDir = 'src/components/';
        const includeRegex = /@use\s+(?<name>\w+)/g;
        this.content = this.content.replace(
            includeRegex,
            (_: any, name: string) => {
                const fileName = name.endsWith('.html') ? name : `${name}.html`;
                const filePath = path.join(componentsDir, fileName);

                return readFile(filePath);
            }
        );

        return this;
    }

    private injectContext(): TemplateRenderer {
        for (const varName of Object.keys(this.context)) {
            const value = this.context[varName];

            const pattern = new RegExp(`\{\{\\s*${varName}\\s*\}\}`, 'g');

            this.content = this.content.replace(pattern, value);
        }

        return this;
    }

    private renderForLoops(): TemplateRenderer {
        for (const varName of Object.keys(this.context)) {
            const value = this.context[varName];

            if (typeof value !== 'object') {
                continue;
            }

            const pattern = new RegExp(`@for ${varName}\\S*(?<body>.*)\\S*@endfor`, 'sg');

            this.content = this.content.replace(
                pattern,
                (_: any, loopBody: string) => {
                    const parts = Object.values(value).map(item => {
                        const loopRenderer = new TemplateRenderer(loopBody, { item });
                        return loopRenderer.render();
                    });

                    return parts.join('');
                }
            );
        }

        return this;
    }
}

function getFlatContext(context: Context, prefix?: string): Context {
    let result = {};
    for (const varName of Object.keys(context)) {
        const name = prefix ? `${prefix}->${varName}` : varName;

        const value = context[varName];

        if (typeof value === 'object') {
            result = {
                ...result,
                ...getFlatContext(value, name)
            };
        }

        result[name] = value;
    }

    return result;
}