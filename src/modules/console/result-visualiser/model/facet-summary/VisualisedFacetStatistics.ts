/**
 * Facet statistics DTO ready for visualisation
 */
export type VisualisedFacetStatistics = {
    requested?: boolean
    primaryKey?: number
    title?: string
    numberOfEntities?: number
    impactDifference?: string
    impactMatchCount?: number
    count?: number
}
