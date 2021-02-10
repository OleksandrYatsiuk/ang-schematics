import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';


export function getAllImportDeclarations(sourceFile: ts.SourceFile): ts.Node[] {
    return sourceFile.statements.filter(
        statement => statement.kind === ts.SyntaxKind.ImportDeclaration
    );
}

export function getLastImportDeclarations(sourceFile: ts.SourceFile): ts.Node {
    const importDeclarations = getAllImportDeclarations(sourceFile);
    return importDeclarations[importDeclarations.length - 1];
}