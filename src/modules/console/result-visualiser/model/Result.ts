/**
 * Represents query execution result object.
 */
export class Result {
    readonly rawResponse: string
    readonly value: any

    constructor(value: any, rawResponse: string){
        this.value = value
        this.rawResponse = rawResponse
    }
}
