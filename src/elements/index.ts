import { apply, chain, filter, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { IAdditionalSupportElementsSchema } from './schema';
import { normalize, strings } from '@angular-devkit/core';
import { filterFilesByName } from '../utils/filter-utils';
import { createHost } from '../utils/workspace-utils';


export function guards(_options: IAdditionalSupportElementsSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    return await generate(tree, _options, 'guards');
  };
}

export function directives(_options: IAdditionalSupportElementsSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    return await generate(tree, _options, 'directives');
  };
}

export function services(_options: IAdditionalSupportElementsSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    return generate(tree, _options, 'services');
  };
}


async function generate(tree: Tree, options: IAdditionalSupportElementsSchema, folder: string): Promise<Rule> {
  options = await createHost(tree, options);
  const templateSource = apply(url(`./files/${folder}`),
    [
      filter(path => filterFilesByName(path, options.elements, folder)),
      template({ ...strings, ...options }),
      move(normalize(`${options.srcDir}/${options.folder}`))
    ]
  );
  return chain([mergeWith(templateSource)]);
}
