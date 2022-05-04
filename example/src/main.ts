import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VirtualList from '../../src/index'

const app = createApp(App)

app.component('virtual-list', VirtualList)
app.use(router)

app.mount('#app')
