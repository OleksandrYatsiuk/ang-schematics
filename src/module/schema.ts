import { ISchema } from "../base.model";

export interface MenuOptions extends ISchema {
    name: string;
    route: string;
    routingModule: string;
}