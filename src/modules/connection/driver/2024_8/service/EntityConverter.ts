import { Entity } from '@/modules/connection/model/data/Entity'
import { Entity as DriverEntity } from '../model/model'
import { Converter } from '@/modules/connection/driver/2024_8/service/Converter'

/**
 * Converts driver's representation of entity into evitaLab's representation of entity
 */
export class EntityConverter implements Converter<DriverEntity, Entity> {

    /**
     * Converts driver's representation of entity into evitaLab's representation of entity
     */
    convert(driverEntity: DriverEntity): Entity {
        return driverEntity
    }
}
