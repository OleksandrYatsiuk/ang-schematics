import { ISchema } from "../base.model";

export interface IAdditionalSupportElementsSchema extends ISchema {
    elements: string[];
    folder: string;
}