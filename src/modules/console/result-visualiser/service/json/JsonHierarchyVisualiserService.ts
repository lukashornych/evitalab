import { JsonResultVisualiserService } from '@/modules/console/result-visualiser/service/JsonResultVisualiserService'
import { EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { UnexpectedError } from '@/model/lab'

/**
 * Common abstract for all JSON-based hierarchy visualiser services.
 */
export abstract class JsonHierarchyVisualiserService<VS extends JsonResultVisualiserService> implements HierarchyVisualiserService {
    protected readonly visualiserService: VS

    protected constructor(visualiserService: VS) {
        this.visualiserService = visualiserService
    }

    findNamedHierarchiesByReferencesResults(hierarchyResult: Result, entitySchema: EntitySchema): [(ReferenceSchema | undefined), Result][] {
        const referencesWithHierarchies: [ReferenceSchema | undefined, Result][] = []
        for (const referenceName of Object.keys(hierarchyResult)) {
            const namedHierarchiesResult: Result = hierarchyResult[referenceName]
            if (referenceName === 'self') {
                referencesWithHierarchies.push([undefined, namedHierarchiesResult])
            } else {
                const referenceSchema: ReferenceSchema | undefined = Object.values(entitySchema.references)
                    .find(reference => reference.nameVariants.camelCase === referenceName)
                if (referenceSchema == undefined) {
                    throw new UnexpectedError(undefined, `Reference '${referenceName}' not found in entity '${entitySchema.name}'.`)
                }
                referencesWithHierarchies.push([referenceSchema, namedHierarchiesResult])
            }
        }
        return referencesWithHierarchies
    }

    abstract resolveNamedHierarchy(namedHierarchyResult: Result[], entityRepresentativeAttributes: string[]): VisualisedNamedHierarchy
}
