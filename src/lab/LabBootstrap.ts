// Vue base
import Lab from './Lab.vue'
import { App, createApp } from 'vue'

// evitaLab modules
import moduleBuilders from '@/modules/modules'
import { LabBuilder } from '@/lab/LabBuilder'

/**
 * Bootstraps the entire evitaLab. Boots the entire thing with all of the registered lab modules, Vue plugins and so on.
 */
export class LabBootstrap {

    async boot(): Promise<void> {
        const app: App<Element> = createApp(Lab)

        const labBuilder: LabBuilder = new LabBuilder(app)
        this.buildModules(labBuilder)

        labBuilder.buildAndRegister()
        app.mount('#app')
    }

    private buildModules(labContextBuilder: LabBuilder): void {
        moduleBuilders.forEach(moduleBuilder => moduleBuilder.build(labContextBuilder))
    }
}
