import { apply, branchAndMerge, chain, filter, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { IGuardSchema } from './schema';
import { normalize, strings } from '@angular-devkit/core';
import { filterFilesByName } from '../utils/filter-utils';


export function guard(_options: IGuardSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _options.path = _options.path ? normalize(_options.path) : _options.path;

    const templateSource = apply(url('./files'), [
      filter(path => filterFilesByName(path, _options.guards)),
      template({
        ...strings,
        ..._options
      }),
      move(normalize(`${_options.sourceDir}/${_options.path}/${_options.folder}`))
    ]);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
      ]))
    ]);
    return rule(tree, _context);
  };
}
