import { HierarchyVisualiserService } from '@/modules/console/result-visualiser/service/HierarchyVisualiserService'
import { EvitaQLResultVisualiserService } from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'
import { Result } from '@/modules/console/result-visualiser/model/Result'
import { VisualisedNamedHierarchy } from '@/modules/console/result-visualiser/model/hierarchy/VisualisedNamedHierarchy'
import { VisualisedHierarchyTreeNode } from '@/modules/console/result-visualiser/model/hierarchy/VisualisedHierarchyTreeNode'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { ReferenceSchema } from '@/modules/connection/model/schema/ReferenceSchema'
import { Entity } from '@/modules/connection/model/data/Entity'
import { Value } from '@/modules/connection/model/Value'
import { Hierarchy } from '@/modules/connection/model/data/Hierarchy'

/**
 * {@link HierarchyVisualiserService} for EvitaQL query language.
 */
export class EvitaQLHierarchyVisualiserService
    implements HierarchyVisualiserService
{
    private visualizerService: EvitaQLResultVisualiserService

    constructor(visualiserService: EvitaQLResultVisualiserService) {
        this.visualizerService = visualiserService
    }
    findNamedHierarchiesByReferencesResults(
        hierarchyResult: Result,
        entitySchema: EntitySchema
    ): [ReferenceSchema | undefined, Result][] {
        const hierarchyDataValue: Value<
            Immutable.Map<string, Hierarchy> | undefined
        > = hierarchyResult as Value<
            Immutable.Map<string, Hierarchy> | undefined
        >
        const hierarchyData = hierarchyDataValue.getIfSupported()
        const newHierarchy: [ReferenceSchema | undefined, Result][] = []
        if (hierarchyData) {
            const references = entitySchema.references.getIfSupported()
            if (references) {
                for (const [hierarchyName, hierarchy] of hierarchyData) {
                    newHierarchy.push([
                        references.get(hierarchyName),
                        hierarchy,
                    ])
                }
            }
        }
        return newHierarchy
    }

    resolveNamedHierarchy(
        namedHierarchyResult: Result[],
        entityRepresentativeAttributes: string[]
    ): VisualisedNamedHierarchy {
        const trees: VisualisedHierarchyTreeNode[] = []
        const nodeCountHolder: HierarchyTreeNodeCountHolder = { count: 0 }
        const requestedNodeHolder: RequestedHierarchyTreeNodeHolder = {
            requestedNode: undefined,
        }

        for (const treeResult of namedHierarchyResult) {
            const tree: VisualisedHierarchyTreeNode =
                this.resolveHierarchyTreeNode(
                    treeResult,
                    1,
                    nodeCountHolder,
                    requestedNodeHolder,
                    entityRepresentativeAttributes
                )
            trees.push(tree)
        }

        return {
            count: nodeCountHolder.count,
            trees,
            requestedNode: requestedNodeHolder.requestedNode,
        }
    }

    private resolveHierarchyTreeNode(
        nodeResult: Result,
        level: number,
        nodeCountHolder: HierarchyTreeNodeCountHolder,
        requestedNodeHolder: RequestedHierarchyTreeNodeHolder,
        entityRepresentativeAttributes: string[]
    ): VisualisedHierarchyTreeNode {
        nodeCountHolder.count++

        const entity: Entity = nodeResult.value as Entity

        const primaryKey: number | undefined =
            entity.primaryKey.getIfSupported()
        // only root nodes should display parents, we know parents in nested nodes from the direct parent in the tree
        const parentPrimaryKey: number | undefined =
            level === 1 ? entity.parent.getIfSupported() : undefined
        const title: string | undefined =
            this.visualizerService.resolveRepresentativeTitleForEntityResult(
                entity,
                entityRepresentativeAttributes
            )
        const requested: boolean | undefined = nodeResult['requested']
        const childrenCount: number | undefined = nodeResult['childrenCount']
        const queriedEntityCount: number | undefined =
            nodeResult['queriedEntityCount']

        const children: VisualisedHierarchyTreeNode[] = []
        const childResults: Result[] | undefined = nodeResult['children']
        if (childResults && childResults.length > 0) {
            for (const childResult of childResults) {
                const childNode: VisualisedHierarchyTreeNode =
                    this.resolveHierarchyTreeNode(
                        childResult,
                        level + 1,
                        nodeCountHolder,
                        requestedNodeHolder,
                        entityRepresentativeAttributes
                    )
                children.push(childNode)
            }
        }

        const node: VisualisedHierarchyTreeNode =
            new VisualisedHierarchyTreeNode(
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
