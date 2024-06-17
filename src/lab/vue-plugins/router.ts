import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

/**
 * Builds instance of router from passed routes and default config
 */
export const buildRouter = (routes: RouteRecordRaw[]) => createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
