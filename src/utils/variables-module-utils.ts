import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';


export function parseTsFileToSource(tree: Tree, path: string, module: string): ts.SourceFile {
    const text = tree.read(`${path}/${module}`);
    if (text === null) {
        throw new SchematicsException(`File ${module} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    return ts.createSourceFile(module, sourceText, ts.ScriptTarget.Latest, true);
}

type VariableType = 'const' | 'let' | 'var';

export interface IVariableDeclaration {
    name: string;
    content: string;
    type: VariableType;
    model?: string;
    modelPath?: string;
    skipModelImport?: boolean;
    isExport?: boolean;
}


export function createVariable({ isExport, type, name, content, model }: IVariableDeclaration): string {
    return `\n${isExport ? 'export' : ''} ${type} ${name} ${model ? ': ' + model : ''} = ${content};`;
}

export function addVariableDeclaration(path: string, pos: number, options: IVariableDeclaration, source?: ts.SourceFile): Change[] {
    if (options?.model) {
        if (options.skipModelImport !== true && !options?.modelPath) {
            throw new SchematicsException('Importing for model is required!. Enter model path or use skipModelImport:true')
        }
        if (options?.modelPath && !options.skipModelImport && source) {
            return [
                new InsertChange(path, pos, createVariable(options)),
                insertImport(source, path, options.model, options?.modelPath)
            ];
        }
    }
    return [new InsertChange(path, pos, createVariable(options))];
}

