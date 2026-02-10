#!/usr/bin/env node

import LZString from 'lz-string'

const input = process.argv[2]

if (!input) {
    console.error('Usage: node scripts/decode-serialized-tab-object.mjs "<hash>" or "<url with sharedTab param>"')
    process.exit(1)
}

let hash = input

// Check if input is a URL with sharedTab parameter
if (input.includes('sharedTab=')) {
    try {
        const url = new URL(input)
        const sharedTab = url.searchParams.get('sharedTab')
        if (!sharedTab) {
            console.error('Error: URL does not contain sharedTab parameter')
            process.exit(1)
        }
        hash = sharedTab
    } catch (e) {
        console.error('Error: Invalid URL format')
        process.exit(1)
    }
}

const json = LZString.decompressFromEncodedURIComponent(hash)

if (!json) {
    console.error('Error: Failed to decompress input')
    process.exit(1)
}

try {
    console.log(JSON.stringify(JSON.parse(json), null, 2))
} catch (e) {
    console.error('Error: Decompressed data is not valid JSON')
    console.error('Raw output:', json)
    process.exit(1)
}
