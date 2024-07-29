// todo docs
import { LocalDateTime } from '@/modules/connection/model/data-type/LocalDateTime'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'

export type Range<T extends LocalDateTime | BigDecimal | bigint | number> = [T | undefined, T | undefined]
