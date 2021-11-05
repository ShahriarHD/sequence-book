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

export function renderStepToHTML(title: string, step: string, seqURL: string, index: number, isLast?: boolean) {
    if (!step.endsWith('.md')) {
        step = `${step}.md`;
    }

    const contentPath = path.join(CONTENT_DIR, step);
    const contentMarkdown = readFile(contentPath);

    const stepHTML = renderMarkdown(contentMarkdown);

    const renderer = new TemplateRenderer(STEP_TEMPLATE, { title, content: stepHTML,
        index,
        nextStepURL: isLast? '#' : path.join(seqURL, `${index + 2}`),
        prevStepURL: index === 0? '#' : path.join(seqURL, `${index}`)
    });

    return renderer.render();
}

export function renderTableOfContents(title: string, links: LinkDetails[], pageContent: string) {

    if (!pageContent.endsWith('.md')) {
        pageContent = `${pageContent}.md`;
    }

    const contentPath = path.join(CONTENT_DIR, pageContent);
    const contentMarkdown = readFile(contentPath);
    const contentHTML = renderMarkdown(contentMarkdown);

    const renderer = new TemplateRenderer(TOC_TEMPLATE, { title, links, content: contentHTML });

    return renderer.render();
}