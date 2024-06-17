import { ModuleBuilder } from '@/lab/ModuleBuilder'
import { LabBuilder } from '@/lab/LabBuilder'
import { SupportedLocale } from '@/lab/vue-plugins/i18n'
import i18nEn from '@/modules/keymap/i18n/en.json'

/**
 * Initializes keymap module. Keymap module provides UI for keyboard shortcuts.
 */
export class KeymapModuleBuilder implements ModuleBuilder {

    build(builder: LabBuilder): void {
        this.registerI18n(builder)
    }

    private registerI18n(builder: LabBuilder): void {
        builder.addI18nTexts(new Map<string, any>([[SupportedLocale.En, i18nEn]]))
    }
}
