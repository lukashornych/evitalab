import { DefineComponent, Raw } from 'vue'

/**
 * Represents a tool window. Tool window component can contain anything that classifies as "tool window".
 */
export interface ToolWindow {
    /**
     * Globally unique identifier
     */
    id: string,
    /**
     * Title of the tool window for the UI
     */
    title: string
    /**
     * Icon of the tool window for the UI
     */
    icon: string,
    /**
     * Component representing the actual tool window that will be renderer.
     */
    component: Raw<DefineComponent<any, any, any>>
}

