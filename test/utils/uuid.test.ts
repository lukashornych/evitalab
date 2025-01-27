import { test, expect } from 'vitest'
import { convertUuidBitsToCode, convertUuidCodeToBits } from '../../src/utils/uuid'

test('Should convert UUID between bits and code both ways', () => {
    testUuid('126f2756-16a7-4be4-9235-d9516159d7b1')
    testUuid('578cdab8-35be-4d22-8912-242c17cdd9a8')
    testUuid('faa93e70-9db3-4ebb-9c82-df01e28bb21d')
})

function testUuid(code: string): void {
    const { mostSignificantBits, leastSignificantBits }: { mostSignificantBits: bigint, leastSignificantBits: bigint } = convertUuidCodeToBits(code)
    expect(convertUuidBitsToCode(mostSignificantBits, leastSignificantBits)).toEqual(code)
}
