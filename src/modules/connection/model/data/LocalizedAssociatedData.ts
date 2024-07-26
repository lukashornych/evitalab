import { EvitaAssociatedDataValue } from "./EvitaAssociatedDataValue";
import { Map } from "immutable";

//TODO: Add documentation
export class LocalizedAssociatedData{
    readonly associatedData: Map<string, EvitaAssociatedDataValue>

    constructor(associatedData: Map<string, EvitaAssociatedDataValue>){
        this.associatedData = associatedData
    }
}