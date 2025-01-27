<script setup lang="ts">

/**
 * Select input for selected label by name and values.
 */

import { Label } from '@/modules/connection/model/traffic/Label'
import Immutable from 'immutable'

const props = withDefaults(
    defineProps<{
        label?: string,
        hint?: string,
        clearable?: boolean,
        hideDetails?: boolean,
        labelNamesProvider: (nameStartsWith: string) => Promise<Immutable.List<string>>,
        labelValuesProvider: (labelName: string, valueStartsWith: string) => Promise<Immutable.List<string>>
    }>(),
    {
        label: undefined,
        hint: undefined,
        clearable: false,
        hideDetails: false,
    }
)
const model = defineModel<Label[]>({ required: true })

function clear(): void {
    model.value = []
}
</script>

<template>
    <VTextField
        :clearable="clearable"
        :hide-details="hideDetails"
        @click:clear="clear"
    />
</template>

<style lang="scss" scoped>

</style>
