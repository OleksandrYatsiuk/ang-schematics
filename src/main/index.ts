import { apply, branchAndMerge, chain, filter, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { filterFilesByName } from '../utils/filter-utils';
import { normalize, strings } from '@angular-devkit/core';
import { createHost } from '../utils/workspace-utils';


export function main(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    _options = await createHost(tree, _options);
    _options.path = _options.path ? normalize(_options.path) : _options.path;

    const templateSource = apply(url('./files'), [
      filter(path => filterFilesByName(path, _options.components, 'components')),
      template({
        ...strings,
        ..._options
      }),
      move(normalize(`${_options.sourceDir}/${_options.path}`))
    ]);


    return chain([
      branchAndMerge(chain([
        mergeWith(templateSource)
      ]))
    ]);

  };
}
