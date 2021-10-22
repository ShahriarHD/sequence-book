

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { CONTENT_DIR, OUTPUT_DIR } from '../utils/constant';
import { readFile } from '../utils/file';
import { SequenceConfig } from './types';

export function setupFiles() {
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.mkdirSync(OUTPUT_DIR);
}

export function readSequenceConfig(): SequenceConfig {
    const CONFIG_PATH = path.join(CONTENT_DIR, 'sequences.yaml');

    const configContent = readFile(CONFIG_PATH);
    const config: SequenceConfig = YAML.parse(configContent);

    return config;
}
