<script setup lang="ts">

/**
 * Allows specifying filter for traffic records history
 */

import { TrafficRecordHistoryCriteria } from '@/modules/traffic-viewer/model/TrafficRecordHistoryCriteria'
import VDateTimeInput from '@/modules/base/component/VDateTimeInput.vue'
import { DateTime, Duration } from 'luxon'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { Label } from '@/modules/connection/model/traffic/Label'
import { TrafficViewerService, useTrafficViewerService } from '@/modules/traffic-viewer/service/TrafficViewerService'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { TrafficRecordHistoryDataPointer } from '@/modules/traffic-viewer/model/TrafficRecordHistoryDataPointer'
import Immutable from 'immutable'
import {
    convertUserToSystemRecordType,
    UserTrafficRecordType
} from '@/modules/traffic-viewer/model/UserTrafficRecordType'
import VLabelSelect from '@/modules/traffic-viewer/components/VLabelSelect.vue'

const trafficViewerService: TrafficViewerService = useTrafficViewerService()
const { t } = useI18n()

const userTrafficRecordTypeItems: any[] = Object.values(UserTrafficRecordType).map(type => {
    return {
        value: type,
        title: t(`trafficViewer.recordHistory.filter.form.types.type.${type}`)
    }
})

const props = defineProps<{
    dataPointer: TrafficRecordHistoryDataPointer
}>()
const model = defineModel<TrafficRecordHistoryCriteria>({ required: true })

const form = ref<HTMLFormElement | null>(null)
const formValidationState = ref<boolean | null>(null)

const since = ref<DateTime | undefined>(model.value.since?.toDateTime())
watch(since, async (newValue) => {
    if (await assertFormValidated()) {
        model.value.since = newValue != undefined
            ? OffsetDateTime.fromDateTime(newValue)
            : undefined
    }
})

const types = ref<UserTrafficRecordType[]>(
    model.value.types != undefined
        ? model.value.types
        : []
)
watch(types, async (newValue) => {
    if (await assertFormValidated()) {
        model.value.types = newValue
    }
})

const sessionId = ref<string>(model.value.sessionId?.toString() || '')
watch(sessionId, async (newValue) => {
    if (await assertFormValidated()) {
        model.value.sessionId = newValue != undefined
            ? newValue.trim().length > 0
                ? Uuid.fromCode(newValue)
                : undefined
            : undefined
    }
})
const sessionIdRules = [
    (value: string): any => {
        if (value == undefined || value === '') {
            return true
        }
        const uuidPattern: RegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
        if (!uuidPattern.exec(value)) {
            return t('trafficViewer.recordHistory.filter.form.sessionId.validations.notUuid')
        }
        return true
    }
]

const longerThan = ref<string>(
    model.value.longerThan != undefined
        ? String(model.value.longerThan.toMillis())
        : ''
)
const longerThanRules = [
    (value: string): any => {
        if (value == undefined || value === '') {
            return true
        }
        let number: bigint
        try {
            number = BigInt(value)
        } catch (e) {
            return t('trafficViewer.recordHistory.filter.form.longerThan.validations.notNumber')
        }
        if (number < 0) {
            return t('trafficViewer.recordHistory.filter.form.longerThan.validations.outOfRange')
        }
        return true
    }
]
watch(longerThan, async (newValue) => {
    if (await assertFormValidated()) {
        model.value.longerThan = newValue == undefined
            ? undefined
            : newValue.trim().length > 0
                ? Duration.fromMillis(Number(newValue.trim()))
                : undefined
    }
})

const fetchingMoreBytesThan = ref<string>(
    model.value.fetchingMoreBytesThan != undefined
        ? String(model.value.fetchingMoreBytesThan)
        : ''
)
const fetchingMoreBytesThanRules = [
    (value: string): any => {
        if (value == undefined || value === '') {
            return true
        }
        const number: number = Number(value)
        if (Number.isNaN(number) || !Number.isInteger(number)) {
            return t('trafficViewer.recordHistory.filter.form.fetchingMoreBytesThan.validations.notNumber')
        }
        if (number < 0) {
            return t('trafficViewer.recordHistory.filter.form.fetchingMoreBytesThan.validations.outOfRange')
        }
        return true
    }
]
watch(fetchingMoreBytesThan, async (newValue) => {
    if (await assertFormValidated()) {
        model.value.fetchingMoreBytesThan = newValue == undefined
            ? undefined
            : newValue.trim().length > 0
                ? Number(newValue.trim())
                : undefined
    }
})

const labels = ref<Label[]>(model.value.labels || [])
watch(labels, async (newValue) => {
    if (await assertFormValidated()) {
        model.value.labels = newValue
    }
})

async function loadLabelNames(nameStartsWith: string): Promise<Immutable.List<string>> {
    return trafficViewerService.getLabelNames(
        props.dataPointer.connection,
        props.dataPointer.catalogName,
        nameStartsWith,
        10
    )
}

async function loadLabelValues(labelName: string, valueStartsWith: string): Promise<Immutable.List<string>> {
    return trafficViewerService.getLabelValues(
        props.dataPointer.connection,
        props.dataPointer.catalogName,
        labelName,
        valueStartsWith,
        10
    )
}


async function assertFormValidated(): Promise<boolean> {
    if (form.value == undefined) {
        throw new UnexpectedError('Missing form reference.')
    }

    //@ts-ignore
    const { valid }: any = await form.value.validate()
    return valid
}
</script>

<template>
    <VForm
        v-model="formValidationState"
        ref="form"
        validate-on="blur"
        class="record-history-filter"
    >
        <span class="record-history-filter__label text-disabled">{{ t('trafficViewer.recordHistory.filter.label') }}:</span>
        <VTooltip>
            <template #activator="{ props }">
                <VDateTimeInput
                    v-model="since"
                    :label="t('trafficViewer.recordHistory.filter.form.since.label')"
                    hide-details
                    clearable
                    class="record-history-filter__input"
                    v-bind="props"
                />
            </template>
            <template #default>
                {{ t('trafficViewer.recordHistory.filter.form.since.hint') }}
            </template>
        </VTooltip>
        <VTooltip>
            <template #activator="{ props }">
                <VSelect
                    v-model="types"
                    :items="userTrafficRecordTypeItems"
                    :label="t('trafficViewer.recordHistory.filter.form.types.label')"
                    multiple
                    clearable
                    hide-details
                    class="record-history-filter__input"
                    v-bind="props"
                >
                    <template #selection="{ index }">
                        <span
                            v-if="index === 0"
                            class="text-grey text-caption align-self-center"
                        >
                            {{ t('trafficViewer.recordHistory.filter.form.types.valueDescriptor', { count: types.length }) }}
                          </span>
                    </template>
                </VSelect>
            </template>
            <template #default>
                {{ t('trafficViewer.recordHistory.filter.form.types.hint') }}
            </template>
        </VTooltip>
        <VTooltip>
            <template #activator="{ props }">
                <VTextField
                    v-model="sessionId"
                    :label="t('trafficViewer.recordHistory.filter.form.sessionId.label')"
                    :rules="sessionIdRules"
                    clearable
                    hide-details
                    class="record-history-filter__input"
                    v-bind="props"
                />
            </template>
            <template #default>
                {{ t('trafficViewer.recordHistory.filter.form.sessionId.hint') }}
            </template>
        </VTooltip>
        <VTooltip>
            <template #activator="{ props }">
                <VTextField
                    v-model="longerThan"
                    :label="t('trafficViewer.recordHistory.filter.form.longerThan.label')"
                    :suffix="t('trafficViewer.recordHistory.filter.form.longerThan.unit')"
                    :rules="longerThanRules"
                    clearable
                    hide-details
                    class="record-history-filter__input"
                    v-bind="props"
                />
            </template>
            <template #default>
                {{ t('trafficViewer.recordHistory.filter.form.longerThan.hint') }}
            </template>
        </VTooltip>
        <VTooltip>
            <template #activator="{ props }">
                <VTextField
                    v-model="fetchingMoreBytesThan"
                    :label="t('trafficViewer.recordHistory.filter.form.fetchingMoreBytesThan.label')"
                    :suffix="t('trafficViewer.recordHistory.filter.form.fetchingMoreBytesThan.unit')"
                    :rules="fetchingMoreBytesThanRules"
                    clearable
                    hide-details
                    class="record-history-filter__input"
                    v-bind="props"
                />
            </template>
            <template #default>
                {{ t('trafficViewer.recordHistory.filter.form.fetchingMoreBytesThan.hint') }}
            </template>
        </VTooltip>
        <VTooltip>
            <template #activator="{ props }">
                <VLabelSelect
                    v-model="labels"
                    :label="t('trafficViewer.recordHistory.filter.form.labels.label')"
                    :label-names-provider="loadLabelNames"
                    :label-values-provider="loadLabelValues"
                    clearable
                    hide-details
                    class="record-history-filter__input"
                    v-bind="props"
                />
            </template>
            <template #default>
                {{ t('trafficViewer.recordHistory.filter.form.labels.hint') }}
            </template>
        </VTooltip>
    </VForm>
</template>

<style lang="scss" scoped>
.record-history-filter {
    width: 100%;
    height: 3.5rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    padding: 0.5rem;
    // todo lho not working properly
    overflow-x: auto;

    &__label {
        flex: 0;
        padding: 0 0.25rem;
        display: block;
    }

    &__input {
        flex: 1;
        min-width: 10rem;
    }
}
</style>
