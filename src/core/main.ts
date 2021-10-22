import YAML from 'yaml';
import path from 'path';
import { renderMarkdown } from './markdown';
import { readFile } from '../utils/file';
import { TemplateRenderer } from './engine';
import { existsSync } from 'fs';

interface Config {
    sequences: Sequence[];
}

interface Sequence {
    title: string;
    steps: string[];
}

const CONTENT_DIR = 'content/';
const OUTPUT_DIR = 'build/';

function renderStepToHTML(title: string, step: string) {
    const contentPath = path.join(CONTENT_DIR, step);
    const contentMarkdown = readFile(contentPath);

    const contentHTML = renderMarkdown(contentMarkdown);

    const renderer = new TemplateRenderer(contentHTML, { title });
}

function buildSequences() {
    try {
        if (existsSync(OUTPUT_DIR)) {
            // TODO: rm rf
        }

        const CONFIG_PATH = path.join(CONTENT_DIR, 'sequences.yaml');

        const configContent = readFile(CONFIG_PATH);
        const config: Config = YAML.parse(configContent);

        for (const seq of config.sequences) {
            for (let i = 0; i < seq.steps.length; i++) {
                const step = seq.steps[i];
                const title = `${seq.title} - Step ${i + 1}`
                renderStepToHTML(title, step);
            }
        }
    } catch (error) {
        console.error('You lied to me.', error);
    }
}

buildSequences();
