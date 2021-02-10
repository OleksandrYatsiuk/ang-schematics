import {
    Rule, SchematicContext, Tree,
    apply, mergeWith, template, url, move, chain, branchAndMerge
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';
import { MenuOptions } from './schema';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { addLazyLoadingRouteToNgModule } from '../utils/ng-module-utils';


export default function (_options: MenuOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        _options.path = _options.path ? normalize(_options.path) : _options.path;

        _options.module = _options.module || findModuleFromOptions(tree, _options) || '';
        const templateSource = apply(url('./files'), [
            template({
                ...strings,
                ..._options
            }),
            move(`${_options.sourceDir}/${_options.path}`)
        ]);
        const rule = chain([
            branchAndMerge(chain([
                mergeWith(templateSource),
                addLazyLoadingRouteToNgModule(_options)
            ]))
        ]);
        return rule(tree, _context);
    };
}
