import { UpdateRecorder } from "@angular-devkit/schematics";
import { Change, InsertChange } from "@schematics/angular/utility/change";

export function writeToRight(recorder: UpdateRecorder, data: Change[]): UpdateRecorder {
    for (const change of data) {
        if (change instanceof InsertChange) {
            recorder.insertRight(change.pos, change.toAdd);
        }
    }
    return recorder;
}

