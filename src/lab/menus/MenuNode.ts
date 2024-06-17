/**
 * Generic node of a context menu. Might be action, separator and so on.
 */
export interface MenuNode {
    /**
     * Globally unique identification of the node.
     */
    id: string
    /**
     * Title of the node to be displayed to the user.
     */
    title: string
}
