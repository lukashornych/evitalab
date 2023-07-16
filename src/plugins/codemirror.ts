import VueCodemirror from 'vue-codemirror'
import { basicSetup } from 'codemirror'
import { materialDark} from 'cm6-theme-material-dark'

export const codemirror = VueCodemirror

export const codemirrorDefaultOptions =  {
    // optional default global options
    extensions: [basicSetup, materialDark]
}
