export function getFileExtension(value: string): string {
    // eslint-disable-next-line no-useless-escape
    const extension = value.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    return extension ? extension[1] : '';
}

export function getFileName(value: string): string {
    return value.substring(value.lastIndexOf('/') + 1, value.lastIndexOf('.'));
}
