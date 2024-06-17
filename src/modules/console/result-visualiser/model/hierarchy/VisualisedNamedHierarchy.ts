import { VisualisedHierarchyTreeNode } from '@/modules/console/result-visualiser/model/VisualisedHierarchyTreeNode'

/**
 * Named hierarchy DTO ready for visualisation
 */
export type VisualisedNamedHierarchy = {
    count?: number
    trees: VisualisedHierarchyTreeNode[]
    requestedNode?: VisualisedHierarchyTreeNode
}
