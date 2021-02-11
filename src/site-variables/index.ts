import { apply, branchAndMerge, chain, mergeWith, move, noop, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { ISiteVariablesSchema, ModelSiteVariables } from './schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { addVariableDeclaration, getVariableDeclaration, IVariableDeclaration } from '../utils/variables-module-utils';
import { writeToRight } from '../utils/writing-utils';
import * as stringifyObject from "stringify-object";
import { getLastImportDeclarations } from '../utils/import-utils';
import { normalize, strings } from '@angular-devkit/core';
import { getPathFromTsConfigJson } from '../utils/ts-config-utils';
import { parseTsFileToSource } from '../utils/parse-utils';
import { addProviderToModule } from '../utils/ng-module-utils';


export function siteVariables(_options: ISiteVariablesSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(tree, 'angular.json');

    if (!_options.project) {
      _options.project = workspace.extensions.defaultProject;
    }

    const project = workspace.projects.get(_options.project);
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${_options.project}`);
    }
    const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    if (_options.path === undefined) {
      _options.path = `${project.sourceRoot}/${projectType}`;
    }

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ..._options
      }),
      move(normalize(`${_options.path}/models`))
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
    const source = parseTsFileToSource(tree, _options.path, _options.module);
    _options.variables = new ModelSiteVariables(_options.variables);
    const fullPath = `${_options.path}/${_options.module}`;
    const variableName = 'SITE_VARIABLES';

    const nodes = getVariableDeclaration(source, variableName);

    if (nodes?.length > 0) {
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
