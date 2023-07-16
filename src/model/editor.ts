import { v4 as uuidv4 } from 'uuid';

/**
 * Request to instantiate a new editor tab.
 */
export abstract class TabRequest {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly component: any
    readonly componentProps: object

    protected constructor(title: string, icon: string, component: any, componentProps: object) {
        this.id = uuidv4()
        this.title = title
        this.icon = icon
        this.component = component
        this.componentProps = componentProps
    }
}
