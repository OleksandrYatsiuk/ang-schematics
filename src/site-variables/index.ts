import { apply, branchAndMerge, chain, mergeWith, move, noop, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { ISiteVariablesSchema, ModelSiteVariables } from './schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { addVariableDeclaration, IVariableDeclaration, parseTsFileToSource } from '../utils/variables-module-utils';
import { getVariableDeclaration } from '../utils/routes-utils';
import { clear, writeToLeft, writeToRight } from '../utils/writing-utils';
import * as stringifyObject from "stringify-object";
import { getLastImportDeclarations } from '../utils/import-utils';
import { normalize, strings } from '@angular-devkit/core';
import { getPathFromTsConfigJson } from '../utils/ts-config-utils';
import { InsertChange } from '@schematics/angular/utility/change';


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

    const nodes = getVariableDeclaration(source, 'SITE_VARIABLES');
    if (nodes?.length === 1) {
      const pos = nodes[0].getFullStart();
      clear(tree, pos, nodes[0].getFullWidth(), fullPath, true);
      writeToLeft(tree, [new InsertChange(fullPath, pos, ` ${stringifyObject(_options.variables)}`)], fullPath);
    } else {
      const lastImport = getLastImportDeclarations(source)
      const variable: IVariableDeclaration = {
        name: 'SITE_VARIABLES',
        content: `\n ${stringifyObject(_options.variables)}`,
        type: 'const',
        isExport: true,
        model: 'ISiteVariables',
        modelPath: './models/site-variables.model',
      }

      if (getPathFromTsConfigJson(tree, '@models/*')) {
        variable.modelPath = "@models/site-variables.model";
      }
      const changes = addVariableDeclaration(fullPath, lastImport.getEnd() + 1, variable, source);

      writeToRight(tree, changes, fullPath);
    }

    return tree;
  }
}
