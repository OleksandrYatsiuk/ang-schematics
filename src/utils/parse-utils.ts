export function parseToString(data: any): string {
    return JSON.stringify(data).replace(/"([^"]+)":/g, '\n  $1:');
}

export function parseToJSON(): JSON {
    return JSON.parse('');
}