import fs from 'fs';
import path from 'path';
import { renderStepToHTML, renderTableOfContents } from './core/renderer';
import { copyPublicFolder, readSequenceConfig, setupFiles } from './core/setup';
import { LinkDetails, Sequence } from './core/types';
import { OUTPUT_DIR } from './utils/constant';
import { writeFile } from './utils/file';
import { removeSpaces } from './utils/string';

buildWebsite();

function buildWebsite() {
    try {
        setupFiles();
        const config = readSequenceConfig();

        const seqLinks = config.sequences.map(buildSequencePages);
        const indexFilePath = path.join(OUTPUT_DIR, 'index.html');

        const toc = renderTableOfContents('visions of color', seqLinks, config.index);
        writeFile(indexFilePath, toc);
        copyPublicFolder();
    } catch (error) {
        console.error('Encountered an error while building the website', error);
    }
}

function buildSequencePages(seq: Sequence): LinkDetails {
    const seqURL = `/${removeSpaces(seq.title).toLowerCase()}`;
    const seqPath = path.join(OUTPUT_DIR, seqURL);
    fs.mkdirSync(seqPath);

    const stepLinks = [];

    // build html files for each step
    for (let i = 0; i < seq.steps.length; i++) {
        const step = seq.steps[i];
        const title = `${seq.title} - Step ${i + 1}`;
        const stepPath = path.join(seqPath, `${i + 1}.html`);
        const stepURL = path.join(seqURL, `${i + 1}`);

        stepLinks.push({
            title,
            url: stepURL,
        });

        writeFile(stepPath, renderStepToHTML(title, step,seqURL, i, i === seq.steps.length - 1));
    }

    // build index file
    const toc = renderTableOfContents(seq.title, stepLinks, seq.index);
    const indexFilePath = path.join(seqPath, 'toc.html');
    writeFile(indexFilePath, toc);

    return {
        'title': seq.title,
        'url': path.join(seqURL, 'toc.html'),
    };
}