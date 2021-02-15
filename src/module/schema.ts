import { ISchema } from "../base.model";

export interface MenuOptions extends ISchema {
    name: string;
    appRoot: string;
    path: string;
    sourceDir: string;
    menuService: boolean;
    route: string;
    module: string;
}