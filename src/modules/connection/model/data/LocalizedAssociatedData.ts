import { Map } from "immutable";

//TODO: Add documentation
export class LocalizedAssociatedData{
    readonly associatedData: Map<string, any>

    constructor(associatedData: Map<string, any>){
        this.associatedData = associatedData
    }
}