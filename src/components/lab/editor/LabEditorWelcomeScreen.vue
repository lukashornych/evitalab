<script setup lang="ts">

const version: string = import.meta.env.VITE_BUILD_VERSION || '?'

</script>

<template>
    <div class="editor-welcome-screen">
        <div class="editor-welcome-screen-hero">
            <header class="editor-welcome-screen-hero__header">
                <VImg
                    width="160"
                    height="160"
                    alt="evitaLab Logo"
                    src="/evita-lab-logo.svg"
                    class="mx-auto mb-1 evita-lab-logo"
                />
                <h1 class="font-weight-bold mb-2" style="font-size: 4.375rem;">evitaLab</h1>
                <p class="text-white" style="font-size: 1rem;">{{ version }} <a class="text-primary-lightest text-body-2" href="https://github.com/lukashornych/evitalab/releases" target="_blank">(changelog)</a></p>
                <p class="text-gray-light mb-10" style="font-size: 1rem;">evitaDB web client</p>
            </header>

            <div class="editor-welcome-screen-blog">
                <a href="https://evitadb.io/blog/07-advanced-features-on-developers-portal?lang=evitaql" target="_blank">
                    <span class="editor-welcome-screen-blog-img__wrap">
                        <img class="Blog_BlogMotive__72hVr" height="160" width="480" src="https://raw.githubusercontent.com/FgForrest/evitaDB/dev/documentation/blog/en/assets/images/07-advanced-features-on-developers-portal.jpg" alt="Image - Discover the Advanced Features on our Developers Portal">
                    </span>
                    <span class="editor-welcome-screen-blog-item__title">Discover the Advanced Features on our Developers Portal</span>
                </a>
                <a href="https://evitadb.io/blog/06-document-examples-testing?lang=evitaql" target="_blank">
                    <span class="editor-welcome-screen-blog-img__wrap">
                        <img class="Blog_BlogMotive__72hVr" height="160" width="480" src="https://raw.githubusercontent.com/FgForrest/evitaDB/dev/documentation/blog/en/assets/images/06-document-examples-testing.png" alt="Image - Validating examples in documentation using JUnit 5 and JShell">
                    </span>
                    <span class="editor-welcome-screen-blog-item__title">Validating examples in documentation using JUnit 5 and JShell</span>
                </a>

            </div>

            <span class="editor-welcome-screen-hr">&nbsp;</span>

            <ul class="editor-welcome-screen-hero__links">
                <li>Check out the <a href="https://evitadb.io/documentation" target="_blank"> evitaDB documentation</a></li>
                <li>Give us a ⭐ on <a href="https://github.com/lukashornych/evitalab/" target="_blank"> GitHub</a></li>
                <li>Reach out to us on <a href="https://discord.gg/VsNBWxgmSw" target="_blank"> Discord</a></li>
                <li><a href="https://github.com/lukashornych/evitalab/issues" target="_blank"> Submit an issue</a></li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

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
    width: 100%;
    padding: 0 2rem;
    height: 100%;
    overflow: auto;

    @media (min-width: 97.5rem) {
        padding: 0 8rem;
    }

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

.editor-welcome-screen-hero__header {
    flex: 1;
    padding-top: 12vh;
}

.editor-welcome-screen-blog {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin: auto auto 1.875rem auto;
    gap: 1.25rem;

    a {
        text-decoration: none;
        max-width: 28.75rem;
        display: flex;
        align-items: center;
        flex-direction: column;

        &:hover {
            text-decoration: none;

            img {
                scale: 1.05;
            }
        }
    }

    img {
        max-width: 100%;
        height: auto;
        transition: all .2s linear;
        transform-origin: center center;
    }

}

.editor-welcome-screen-blog-img__wrap {
    display: flex;
    overflow: hidden;
    margin-bottom: 0.625rem;
}

.editor-welcome-screen-blog-item__title {
    color: white;
    font-weight: bold;
}

.editor-welcome-screen-hr {
    height: 0.0625rem;
    background: #4F4F4F;
    margin-top: 1.875rem;
}

.editor-welcome-screen-hero__links {
    margin: 0 auto;
    padding: 1.875rem 0;
    max-width: 42.1875rem;
    display: block;
    list-style: none;

    li {
        display: inline-flex;
        margin: 0.5rem 0;
        font-size: 1rem;

        +li {
            margin-left: 1.875rem;
        }
    }

    a {
        margin-left: 0.5rem;
        color: $primary-lightest;
        transition: all .2s linear;

        &:hover {
            color: white;
        }
    }
}

@-webkit-keyframes fade-in-fwd {
    0% {
        -webkit-transform: translateZ(-5rem);
        transform: translateZ(-5rem);
        opacity: 0;
    }
    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}
@keyframes fade-in-fwd {
    0% {
        -webkit-transform: translateZ(-5rem);
        transform: translateZ(-5rem);
        opacity: 0;
    }
    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}
.evita-lab-logo {
    -webkit-animation: fade-in-fwd 2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: fade-in-fwd 2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
</style>
