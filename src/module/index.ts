import {
    Rule, SchematicContext, Tree,
    apply, mergeWith, template, url, move, chain, branchAndMerge
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { MenuOptions } from './schema';
import { createHost } from '../utils/workspace-utils';
import { insertRoutes, IRouteModule } from '../utils/routes-utils';
import { parseTsFileToSource } from '../utils/parse-utils';
import { writeToRight } from '../utils/writing-utils';


export default function (_options: MenuOptions): Rule {
    return async (tree: Tree, _context: SchematicContext) => {

        _options = await createHost(tree, _options);

        const templateSource = apply(url('./files'), [
            template({
                ...strings, ..._options
            }),
            move(_options.srcDir)
        ]);
        return chain([
            branchAndMerge(chain([
                mergeWith(templateSource),
                updateRoutes(_options)
            ]))
        ]);
    };
}


function updateRoutes(options: MenuOptions): Rule {
    return (tree: Tree) => {

        const path = './module-' + strings.dasherize(options.name) + '/'
            + strings.dasherize(options.name)
            + '.module';

        const route: IRouteModule[] = [
            {
                classifyModuleName: strings.classify(options.name),
                modulePath: path,
                routeName: options.route,
                lazy: true
            }];

        const routingModulePath = options.srcDir + '/' + options.routingModule;
        const source = parseTsFileToSource(tree, options.srcDir, options.routingModule);

        const changes = insertRoutes(routingModulePath, source, route);
        writeToRight(tree, changes, routingModulePath);

        return tree;
    }
}