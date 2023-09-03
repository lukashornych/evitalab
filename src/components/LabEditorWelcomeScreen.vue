<script setup lang="ts">
function openEvitaDBDocumentation() {
    window.open('https://evitadb.io/documentation', '_blank')
}

function openGitHub() {
    window.open('https://github.com/lukashornych/evitalab/', '_blank')
}

function openDiscord() {
    window.open('https://discord.gg/VsNBWxgmSw', '_blank')
}

function openGitHubIssues() {
    window.open('https://github.com/lukashornych/evitalab/issues', '_blank')
}
</script>

<template>
    <div class="editor-welcome-screen">
        <div class="editor-welcome-screen-hero">
            <header class="editor-welcome-screen-hero__header">
                <h1 class="text-h2">evitaLab</h1>
                <!-- todo lho autoload -->
                <span class="text-caption">alpha 0.1.0</span>
                <p class="text-subtitle-1 mt-2">User-friendly evitaDB client</p>
            </header>

            <div class="editor-welcome-screen-hero__links">
                <VBtn
                    prepend-icon="mdi-book"
                    @click="openEvitaDBDocumentation"
                >
                    Checkout evitaDB documentation
                </VBtn>
                <VBtn
                    prepend-icon="mdi-github"
                    @click="openGitHub"
                >
                    Star as on GitHub
                </VBtn>
                <VBtn
                    prepend-icon="mdi-comment-quote"
                    @click="openDiscord"
                >
                    Reach out on Discord
                </VBtn>
                <VBtn
                    prepend-icon="mdi-bug"
                    @click="openGitHubIssues"
                >
                    Submit an issue
                </VBtn>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.editor-welcome-screen {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: grid;
    justify-items: center;
    align-items: center;
}

.editor-welcome-screen-hero {
    display: flex;
    flex-direction: column;

    &__header {
        text-align: center;
    }

    &__links {
        margin-top: 2.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
