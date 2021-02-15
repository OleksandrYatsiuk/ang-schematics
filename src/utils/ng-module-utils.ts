import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { addSymbolToNgModuleMetadata } from "@schematics/angular/utility/ast-utils";
import { Change } from '@schematics/angular/utility/change';

export function addProviderToModule(
    source: ts.SourceFile,
    path: string,
    name: string,
    importPath?: string | null): Change[] {
    return addSymbolToNgModuleMetadata(source, path, 'providers', name, importPath);
}


