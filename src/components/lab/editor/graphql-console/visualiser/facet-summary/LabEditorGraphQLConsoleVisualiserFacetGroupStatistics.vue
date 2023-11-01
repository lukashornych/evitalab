<script setup lang="ts">
/**
 * Visualises raw JSON statistics of a single facet group.
 */

import { computed, ref } from 'vue'
import VMarkdown from '@/components/base/VMarkdown.vue'
import { UnexpectedError } from '@/model/lab'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorGraphQLConsoleVisualiserFacetStatistics
    from '@/components/lab/editor/graphql-console/visualiser/facet-summary/LabEditorGraphQLConsoleVisualiserFacetStatistics.vue'

const toaster: Toaster = useToaster()

const props = defineProps<{
    queryResult: any,
    groupResult: any | undefined,
    groupRepresentativeAttributes: string[],
    facetRepresentativeAttributes: string[]
}>()


const primaryKey = computed<number | undefined>(() => {
    return props.groupResult['groupEntity']?.['primaryKey']
})
const title = computed<string | undefined>(() => {
    const groupEntity = props.groupResult['groupEntity']
    if (!groupEntity) {
        return undefined
    }

    const actualGroupRepresentativeAttributes: (string | undefined)[] = []
    const groupAttributes = groupEntity['attributes'] || {}
    for (const groupAttributeName in groupAttributes) {
        if (!props.groupRepresentativeAttributes.includes(groupAttributeName) && groupAttributeName !== 'title') {
            continue;
        }
        actualGroupRepresentativeAttributes.push(toPrintableAttributeValue(groupAttributes[groupAttributeName]))
    }

    if (actualGroupRepresentativeAttributes.length === 0) {
        return undefined
    }
    return actualGroupRepresentativeAttributes.filter(it => it != undefined).join(', ')
})


const count = computed<number | undefined>(() => {
    return props.groupResult['count']
})


const facetsInitialized = ref<boolean>(false)
const facetResults = computed<any[]>(() => {
    if (!facetsInitialized.value) {
        return []
    }
    return props.groupResult['facetStatistics'] || []
})


function initializeFacets(): void {
    // todo lho this makes quick hide of the facet group, it looks weird
    facetsInitialized.value = !facetsInitialized.value
}

// todo lho refactor into common function
function toPrintableAttributeValue(attributeValue: any): string | undefined {
    if (attributeValue == undefined) {
        return undefined
    }
    if (attributeValue instanceof Array) {
        if (attributeValue.length === 0) {
            return undefined
        }
        return `[${attributeValue.map(it => toPrintableAttributeValue(it)).join(', ')}]`
    } else if (attributeValue instanceof Object) {
        return JSON.stringify(attributeValue)
    } else {
        return attributeValue.toString()
    }
}

function copyPrimaryKey(): void {
    if (primaryKey.value != undefined) {
        navigator.clipboard.writeText(`${primaryKey.value}`).then(() => {
            toaster.info('Primary key copied to clipboard.')
        }).catch(() => {
            toaster.error(new UnexpectedError(undefined, 'Failed to copy to clipboard.'))
        })
    }
}

</script>

<template>
    <VListGroup>
        <template #activator="{ props }">
            <VListItem v-bind="props" @click="initializeFacets">
                <VListItemTitle class="group-title">
                    <span
                        v-if="primaryKey != undefined"
                        class="text-disabled d-flex align-center"
                        @click.stop="copyPrimaryKey"
                    >
                         <VIcon size="20" class="mr-1">mdi-key</VIcon>
                        {{ primaryKey }}{{ title ? ':' : '' }}
                    </span>
                    <span>
                        {{ title ?? 'Unknown' }}
                        <VTooltip v-if="!title" activator="parent">
                            <VMarkdown source="No `primaryKey` property or representative attributes were fetched." />
                        </VTooltip>
                    </span>

                    <VChipGroup>
                        <VChip prepend-icon="mdi-counter">
                            <span>
                                {{ count ?? '-' }}
                                <VTooltip activator="parent">
                                    <VMarkdown v-if="count == undefined" source="No `count` property was fetched." />
                                    <!-- todo jno review explanation -->
                                    <span v-else>The total number of entities matching any facet from this group without user filter.</span>
                                </VTooltip>
                            </span>
                        </VChip>
                    </VChipGroup>
                </VListItemTitle>
            </VListItem>
        </template>

        <template v-if="facetsInitialized">
            <LabEditorGraphQLConsoleVisualiserFacetStatistics
                v-for="(facetResult, index) in facetResults"
                :key="index"
                :query-result="queryResult"
                :facet-result="facetResult"
                :facet-representative-attributes="facetRepresentativeAttributes"
            />
        </template>
    </VListGroup>
</template>

<style lang="scss" scoped>
// todo lho better handling for small widths
.group-title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
</style>
