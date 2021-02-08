import { apply, branchAndMerge, chain, filter, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { addPathToTsConfigJson } from '../utils/ts-config-utils';
import { normalize, strings } from '@angular-devkit/core';
import { ISharedSchema } from './schema';
import { filterFilesByName } from '../utils/filter-utils';


export function shared(_options: ISharedSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _options.path = _options.path ? normalize(_options.path) : _options.path;

    if (_options.declare) {
      addPathToTsConfigJson(tree, { key: '@module-shared/*', path: 'app/module-shared/*' })
    }

    const templateSource = apply(url('./files'), [
      filter(path => filterFilesByName(path, _options.components, 'components')),
      template({
        ...strings,
        ..._options
      }),
      move(normalize(`${_options.sourceDir}/${_options.path}`))
    ]);


    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
      ]))
    ]);
    return rule(tree, _context);
  };
}
