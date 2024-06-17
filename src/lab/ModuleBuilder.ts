import { LabBuilder } from '@/lab/LabBuilder'

/**
 * Builds and registers a module to the lab app.
 */
export interface ModuleBuilder {

    /**
     * Called during lab initialization. Initializes the module.
     *
     * @param builder lab builder, used to initialize and register module-specific stuff into a global context for UI or as support for
     * other modules.
     */
    build(builder: LabBuilder): void
}
