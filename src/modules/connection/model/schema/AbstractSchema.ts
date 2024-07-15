import { Schema } from '@/modules/connection/model/schema/Schema'
import { List as ImmutableList } from 'immutable'

// todo docs
export abstract class AbstractSchema implements Schema {

    abstract getRepresentativeFlags(): ImmutableList<string>

    protected formatDataTypeForFlag(dataType: string): string {
        return dataType
            .replace('ComplexDataObject', 'Object')
            .replace('Array', '[]')
    }
}
