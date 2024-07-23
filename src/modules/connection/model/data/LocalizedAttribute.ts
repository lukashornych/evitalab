import { Value } from "../Value";

export class LocalizedAttribute {
    attributes: Value<object[]>
    constructor(attributtes: Value<object[]>){
        this.attributes = attributtes;
    }
}