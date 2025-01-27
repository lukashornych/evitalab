/**
 * Label associated with the query / source query.
 */
export class Label {
    readonly name: string
    readonly value?: string

    constructor(name: string, value: string | undefined) {
        this.name = name
        this.value = value
    }
}

export const labelSourceQuery = 'source-query'
export const labelSourceType = 'source-type'

export const labelGraphQlOperationName = "graphql-operation-name"

export const graphQlSourceTypeLabelValue = 'GraphQL'
