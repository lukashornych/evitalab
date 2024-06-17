import { createI18n } from 'vue-i18n'

/**
 * Lists all supported locales by evitaLab
 */
export enum SupportedLocale {
    En = 'en'
}

/**
 * Builds i18n instance from passed messages
 */
export const buildI18n = (localizedTexts: Map<string, any>) => {
    const builtMessages: any = {}
    localizedTexts.forEach((texts, locale) => builtMessages[locale] = texts)

    type MessageSchema = typeof builtMessages
    return createI18n<[MessageSchema], SupportedLocale.En>({
        legacy: false, // composition API
        locale: SupportedLocale.En,
        fallbackLocale: SupportedLocale.En,
        messages: builtMessages
    })
}
