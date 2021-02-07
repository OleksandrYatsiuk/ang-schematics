import { Change, InsertChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getSourceNodes, insertImport } from '@schematics/angular/utility/ast-utils';

/**
 * 
 * @param route string
 * @param path string
 * @param moduleName string
 * 
 * create Route instance with async load module as 
 * {
    path: route,
    loadChildren: async () => ((await import( {{ path }} )).{{ moduleName }})
   };
 * @returns string Route instance as string type
 */
function asyncRouteTemplate(route: string, path: string, moduleName: string): string {
    return `
{
    path: '${route}',
    loadChildren: async () => ((await import('${path}')).${moduleName})
}`;
}

export function getAllImportDeclarations(sourceFile: ts.SourceFile): ts.Node[] {
    return sourceFile.statements.filter(
        statement => statement.kind === ts.SyntaxKind.ImportDeclaration
    );
}

/**
 * @param source typescript file context
 * @param identifier variable name of declaration
 * const variable = [];  
 * identifier is  "variable"
 * @returns node instance
 */
export function getVariableDeclaration(source: ts.SourceFile, identifier: string): ts.Node[] {

    const nodes = getSourceNodes(source).map((n: ts.Node) => n)
        .filter((n: ts.Node) => n.kind === ts.SyntaxKind.VariableDeclaration)
        .filter((n: ts.Node) => n.getChildren().findIndex(c => c.kind === ts.SyntaxKind.Identifier && c.getText() == identifier) !== -1)
        .map((n: ts.Node) => n.getChildren().filter(c => (c.kind === ts.SyntaxKind.ArrayLiteralExpression)));

    return nodes[nodes.length - 1];
}

export function addRouteToModule(source: ts.SourceFile,
    modulePath: string, classifiedName: string,
    importPath: string, route: string): Change[] {
    return addSymbolToRoutesMetadata(source, modulePath, 'routes', classifiedName, importPath, route);
}

export function addSymbolToRoutesMetadata(source: ts.SourceFile,
    ngModulePath: string,
    metadataField: string,
    moduleName: string,
    importPath: string, route: string): Change[] {
    const nodes = getVariableDeclaration(source, metadataField);

    const asyncRoute = asyncRouteTemplate(route, importPath, moduleName);

    if (nodes?.length === 1) {
        if (nodes[0].forEachChild(node => node.getText().includes(route))) {
            throw new Error(`Route "${route}" is already exist!`);
        }
        const navigation: ts.ArrayLiteralExpression = nodes[0] as ts.ArrayLiteralExpression;
        const pos = navigation.getStart() + 1;

        const toInsert = `${asyncRoute},`;
        return [new InsertChange(ngModulePath, pos, toInsert)];
    } else {
        return createRoutesVariable(source, ngModulePath, asyncRoute);
    }
}

export function createRoutesVariable(source: ts.SourceFile, ngModulePath: string, route: string): Change[] {
    const importDeclarations = getAllImportDeclarations(source);
    const lastImport = importDeclarations[importDeclarations.length - 1];

    route = `\n const routes: Route[]= [${route}];`;

    return [
        new InsertChange(ngModulePath, lastImport.getEnd(), route),
        insertImport(source, ngModulePath, 'Route', '@angular/router')
    ];

}
