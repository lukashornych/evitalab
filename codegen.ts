/**
 * The codegen is only used for initial generation of the types (usually from demo dataset as template) that
 * is then manually stripped only to generic types that are not dataset-specific.
 */

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    // schema: 'https://demo.evitadb.io:5555/gql/system',
    schema: 'https://demo.evitadb.io:5555/gql/evita/schema',
    documents: ['src/**/*.service.ts'],
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './src/gql/': {
            preset: 'client',
            config: {
                useTypeImports: true
            }
        }
    }
}

export default config
