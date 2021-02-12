import { ISchema } from "../base.model";

export interface IMainModuleSchema extends ISchema {
    module: string;
    path: string;
    components: string[];
    routingModule: string;
}