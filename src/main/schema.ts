import { ISchema } from '../base.model';

export interface IMainModuleSchema extends ISchema {
    components: string[];
    routingModule: string;
    route: string
}