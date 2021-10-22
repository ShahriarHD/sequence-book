import fs from 'fs';

export function readFile(path: string): string {
    return fs.readFileSync(path).toString();
}

export function writeFile(path: string, content: string): void {
    fs.writeFileSync(path, content);
}