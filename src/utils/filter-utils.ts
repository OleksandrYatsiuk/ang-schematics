/**
 * 
 * @param path path to schema files
 * @param selected array of selected files to generate
 * @param folder check only in folder, other true
 * @returns boolean; is available current path to generate
 */

export function filterFilesByName(path: string, selected: string[], folder = ''): boolean {
    if (path.includes(folder) && folder !== '') {
        const res = selected.filter(p => path.match(p))[0];
        return res && res.length > 0 ? true : false;
    }
    return true;

}