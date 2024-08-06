import { Value } from "../Value";
import { LevelInfos } from "./LevelInfos";
import { Map } from "immutable";

//TODO: Add documentation
export class Hierarchy {
    readonly hierarchy: Value<Map<string, LevelInfos>>

    constructor(hierarchy: Value<Map<string, LevelInfos>>){
        this.hierarchy = hierarchy
    }
}