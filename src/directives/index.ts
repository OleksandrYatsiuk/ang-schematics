import { apply, branchAndMerge, chain, filter, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { IDirectivesSchema } from './schema';
import { normalize, strings } from '@angular-devkit/core';
import { filterFilesByName } from '../utils/filter-utils';


export function directives(_options: IDirectivesSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _options.path = _options.path ? normalize(_options.path) : _options.path;


    const templateSource = apply(url('./files'), [
      filter(path => filterFilesByName(path, _options.directives)),
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
