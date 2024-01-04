import './assets/main.css'

import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
    data() {
        return {
            count: 0
        }
    }
}).mount('#app')