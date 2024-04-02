import { createI18n } from 'vue-i18n'
import en from '@/i18n/en.json'

/**
 * i18n support for entire evitaLab
 */

type MessageSchema = typeof en

export const i18n = createI18n<[MessageSchema], 'en'>({
    legacy: false, // composition API
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en
    }
})
