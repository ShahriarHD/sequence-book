const spaceRegex = /\s+/g;

export function removeSpaces(s: string): string {
    return s.replace(spaceRegex, '');
}