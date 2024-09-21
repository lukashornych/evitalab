import Immutable from 'immutable'

const stringWithCaseWordSplittingPattern: RegExp = /([^\s\-_A-Z]+)|([A-Z]+[^\s\-_A-Z]*)/g
const unsupportedCharactersForWordSplittingPattern: RegExp = /[.:+\-@/\\|`~]/g

/**
 * Splits string into words.
 * @param s input string to split
 */
export function splitStringWithCaseIntoWords(s?: string): Immutable.List<string> {
    if (s == undefined || s.trim().length === 0) {
        return Immutable.List()
    }

    // remove unsupported characters in concrete cases (not base case)
    const newString: string = s.replaceAll(unsupportedCharactersForWordSplittingPattern, ' ')

    const words: string[] = []
    const results: IterableIterator<RegExpMatchArray> = newString.matchAll(stringWithCaseWordSplittingPattern)
    for (const result of results) {
        words.push(result[0])
    }
    return Immutable.List(words)
}
