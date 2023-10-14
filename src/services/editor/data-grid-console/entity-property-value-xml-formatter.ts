import { EntityPropertyValueFormatter } from '@/services/editor/data-grid-console/entity-property-value-formatter'
import xmlFormat from 'xml-formatter'

/**
 * Tries to format the value as XML. If the value is not a valid XML, it will throw an error.
 */
export class EntityPropertyValueXmlFormatter implements EntityPropertyValueFormatter {

    format(value: any, prettyPrint: boolean = false): string {
        // validates the value as XML, and also pretty prints it if needed
        const formattedXml: string = xmlFormat(value)
        if (prettyPrint) {
            return formattedXml
        } else {
            return value
        }
    }

}
