import {
    GraphQLResultVisualiserService
} from '@/modules/graphql-console/console/result-visualiser/service/GraphQLResultVisualiserService'

/**
 * {@link AttributeHistogramsVisualiserService} for GraphQL query language.
 */
export class GraphQLAttributeHistogramsVisualiserService extends JsonAttributeHistogramsVisualiserService<GraphQLResultVisualiserService> {
    constructor(visualiserService: GraphQLResultVisualiserService) {
        super(visualiserService)
    }
}
