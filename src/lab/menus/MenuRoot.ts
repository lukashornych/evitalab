/**
 * Represents a registered place by module where {@link MenuNode}s can be added for user actions.
 */
export interface MenuRoot {
    /**
     * Global unique identification. Used to identify root under which to register the nodes
     */
    id: string
}
