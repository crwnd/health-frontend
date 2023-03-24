import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/main.css'


// import ProductCardInline from "./components/ProductCardInline.vue";
// import ProductListRow from './views/ProductLists/Row.vue'

const app = createApp(App)
// app.component('ProductCardInline', ProductCardInline);
// app.component('ProductListRow', ProductListRow);

app.use(router)
app.mount('#app')
