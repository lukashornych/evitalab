import { ModuleBuilder } from '@/lab/ModuleBuilder'
import { GraphQLConsoleModuleBuilder } from '@/modules/graphql-console/GraphQLConsoleModuleBuilder'
import { WorkspaceModuleBuilder } from '@/modules/workspace/WorkspaceModuleBuilder'
import { KeymapModuleBuilder } from '@/modules/keymap/KeymapModuleBuilder'
import { EvitaQLConsoleModuleBuilder } from '@/modules/evitaql-console/EvitaQLConsoleModuleBuilder'
import { EntityGridModuleBuilder } from '@/modules/entity-viewer/EntityGridModuleBuilder'
import { SchemaViewerModuleBuilder } from '@/modules/schema-viewer/SchemaViewerModuleBuilder'
import { ConnectionsModuleBuilder } from '@/modules/connections/ConnectionsModuleBuilder'
import { ErrorViewerModuleBuilder } from '@/modules/error-viewer/ErrorViewerModuleBuilder'
import { ConsoleModuleBuilder } from '@/modules/console/ConsoleModuleBuilder'

/**
 * Registers which modules should be initialized.
 */
export default <ModuleBuilder[]>[
    new WorkspaceModuleBuilder(),
    new KeymapModuleBuilder(),
    new ErrorViewerModuleBuilder(),
    new ConnectionsModuleBuilder(),
    new SchemaViewerModuleBuilder(),
    new EntityGridModuleBuilder(),
    new ConsoleModuleBuilder(),
    new GraphQLConsoleModuleBuilder(),
    new EvitaQLConsoleModuleBuilder()
]
