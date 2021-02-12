import { Change, InsertChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { getLastImportDeclarations } from './import-utils';
import { addVariableDeclaration, getVariableDeclaration, IVariableDeclaration } from './variables-module-utils';
import { SchematicsException } from '@angular-devkit/schematics';

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

    if (nodes) {
        if (nodes.forEachChild(node => node.getText().includes(route))) {
            throw new Error(`Route "${route}" is already exist!`);
        }
        const navigation: ts.ArrayLiteralExpression = nodes as ts.ArrayLiteralExpression;
        const pos = navigation.getStart() + 1;

        const toInsert = `${asyncRoute},`;
        return [new InsertChange(ngModulePath, pos, toInsert)];
    } else {
        return createRoutesVariable(source, ngModulePath, asyncRoute);
    }
}

export function createRoutesVariable(source: ts.SourceFile, ngModulePath: string, route: string): Change[] {
    const lastImport = getLastImportDeclarations(source);

    route = `\n const routes: Route[]= [${route}];`;

    return [
        new InsertChange(ngModulePath, lastImport.getEnd(), route),
        insertImport(source, ngModulePath, 'Route', '@angular/router')
    ];

}


export interface IRouteModule {
    routeName: string;
    classifyModuleName?: string;
    modulePath?: string;
    lazy: boolean,
    otherContent: string;
    importsList?: {
        model: string;
        path?: string;
    }[]

}


export function insertRoute(path: string, source: ts.SourceFile, route: IRouteModule): Change[] {

    const changes: Change[] = [];

    let routeModel = `{\npath: '${route?.routeName}',\n${route?.otherContent} \n}`;

    if (route?.lazy && !route?.classifyModuleName) {
        throw new SchematicsException('"classifyModuleName" field is required for lazy loading!');
    }
    if (route?.lazy && !route?.modulePath) {
        throw new SchematicsException('"modulePath" field is required for lazy loading!');
    }
    if (route?.lazy) {
        routeModel = `{\npath: '${route?.routeName},\n${route?.otherContent}\n` +
            `loadChildren: async () => ((await import('${route?.modulePath}')).${route?.classifyModuleName})}`;
    }

    route.importsList?.forEach(i => {
        if (i?.path) {
            changes.push(insertImport(source, path, i.model, i.path));
        }
    })


    const node = getVariableDeclaration(source, 'routes');


    if (node) {
        const start = node.forEachChild(n => n.kind === ts.SyntaxKind.ArrayLiteralExpression ? n.getStart() : false);
        if (start) {
            changes.push(new InsertChange(path + '/' + source.fileName, start + 1, `\n${routeModel},`))
        }
    } else {


        const router: IVariableDeclaration = {
            type: 'const',
            name: 'routes',
            model: 'Route[]',
            modelPath: '@angular/router',
            content: `[\n ${routeModel}\n]`

        }

        const lastImport = getLastImportDeclarations(source)
        changes.push(addVariableDeclaration(path + '/' + source.fileName, lastImport.getEnd(), router)[0])

    }

    return changes;
}