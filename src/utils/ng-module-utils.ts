import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { AddToModuleContext } from './add-to-module-context';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { buildRelativePath } from "@schematics/angular/utility/find-module";
import { addImportToModule, getRouterModuleDeclaration } from "@schematics/angular/utility/ast-utils";
import { addRouteToModule } from './routes-utils';
import { writeToRight } from './writing-utils';


export interface ModuleOptions {
    module: string;
    name: string;
    sourceDir?: string;
    path?: string;
    route: string;
  }


export function addLazyLoadingRouteToNgModule(options: ModuleOptions): Rule {
    return (tree: Tree) => {
        const context = createModuleContext(tree, options);
        const modulePath = options.module || '';

        let exportRecorder = tree.beginUpdate(modulePath);

        if (getRouterModuleDeclaration(context.source)) {

            const fileChanges = addRouteToModule(context.source,
                modulePath,
                context.classifiedName,
                context.relativePath,
                options.route);

            exportRecorder = writeToRight(exportRecorder, fileChanges);
        } else {
            const fileChanges = addImportToModule(context.source, modulePath, 'RouterModule.forRoot(routes)', '@angular/router');
            const routesChanges = addRouteToModule(context.source, modulePath, context.classifiedName, context.relativePath, options.route);
            exportRecorder = writeToRight(exportRecorder, fileChanges.concat(routesChanges));

        }
        tree.commitUpdate(exportRecorder);

        return tree;
    }
}

function createModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {
    const result = new AddToModuleContext();

    if (!options.module) {
        throw new SchematicsException('Module not found!');
    }

    if (!options.module.startsWith('/')) {
        options.module = `/${options.sourceDir}/${options.path}/${options.module}`;
    }

    const text = host.read(options.module);

    if (text === null) {
        throw new SchematicsException(`File ${options.module} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    const componentPath = `/${options.sourceDir}/${options.path}/`
        + 'module-' + dasherize(options.name) + '/'
        + dasherize(options.name)
        + '.module';

    result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);
    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = classify(`${options.name}Module`);
    return result;
}


