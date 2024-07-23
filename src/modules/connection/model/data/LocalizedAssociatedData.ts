import { EvitaAssociatedDataValue } from "./EvitaAssociatedDataValue";

export class LocalizedAssociatedData{
    readonly associatedData: EvitaAssociatedDataValue[]

    constructor(associatedData: EvitaAssociatedDataValue[]){
        this.associatedData = associatedData
    }
}