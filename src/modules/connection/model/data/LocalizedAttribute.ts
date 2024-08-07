import { Value } from "../Value";
import { Map } from "immutable";

//TODO: Add documentation
export class LocalizedAttribute {
    readonly attributes: Value<Map<string, object>>
    constructor(attributtes: Value<Map<string, object>>){
        this.attributes = attributtes;
    }

    toString():string{
        const resultStrings: string[] = []
        for(const [_, value] of this.attributes.getOrThrow()){
            resultStrings.push(String(value));
        }
        return resultStrings.join(' ')
    }
}