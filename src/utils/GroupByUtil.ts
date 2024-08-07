export class GroupByUtil {
    public static groupBy<T>(array: T[], key: keyof T): Grouped<T> {
        return array.reduce((acc, obj) => {
            const property = obj[key]
            const groupKey =
                property != undefined ? property.toString() : 'undefined'
            if (!acc[groupKey]) {
                acc[groupKey] = []
            }
            acc[groupKey].push(obj)
            return acc
        }, {} as Grouped<T>)
    }
}

export type Grouped<T> = {
    [key: string]: T[]
}
