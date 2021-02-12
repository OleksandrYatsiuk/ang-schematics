import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
const json = require('../../package.json');

export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const lib: NodeDependency = {
      name: json.name,
      version: `^${json.version}`,
      type: NodeDependencyType.Dev
    }
    addPackageJsonDependency(tree, lib)
    _context.addTask(new NodePackageInstallTask());
    return tree;
  };
}