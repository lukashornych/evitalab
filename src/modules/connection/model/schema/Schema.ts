import { List as ImmutableList } from 'immutable'

// todo docs
export abstract class Schema {
    /**
     * Returns representative flags for this schema. Should return flags that helps end user to visualise how the schema
     * is configured.
     */
    abstract getRepresentativeFlags(): ImmutableList<string>

    protected formatDataTypeForFlag(dataType: string): string {
        return dataType
            .replace('ComplexDataObject', 'Object')
            .replace('Array', '[]')
    }
}
