import { apply, branchAndMerge, chain, mergeWith, move, noop, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { ISiteVariablesSchema, ModelSiteVariables } from './schema';
import { addVariableDeclaration, getVariableDeclaration, IVariableDeclaration } from '../utils/variables-module-utils';
import { writeToRight } from '../utils/writing-utils';
import * as stringifyObject from "stringify-object";
import { getLastImportDeclarations } from '../utils/import-utils';
import { normalize, strings } from '@angular-devkit/core';
import { getPathFromTsConfigJson } from '../utils/ts-config-utils';
import { parseTsFileToSource } from '../utils/parse-utils';
import { addProviderToModule } from '../utils/ng-module-utils';
import { createHost } from '../utils/workspace-utils';


export function siteVariables(_options: ISiteVariablesSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    _options = await createHost(tree, _options);

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ..._options
      }),
      move(normalize(`${_options.srcDir}/models`))
    ]);

    return chain([
      branchAndMerge(chain([
        _options.insertInterface ? mergeWith(templateSource) : noop(),
        generateSiteVariable(_options)
      ]))
    ]);

  };
}


function generateSiteVariable(_options: ISiteVariablesSchema): Rule {
  return (tree: Tree) => {
    const source = parseTsFileToSource(tree, _options.srcDir, _options.module);
    _options.variables = new ModelSiteVariables(_options.variables);
    const fullPath = `${_options.srcDir}/${_options.module}`;
    const variableName = 'SITE_VARIABLES';

    const nodes = getVariableDeclaration(source, variableName);

    if (nodes) {
      throw new SchematicsException(`Variable "${variableName}" is already exist in file!`);
    }

    const lastImport = getLastImportDeclarations(source)
    const variable: IVariableDeclaration = {
      name: variableName,
      type: 'const',
      isExport: true,
      content: `${stringifyObject(_options.variables)}`,
      model: 'ISiteVariables',
      modelPath: './models/site-variables.model',
    }

    if (getPathFromTsConfigJson(tree, '@models/*')) {
      variable.modelPath = "@models/site-variables.model";
    }

    const variableChanges = addVariableDeclaration(fullPath, lastImport.getEnd() + 1, variable, source);
    const providerChanges = addProviderToModule(source, fullPath, `{ provide: 'APP_CONFIG', useValue: ${variableName} }`);

    writeToRight(tree, variableChanges.concat(providerChanges), fullPath);

    return tree;
  }
}
