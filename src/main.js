import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.css'
import axios from './axios/axios'
import * as echarts from 'echarts'
const app = createApp(App)
app.config.globalProperties.$http = axios

app.echarts = echarts
app.use(router).use(ElementPlus).mount('#app')
