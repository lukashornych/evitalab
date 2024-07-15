// todo docs
import { DateTime } from '@/modules/connection/model/data-type/DateTime'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import { Long } from '@/modules/connection/model/data-type/Long'

export type Range<T extends DateTime | BigDecimal | Long | number> = [T | undefined, T | undefined]
