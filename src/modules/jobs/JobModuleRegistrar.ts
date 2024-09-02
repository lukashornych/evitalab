import { ModuleContextBuilder } from "@/ModuleContextBuilder";
import { ModuleRegistrar } from "@/ModuleRegistrar";
import { EvitaDBDriverResolver, evitaDBDriverResolverInjectionKey } from "../connection/driver/EvitaDBDriverResolver";
import { JobService, jobServiceInjectionKey } from "./services/JobService";

export class JobModuleRegistrar implements ModuleRegistrar {
    register(builder: ModuleContextBuilder): void {
        const evitaDBDriverResolver: EvitaDBDriverResolver = builder.inject(evitaDBDriverResolverInjectionKey)
        const jobService: JobService = new JobService(evitaDBDriverResolver)
        builder.provide(jobServiceInjectionKey, jobService)
    }
}