import { branchAndMerge, chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { getLastImportDeclarations } from '../utils/import-utils';
import { parseTsFileToSource } from '../utils/parse-utils';
import { addFunctionDeclaration, getFunctionDeclaration, IFunctionDeclaration } from '../utils/variables-module-utils';
import { createHost } from '../utils/workspace-utils';
import { writeToRight } from '../utils/writing-utils';
import { ISpmCoreSchema } from './schema';


export function spmCoreIntegration(_options: ISpmCoreSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    _options = await createHost(tree, _options);


    return chain([
      branchAndMerge(chain([
        setSpmCoreModule(_options)
      ]))
    ]);
  };
}


function setSpmCoreModule(options: ISpmCoreSchema): Rule {
  return (tree: Tree) => {
    const source = parseTsFileToSource(tree, options.srcDir, options.module);
    const functionName = 'getEnv';
    const declaration = getFunctionDeclaration(source, functionName);
    
    if (declaration) {
      throw new Error(`Function "${functionName}" is already exist in ${options.module}`);
    }

    const func: IFunctionDeclaration = {
      isExport: true,
      name: functionName,
      returns: {
        model: 'any',
      },
      content: 'return environment;',
      externalImports: [
        {
          name: 'environment',
          path: 'environments/environment'
        }
      ]
    }
    const lastImport = getLastImportDeclarations(source);
    const changes = addFunctionDeclaration(options.srcDir + '/' + options.module, lastImport.getEnd() + 1, func, source);
    const imports = addImportToModule(source, 'spm-core', 'SpmCoreModule.forRoot(getEnv())', 'spm-core');

    writeToRight(tree, changes.concat(imports), options.srcDir + '/' + options.module);

    return tree;
  }
}