import { UnsupportedValueAccessError } from '@/modules/connection/exception/UnsupportedValueAccessError'

/**
 * Represents a driver model property value with supportability support. This to support cases
 * when a specific version of driver doesn't support particular value of the model. The UI can then
 * handle these cases using this wrapper.
 */
export class Value<T> {
    private readonly supported: boolean
    private readonly actualValue?: T

    private constructor(supported: boolean, actualValue: T) {
        this.supported = supported
        this.actualValue = actualValue
    }

    static notSupported<T>(): Value<T> {
        return new Value(false, undefined as T)
    }

    static of<T>(actualValue: T): Value<T> {
        return new Value(true, actualValue)
    }

    /**
     * Creates new value with transformed the actual value if supported.
     *
     * @param mapper mapper of the actual value if supported
     */
    map<N>(mapper: (value: T) => N): Value<N> {
        if (!this.supported) {
            return Value.notSupported()
        }
        return Value.of(mapper(this.actualValue!))
    }

    /**
     * Whether the actual value is supported.
     */
    isSupported(): boolean {
        return this.supported
    }

    /**
     * Returns the actual value if supported. Otherwise, error is thrown.
     */
    get(): T {
        if (!this.supported) {
            throw new UnsupportedValueAccessError(undefined, `Cannot access unsupported value.`)
        }
        return this.actualValue!
    }

    /**
     * Returns actual value if the value is supported or fallback value if not
     *
     * @param fallbackValue value returned if this value is not supported
     */
    getOrElse(fallbackValue: T): T {
        if (!this.supported) {
            return fallbackValue
        }
        return this.actualValue!
    }
}
