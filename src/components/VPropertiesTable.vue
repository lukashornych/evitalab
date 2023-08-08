<script setup lang="ts">

const props = defineProps<{
    properties: [string, any][]
}>()
</script>

<template>
    <table class="properties-table">
        <tr
            v-for="property in properties"
            :key="property[0]"
            class="properties-table__row"
        >
            <td class="text-medium-emphasis">{{ property[0] }}</td>
            <td>
                <span v-if="property[1] !== undefined && property[1] !== null">
                    <VCheckbox
                        v-if="typeof property[1] === 'boolean'"
                        v-model="property[1]"
                        disabled
                        density="compact"
                    />
                    <span v-else>
                        {{ property[1] }}
                    </span>
                </span>
                <span
                    v-else
                    class="text-disabled font-weight-light font-italic"
                >
                    &lt;null&gt;
                </span>
            </td>

        </tr>
    </table>
</template>

<style lang="scss" scoped>
.properties-table {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;

    &__row {
        display: inline-grid;
        grid-template-columns: 10rem 1fr;
        column-gap: 0.5rem;
    }
}
</style>
