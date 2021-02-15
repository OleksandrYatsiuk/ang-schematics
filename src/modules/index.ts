import { apply, chain, filter, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { filterFilesByName } from '../utils/filter-utils';
import { normalize, strings } from '@angular-devkit/core';
import { createHost } from '../utils/workspace-utils';
import { IModulesSchema } from './schema';
import { insertRoutes, IRouteModule } from '../utils/routes-utils';
import { parseTsFileToSource } from '../utils/parse-utils';
import { writeToRight } from '../utils/writing-utils';


export function modules(_options: IModulesSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    _options = await createHost(tree, _options);

    const templateSource = apply(url('./files'),
      [
        filter(path => filterFilesByName(path, _options.modules)),
        template({ ...strings, ..._options }),
        move(normalize(_options.srcDir))
      ]
    );

    return chain([mergeWith(templateSource), updateRoutes(_options)]);
  };
}

function updateRoutes(options: IModulesSchema): Rule {
  return (tree: Tree) => {

    const modulePath = options.srcDir + '/' + options.routingModule;
    const source = parseTsFileToSource(tree, options.srcDir, options.routingModule);
    const routes: IRouteModule[] = [];
    options.modules.forEach(el => {
      routes.push({
        modulePath: `./${el}/${el}.module`,
        routeName: 'news',
        classifyModuleName: strings.classify(el),
        lazy: true,
        otherContent: 'canActivate: [LangGuard],',
        importsList: [
          {
            model: 'LangGuard',
            path: '@guards/lang-guard.guard/lang-guard.guard'
          }
        ]
      })
    })

    const changes = insertRoutes(modulePath, source, routes);


    writeToRight(tree, changes, modulePath);
    return tree;
  }
}