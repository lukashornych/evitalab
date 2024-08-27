import { ModuleContextBuilder } from "@/ModuleContextBuilder";
import { ModuleRegistrar } from "@/ModuleRegistrar";
import { EvitaDBDriverResolver, evitaDBDriverResolverInjectionKey } from "../connection/driver/EvitaDBDriverResolver";
import { BackupsService, backupsServiceInjectionKey } from "./service/BackupsService";

//TODO: docs
export class BackupsModuleRegistrar implements ModuleRegistrar {
    register(builder: ModuleContextBuilder): void {
        const evitaDBDriverResolver: EvitaDBDriverResolver = builder.inject(evitaDBDriverResolverInjectionKey)
        const backupService: BackupsService = new BackupsService(evitaDBDriverResolver)
        builder.provide(backupsServiceInjectionKey, backupService)
    }

}