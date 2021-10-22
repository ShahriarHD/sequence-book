import path from 'path';
import { CONTENT_DIR, TEMPLATE_DIR } from '../utils/constant';
import { readFile, writeFile } from '../utils/file';
import { TemplateRenderer } from './engine';
import { renderMarkdown } from './markdown';
import { LinkDetails } from './types';

const STEP_TEMPLATE_PATH = path.join(TEMPLATE_DIR, 'step.html');
const STEP_TEMPLATE = readFile(STEP_TEMPLATE_PATH);

const TOC_TEMPLATE_PATH = path.join(TEMPLATE_DIR, 'toc.html');
const TOC_TEMPLATE = readFile(TOC_TEMPLATE_PATH);

export function renderStepToHTML(title: string, step: string) {
    if (!step.endsWith('.md')) {
        step = `${step}.md`;
    }

    const contentPath = path.join(CONTENT_DIR, step);
    const contentMarkdown = readFile(contentPath);

    const stepHTML = renderMarkdown(contentMarkdown);

    const renderer = new TemplateRenderer(STEP_TEMPLATE, { title, content: stepHTML });

    return renderer.render();
}

export function renderTableOfContents(title: string, links: LinkDetails[]) {
    const renderer = new TemplateRenderer(TOC_TEMPLATE, { title, links });

    return renderer.render();
}