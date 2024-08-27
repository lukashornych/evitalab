<template>
    <div>
        <VList>
            <VListItem>
                    <VRow class="align-center">
                        <VCol>
                            <div class="d-flex align-center">
                                <VListItemTitle
                                    >{{ /*item.name*/ }}</VListItemTitle
                                >
                                <VChip
                                    color="grey"
                                    text-color="white"
                                    class="ml-2 small-chip"
                                    
                                    >finished</VChip
                                >
                                <VChip
                                    color="amber"
                                    text-color="white"
                                    class="ml-2 small-chip"
                                    >backing up</VChip
                                >
                            </div>
                        </VCol>
                        <VCol class="d-flex justify-end" cols="auto" >
                            <VBtn icon variant="flat">
                                <VIcon>mdi-download</VIcon>
                            </VBtn>
                            <VBtn icon variant="flat">
                                <VIcon>mdi-database-arrow-right-outline</VIcon>
                            </VBtn>
                        </VCol>
                        <VCol class="d-flex justify-end" cols="auto">
                            <VBtn icon variant="flat">
                                <VIcon>mdi-window-close</VIcon>
                            </VBtn>
                        </VCol>
                    </VRow>
                </VListItem>
        </VList>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>