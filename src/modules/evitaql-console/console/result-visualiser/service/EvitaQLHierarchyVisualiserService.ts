import {
    EvitaQLResultVisualiserService
} from '@/modules/console/result-visualiser/service/EvitaQLResultVisualiserService'

/**
 * {@link HierarchyVisualiserService} for EvitaQL query language.
 */
export class EvitaQLHierarchyVisualiserService extends JsonHierarchyVisualiserService<EvitaQLResultVisualiserService> {

    constructor(visualiserService: EvitaQLResultVisualiserService) {
        super(visualiserService)
    }

    resolveNamedHierarchy(namedHierarchyResult: Result[], entityRepresentativeAttributes: string[]): VisualisedNamedHierarchy {
        const trees: VisualisedHierarchyTreeNode[] = []
        const nodeCountHolder: HierarchyTreeNodeCountHolder = { count: 0 }
        const requestedNodeHolder: RequestedHierarchyTreeNodeHolder = { requestedNode: undefined }

        for (const treeResult of namedHierarchyResult) {
            const tree: VisualisedHierarchyTreeNode = this.resolveHierarchyTreeNode(
                treeResult,
                1,
                nodeCountHolder,
                requestedNodeHolder,
                entityRepresentativeAttributes
            )
            trees.push(tree)
        }

        return { count: nodeCountHolder.count, trees, requestedNode: requestedNodeHolder.requestedNode }
    }

    private resolveHierarchyTreeNode(nodeResult: Result,
                                     level: number,
                                     nodeCountHolder: HierarchyTreeNodeCountHolder,
                                     requestedNodeHolder: RequestedHierarchyTreeNodeHolder,
                                     entityRepresentativeAttributes: string[]): VisualisedHierarchyTreeNode {
        nodeCountHolder.count++

        const nodeEntity: Result | undefined = nodeResult['entity']

        const primaryKey: number | undefined = nodeEntity?.['primaryKey']
        // only root nodes should display parents, we know parents in nested nodes from the direct parent in the tree
        const parentPrimaryKey: number | undefined = level === 1 ? nodeEntity?.['parentPrimaryKey'] : undefined
        const title: string | undefined = this.visualiserService.resolveRepresentativeTitleForEntityResult(
            nodeEntity,
            entityRepresentativeAttributes
        )
        const requested: boolean | undefined = nodeResult['requested']
        const childrenCount: number | undefined = nodeResult['childrenCount']
        const queriedEntityCount: number | undefined = nodeResult['queriedEntityCount']

        const children: VisualisedHierarchyTreeNode[] = []
        const childResults: Result[] | undefined = nodeResult['children']
        if (childResults && childResults.length > 0) {
            for (const childResult of childResults) {
                const childNode: VisualisedHierarchyTreeNode = this.resolveHierarchyTreeNode(
                    childResult,
                    level + 1,
                    nodeCountHolder,
                    requestedNodeHolder,
                    entityRepresentativeAttributes
                )
                children.push(childNode)
            }
        }

        const node: VisualisedHierarchyTreeNode = new VisualisedHierarchyTreeNode(
            primaryKey,
            parentPrimaryKey,
            title,
            requested,
            childrenCount,
            queriedEntityCount,
            children
        )
        if (requested) {
            requestedNodeHolder.requestedNode = node
        }

        return node
    }
}

type HierarchyTreeNodeCountHolder = {
    count: number
}

type RequestedHierarchyTreeNodeHolder = {
    requestedNode: VisualisedHierarchyTreeNode | undefined
}
