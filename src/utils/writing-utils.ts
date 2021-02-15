import { Tree } from "@angular-devkit/schematics";
import { Change, InsertChange } from "@schematics/angular/utility/change";

export function writeToRight(tree: Tree, data: Change[], path: string, commit = true): void {
    const recorder = tree.beginUpdate(path);

    for (const change of data) {
        if (change instanceof InsertChange) {
            recorder.insertRight(change.pos, change.toAdd);
        }
    }
    if (commit) {
        tree.commitUpdate(recorder);
    }
}

export function writeToLeft(tree: Tree, data: Change[], path: string, commit = true): void {
    const recorder = tree.beginUpdate(path);

    for (const change of data) {
        if (change instanceof InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }
    }
    if (commit) {
        tree.commitUpdate(recorder);
    }

}


export function clear(tree: Tree, start: number, width: number, path: string, commit = false): void {
    const recorder = tree.beginUpdate(path);
    recorder.remove(start, width);
    if (commit) {
        tree.commitUpdate(recorder);
    }
}