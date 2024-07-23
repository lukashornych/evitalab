import { Value } from "../Value";

export class Currency {
    code: Value<string>

    constructor(code: Value<string>){
        this.code = code;
    }
}