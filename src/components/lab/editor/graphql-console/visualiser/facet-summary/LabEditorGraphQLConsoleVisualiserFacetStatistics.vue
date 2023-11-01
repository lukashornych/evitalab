<script setup lang="ts">
/**
 * Visualises raw JSON statistics of a single facet.
 */

import { computed } from 'vue'
import VMarkdown from '@/components/base/VMarkdown.vue'
import { UnexpectedError } from '@/model/lab'
import { Toaster, useToaster } from '@/services/editor/toaster'

const toaster: Toaster = useToaster()

const props = defineProps<{
    queryResult: any
    facetResult: any,
    facetRepresentativeAttributes: string[]
}>()


const requested = computed<boolean | undefined>(() => {
    return props.facetResult['requested']
})


const primaryKey = computed<number | undefined>(() => {
    return props.facetResult['facetEntity']?.['primaryKey']
})
const title = computed<string | undefined>(() => {
    const facetEntity = props.facetResult['facetEntity']
    if (!facetEntity) {
        return undefined
    }

    const actualFacetRepresentativeAttributes: (string | undefined)[] = []
    const facetAttributes = facetEntity['attributes'] || {}
    for (const facetAttributeName in facetAttributes) {
        if (!props.facetRepresentativeAttributes.includes(facetAttributeName) && facetAttributeName !== 'title') {
            continue;
        }
        actualFacetRepresentativeAttributes.push(toPrintableAttributeValue(facetAttributes[facetAttributeName]))
    }

    if (actualFacetRepresentativeAttributes.length === 0) {
        return undefined
    }
    return actualFacetRepresentativeAttributes.filter(it => it != undefined).join(', ')
})


const numberOfEntities = computed<number | undefined>(() => {
    return props.queryResult['recordPage']?.['totalRecordCount'] ?? props.queryResult['recordStrip']?.['totalRecordCount']
})
const impactDifference = computed<string | undefined>(() => {
    const difference: number | undefined = props.facetResult['impact']?.['difference']
    if (difference == undefined) {
        return undefined
    }

    return `${difference > 0 ? '+' : ''}${difference}`
})
const impactMatchCount = computed<number | undefined>(() => {
    return props.facetResult['impact']?.['matchCount']
})
const count = computed<number | undefined>(() => {
    return props.facetResult['count']
})


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
    } else {
        toaster.error('No primary key property was fetched.')
    }
}
</script>

<template>
    <VListItem>
        <template #prepend>
            <VCheckboxBtn
                :model-value="requested || false"
                readonly
                :false-icon="impactMatchCount === 0 ? 'mdi-checkbox-blank-off-outline' : 'mdi-checkbox-blank-outline'"
                :class="{ 'text-red': requested == undefined, 'facet-checkbox--disabled': impactMatchCount === 0 }"
            >
                <VTooltip v-if="requested == undefined" activator="parent">
                    <VMarkdown source="The `requested` property was not fetched." />
                </VTooltip>
            </VCheckboxBtn>
        </template>

        <template #title>
            <VListItemTitle class="facet-title">
                <span
                    v-if="primaryKey != undefined"
                    class="text-disabled d-flex align-center"
                    style="cursor: pointer;"
                    @click.stop="copyPrimaryKey"
                >
                    <VIcon size="20" class="mr-1">mdi-key</VIcon>
                    {{ primaryKey }}{{ title ? ':' : '' }}
                </span>
                <span :class="{ 'text-disabled': impactMatchCount === 0 }">
                    {{ title || 'Unknown' }}
                    <VTooltip v-if="!title" activator="parent">
                        <VMarkdown source="No `primaryKey` property or representative attributes were fetched." />
                    </VTooltip>
                    <VTooltip v-if="impactMatchCount === 0" activator="parent">
                        <!-- todo jno review explanation -->
                        No entities would be returned if this facet was requested because no entity has combination of
                        already requested facets plus this one.
                    </VTooltip>
                </span>

                <VChipGroup>
                    <VChip prepend-icon="mdi-numeric-positive-1">
                        <span>
                            {{ numberOfEntities ?? '-' }}
                            <VTooltip activator="parent">
                                <VMarkdown v-if="numberOfEntities == undefined" source="The `totalRecordCount` property was not found in neither `recordPage` nor `recordStrip`." />
                                <!-- todo jno review explanation -->
                                <span v-else>The total number of entities matching the user filter.</span>
                            </VTooltip>
                        </span>
                        <span>&nbsp;/&nbsp;</span>
                        <span>
                            {{ impactDifference ?? '-' }}
                            <VTooltip activator="parent">
                                <VMarkdown v-if="impactDifference == undefined" source="The `impact.difference` property was not found." />
                                <!-- todo jno review explanation -->
                                <span v-else>The difference from the current number of entities matching the user filter if this facet was requested.</span>
                            </VTooltip>
                        </span>
                    </VChip>

                    <VChip prepend-icon="mdi-set-none">
                        {{ impactMatchCount ?? '-' }}
                        <VTooltip activator="parent">
                            <VMarkdown v-if="impactMatchCount == undefined" source="The `impact.matchCount` property was not found." />
                            <!-- todo jno review explanation -->
                            <span v-else>The total number of entities matching the user filter if this facet was requested.</span>
                        </VTooltip>
                    </VChip>

                    <VChip prepend-icon="mdi-counter">
                        {{ count ?? '-' }}
                        <VTooltip activator="parent">
                            <VMarkdown v-if="count == undefined" source="The `count` property was not found." />
                            <!-- todo jno review explanation -->
                            <span v-else>The total number of entities matching this facet without the user filter.</span>
                        </VTooltip>
                    </VChip>
                </VChipGroup>
            </VListItemTitle>
        </template>
    </VListItem>
</template>

<style lang="scss" scoped>
// todo lho better handling for small widths
.facet-title {
    display: flex;
    column-gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.facet-checkbox--disabled {
    opacity: var(--v-disabled-opacity)
}
</style>
