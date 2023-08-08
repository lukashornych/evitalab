import { v4 as uuidv4 } from 'uuid';
import { DefineComponent } from 'vue/dist/vue'

/**
 * Request to instantiate a new editor tab.
 */
export abstract class TabRequest<P extends TabRequestComponentProps> {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly component: DefineComponent<any, any, any>
    readonly componentProps: P

    /**
     * Indicates whether this tab has been visited by the user or not.
     */
    new: boolean = true

    protected constructor(title: string, icon: string, component: DefineComponent<any, any, any>, componentProps: P) {
        this.id = uuidv4()
        this.title = title
        this.icon = icon
        this.component = component
        this.componentProps = componentProps
    }
}

/**
 * Interface that is supposed to represent props of a component that is used to render inside a tab.
 */
export interface TabRequestComponentProps {}
