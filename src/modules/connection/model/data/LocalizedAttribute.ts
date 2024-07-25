import { Value } from "../Value";
import { Map } from "immutable";

export class LocalizedAttribute {
    attributes: Value<Map<string, object>>
    constructor(attributtes: Value<Map<string, object>>){
        this.attributes = attributtes;
    }
}