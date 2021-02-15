import {
  apply, chain, filter, mergeWith, move, Rule,
  SchematicContext, template, Tree, url
} from '@angular-devkit/schematics';
import { filterFilesByName } from '../utils/filter-utils';
import { normalize, strings } from '@angular-devkit/core';
import { createHost } from '../utils/workspace-utils';
import { insertRoutes, IRouteModule } from '../utils/routes-utils';
import { IMainModuleSchema } from './schema';
import { parseTsFileToSource } from '../utils/parse-utils';
import { writeToRight } from '../utils/writing-utils';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';


export function main(_options: IMainModuleSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    _options = await createHost(tree, _options);
    _options.path = _options.path ? normalize(_options.path) : _options.path;

    const templateSource = apply(url('./files'), [
      filter(path => filterFilesByName(path, _options.components.concat(['main']), 'components')),
      template({
        ...strings,
        ..._options
      }),
      move(normalize(`${_options.srcDir}`))
    ]);

    return chain([
      mergeWith(templateSource),
      updateMainModuleInRoutes(_options)
    ]);

  };
}


function updateMainModuleInRoutes(options: IMainModuleSchema): Rule {
  return (tree: Tree) => {
    const source = parseTsFileToSource(tree, options.srcDir, options.routingModule);
    const route: IRouteModule = {
      routeName: ':lang',
      lazy: false,
      otherContent: "component: MainComponent,\ncanActivate: [LangGuard]",
      importsList: [
        {
          model: 'LangGuard',
          path: '@guards/lang-guard.guard/lang-guard.guard'
        },
        {
          model: 'MainComponent',
          path: './module-main/components/main/main.component'
        },
        {
          model: 'Route',
          path: '@angular/router'
        }
      ]
    }
    const changes = insertRoutes(options.routingModule, source, [route]);
    const importChanges = addImportToModule(source, options.routingModule, 'RouterModule.forRoot(routes)', '@angular/router');

    writeToRight(tree, changes.concat(importChanges), options.srcDir + '/' + options.routingModule);
    return tree;
  }
}

