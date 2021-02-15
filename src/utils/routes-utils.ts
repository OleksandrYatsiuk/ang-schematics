import { Change, InsertChange, NoopChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { getLastImportDeclarations } from './import-utils';
import { addVariableDeclaration, getVariableDeclaration, IVariableDeclaration } from './variables-module-utils';
import { SchematicsException } from '@angular-devkit/schematics';


export interface IRouteModule {
    routeName: string;
    classifyModuleName?: string;
    modulePath?: string;
    lazy: boolean,
    otherContent?: string;
    importsList?: {
        model: string;
        path?: string;
    }[]
}


export function insertRoutes(path: string, source: ts.SourceFile, routes: IRouteModule[]): Change[] {
    const changes: Change[] = [];
    const node = getVariableDeclaration(source, 'routes');
    routes.forEach(route => {

        if (route?.lazy && !route?.classifyModuleName) {
            throw new SchematicsException('"classifyModuleName" field is required for lazy loading!');
        }
        if (route?.lazy && !route?.modulePath) {
            throw new SchematicsException('"modulePath" field is required for lazy loading!');
        }

        if (!node && routes.length > 1) {
            throw new SchematicsException('Please, add "routes" constant manually. After that you can insert array of routes.');
        }

        if (!node && routes.length == 1) {
            changes.push(addRouteVariable(source, path, getRouteModel(route, route?.lazy)));
        } else {
            changes.push(updateRoutesVariable(node, source, path, getRouteModel(route, route?.lazy)));
        }

        route.importsList?.forEach(i => {
            if (i?.path) {
                changes.push(insertImport(source, path, i.model, i.path));
            }
        });
    });
    return changes;
}



function addRouteVariable(source: ts.SourceFile, path: string, routeModel: string): Change {

    const router: IVariableDeclaration = {
        type: 'const',
        name: 'routes',
        model: 'Route[]',
        modelPath: '@angular/router',
        content: `[\n ${routeModel}\n]`

    }
    const lastImport = getLastImportDeclarations(source)
    return addVariableDeclaration(path + '/' + source.fileName, lastImport.getEnd(), router)[0];
}

function updateRoutesVariable(node: ts.Node, source: ts.SourceFile, path: string, routeModel: string): Change {

    const start = node.forEachChild(n => n.kind === ts.SyntaxKind.ArrayLiteralExpression ? n.getStart() : false);
    if (start) {
        return new InsertChange(path + '/' + source.fileName, start + 1, `\n${routeModel},`);
    }
    return new NoopChange();
}

function getRouteModel(route: IRouteModule, lazy: boolean): string {
    if (lazy) {
        return `{\npath: '${route?.routeName}',\n${route?.otherContent ? route?.otherContent : ''}\n` +
            `loadChildren: async () => ((await import('${route?.modulePath}')).${route?.classifyModuleName})}`;
    }
    return `{\npath: '${route?.routeName}',\n${route?.otherContent} \n}`;;
}