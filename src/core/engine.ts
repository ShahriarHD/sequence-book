import path from 'path';
import { readFile } from '../utils/file';

declare type Context = Record<string, any>;

export class TemplateRenderer {
    private content: string;
    private context: Context;

    constructor (template: string, context: Context) {
        this.content = template;
        this.context = context;
    }

    public render(): string {
        return this
            .renderIncludes()
            .renderUse()
            .injectContext()
            .content;
    }

    private renderIncludes(): TemplateRenderer {
        const templatesDir = 'src/templates/';
        const includeRegex = /@include\s+(?<name>\w+)/g;
        this.content = this.content.replace(
            includeRegex,
            /**
             * @param {any} _
             * @param {string} name
             * @returns {string}
             */
            (_, name) => {
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
            /**
             * @param {any} _
             * @param {string} name
             * @returns {string}
             */
            (_, name) => {
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
}
