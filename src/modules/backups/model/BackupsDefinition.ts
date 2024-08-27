import { TabDefinition } from "@/modules/workspace/tab/model/TabDefinition";
import { BackupTabParams } from "./BackupsTabParams";
import { VoidTabData } from "@/modules/workspace/tab/model/void/VoidTabData";
import { DefineComponent, markRaw } from "vue";
import Backups from "../components/Backups.vue";

export class BackupsDefinition extends TabDefinition<BackupTabParams, VoidTabData> {
    constructor(title: string, params: BackupTabParams) {
        super(undefined,
            title,
            'mdi-cloud-download-outline',
            markRaw(Backups as DefineComponent<any, any, any>),
            params,
            new VoidTabData()
        )
    }
}