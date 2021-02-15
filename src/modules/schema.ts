import { ISchema } from "../base.model";

export interface IModulesSchema extends ISchema {
    path: string;
    modules: string[];
    routingModule: string;
}