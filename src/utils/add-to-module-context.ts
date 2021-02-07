import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';


export class AddToModuleContext {
    source: ts.SourceFile;
    relativePath: string;
    classifiedName: string;
}