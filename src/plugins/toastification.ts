import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css";

export const toast = Toast

export const defaultToastOptions = {
    position: "bottom-right",
    timeout: 15000,
    closeOnClick: false,
    draggable: false,
    transition: "Vue-Toastification__fade",
}
