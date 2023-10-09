import VueCodemirror from 'vue-codemirror'
import {dracula} from 'thememirror';

// https://thememirror.net/

export const codemirror = VueCodemirror

export const defaultCodemirrorOptions =  {
    extensions: [
        dracula
    ]
}
