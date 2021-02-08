/**
 * 
 * @param path path to schema files
 * @param selected array of selected files to generate
 * @returns boolean; available current path to generate?
 */

export function filterFilesByName(path: string, selected: string[]): boolean {
    const res = selected.filter(p => path.match(p))[0]
    return res && res.length > 0 ? true : false
}