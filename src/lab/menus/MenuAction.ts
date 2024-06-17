import { MenuNode } from '@/lab/MenuNode'

/**
 * Represents a single action of some context menu. When clicked by user, the callback will be called.
 */
export interface MenuAction extends MenuNode {
    /**
     * Icon displayed in the UI
     */
    icon: string

    /**
     * Callback called when user clicks on this action.
     */
    onClick(): void
}
