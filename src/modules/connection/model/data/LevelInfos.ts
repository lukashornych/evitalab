import { List } from "immutable";
import { LevelInfo } from "./LevelInfo";
import { Value } from "../Value";

//TODO: Add documentation
export class LevelInfos {
    readonly levelInfos: Value<List<LevelInfo>>

    constructor(levelInfos: Value<List<LevelInfo>>){
        this.levelInfos = levelInfos
    }
} 