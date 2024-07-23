export class EvitaAssociatedDataValue {
    readonly value: object
    readonly version?: number | undefined;

    constructor(value: object, version: number | undefined){
        this.value = value;
        this.version = version;
    }
}