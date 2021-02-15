import { SchematicsException, Tree } from "@angular-devkit/schematics";

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export function parseTsFileToSource(tree: Tree, moduleDir: string, module: string): ts.SourceFile {
    const text = tree.read(`${moduleDir}/${module}`);
    if (text === null) {
        throw new SchematicsException(`File "${module}" does not exist.`);
    }
    const source = text.toString('utf-8');
    return ts.createSourceFile(module, source, ts.ScriptTarget.Latest, true);
}
