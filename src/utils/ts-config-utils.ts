import { Tree, } from "@angular-devkit/schematics";
import { JSONFile } from "@schematics/angular/utility/json-file";

const PKG_JSON_PATH = '/tsconfig.json';

interface DeclareModulePaths {
    key: string;
    path: string;
    overwrite?: boolean;
}


export function addPathToTsConfigJson(host: Tree, options: DeclareModulePaths): void {

    const file = new JSONFile(host, PKG_JSON_PATH)
    const { key, path } = options;
    const segment: string[] = ['compilerOptions', 'paths', key];
    if (options?.overwrite || !file.get(segment)) {
        file.modify(segment, [path]);
    }
}

export function removePathFromTsConfigJson(host: Tree, name: string, pkgJsonPath = PKG_JSON_PATH): void {
    const json = new JSONFile(host, pkgJsonPath);
    json.remove(['compilerOptions', 'paths', name]);
}

export function getPathFromTsConfigJson(tree: Tree, name: string, pkgJsonPath = PKG_JSON_PATH): string[] | undefined {
    const json = new JSONFile(tree, pkgJsonPath);
    const path = json.get(['compilerOptions', 'paths', name]);
    if (typeof path === 'object') {
        if (path instanceof Array) {
            return path;
        }
    }
    return undefined;
}