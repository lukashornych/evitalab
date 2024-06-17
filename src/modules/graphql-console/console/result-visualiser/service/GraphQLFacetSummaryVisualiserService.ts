import {
    GraphQLResultVisualiserService
} from '@/modules/graphql-console/console/result-visualiser/service/GraphQLResultVisualiserService'

/**
 * {@link FacetSummaryVisualiserService} for GraphQL query language.
 */
export class GraphQLFacetSummaryVisualiserService extends JsonFacetSummaryVisualiserService<GraphQLResultVisualiserService> {
    constructor(visualiserService: GraphQLResultVisualiserService) {
        super(visualiserService)
    }
}
