import { EntitySchema, ReferenceSchema } from '@/model/evitadb'

/**
 * Service for visualising raw JSON hierarchies.
 */
export interface HierarchyVisualiserService {
    /**
     * Tries to find references with named hierarchies results in the hierarchy result.
     */
    findNamedHierarchiesByReferencesResults(hierarchyResult: Result, entitySchema: EntitySchema): [ReferenceSchema | undefined, Result][]

    /**
     * Resolves visualisable named hierarchy from the named hierarchy result.
     */
    resolveNamedHierarchy(namedHierarchyResult: Result[], entityRepresentativeAttributes: string[]): VisualisedNamedHierarchy
}
