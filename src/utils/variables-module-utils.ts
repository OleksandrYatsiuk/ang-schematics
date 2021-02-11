import { SchematicsException } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getSourceNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';



export type VariableType = 'const' | 'let' | 'var';

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

/**
 * @param path path to file
 * @param pos start position
 * @param options variable data
 * @param source file source
 */
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

/**
 * @param source typescript file context
 * @param identifier variable name of declaration
 * const variable = [];  
 * identifier is  "variable"
 * @returns node instance
 */
export function getVariableDeclaration(source: ts.SourceFile, identifier: string, isArray?: boolean): ts.Node[] {

    const nodes = getSourceNodes(source).map((n: ts.Node) => n)
        .filter((n: ts.Node) => n.kind === ts.SyntaxKind.VariableDeclaration)
        .filter((n: ts.Node) => n.getChildren().findIndex(c => c.kind === ts.SyntaxKind.Identifier && c.getText() == identifier) !== -1)
    if (isArray) {
        const node = nodes.map((n: ts.Node) => n.getChildren().filter(c => (c.kind == ts.SyntaxKind.ArrayLiteralExpression)));
        return node[node.length - 1];
    } else {
        const node = nodes.map((n: ts.Node) => n.getChildren().filter(c => (c.kind == ts.SyntaxKind.ObjectLiteralExpression)));
        return node[node.length - 1];
    }
}

