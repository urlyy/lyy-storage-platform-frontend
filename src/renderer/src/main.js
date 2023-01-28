import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import 'element-plus/es/components/message/style/css'

const pinia = createPinia()
pinia.use(piniaPluginPersist)
const app = createApp(App)
app
  .use(router)
  .use(pinia)
  // .use(api)
  .mount('#app')
