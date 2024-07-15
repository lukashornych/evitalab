/**
 * Converts evitaDB's representation of a model to evitaLab's equivalent
 */
export interface Converter<D, E> {

    /**
     * Converts evitaDB's representation of a model to evitaLab's equivalent
     */
    convert(driverModel: D): E
}
