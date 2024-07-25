import { EvitaAssociatedDataValue } from "./EvitaAssociatedDataValue";
import { Map } from "immutable";

export class LocalizedAssociatedData{
    readonly associatedData: Map<string, EvitaAssociatedDataValue>

    constructor(associatedData: Map<string, EvitaAssociatedDataValue>){
        this.associatedData = associatedData
    }
}