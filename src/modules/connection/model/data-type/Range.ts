// todo docs
import { DateTime } from '@/modules/connection/model/data-type/DateTime'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'

export type Range<T extends DateTime | BigDecimal | bigint | number> = [T | undefined, T | undefined]
