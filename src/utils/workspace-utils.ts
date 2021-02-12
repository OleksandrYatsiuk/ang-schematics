import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { getWorkspace } from "@schematics/angular/utility/workspace";
import { ISchema } from "../base.model";


export async function createHost(tree: Tree, options: ISchema): Promise<any> {

    const workspace = await getWorkspace(tree, 'angular.json');

    if (!options.project) {
        options.project = workspace.extensions.defaultProject;
    }

    const project = workspace.projects.get(options.project);
    if (!project) {
        throw new SchematicsException(`Invalid project name: ${options.project}`);
    }
    const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    if (options.srcDir === undefined) {
        options.srcDir = `${project.sourceRoot}/${projectType}`;
    }

    return options;

}