import { useWelcomeScreenStore, WelcomeScreenStore } from '@/modules/welcome-screen/store/welcomeScreenStore'
import { EvitaDBBlogPost } from '@/modules/welcome-screen/model/EvitaDBBlogPost'
import { EvitaDBDocsClient } from '@/modules/welcome-screen/driver/EvitaDBDocsClient'
import { inject, InjectionKey } from 'vue'

export const key: InjectionKey<WelcomeScreenManager> = Symbol()

/**
 * Manager for data used on welcome screen
 */
export class WelcomeScreenManager {
    private readonly store: WelcomeScreenStore
    private readonly evitaDBDocsClient: EvitaDBDocsClient

    constructor(evitaDBDocsClient: EvitaDBDocsClient) {
        this.store = useWelcomeScreenStore()
        this.evitaDBDocsClient = evitaDBDocsClient
    }

    /**
     * Returns the latest evitaDB blog posts to display on news page.
     */
    getBlogPosts = async (): Promise<EvitaDBBlogPost[]> => {
        let cachedBlogPosts: EvitaDBBlogPost[] | undefined = this.store.blogPosts
        if (cachedBlogPosts == undefined || cachedBlogPosts.length === 0) {
            cachedBlogPosts = await this.evitaDBDocsClient.getBlogPosts()
            this.store.replaceBlogPosts(cachedBlogPosts)
        }
        return cachedBlogPosts
    }
}

export const useWelcomeScreenManager = (): WelcomeScreenManager => {
    return inject(key) as WelcomeScreenManager
}
