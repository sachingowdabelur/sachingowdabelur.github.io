import './assets/main.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import vue3PhotoPreview from 'vue3-photo-preview';
import 'vue3-photo-preview/dist/index.css';
import { VueDraggableNext } from 'vue-draggable-next';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App)

app.use(router)
//app.use(VueSidebarMenu)
app.use(vue3PhotoPreview)
app.use(Vue3Toasity, {
    autoClose: 3000,
  } as ToastContainerOptions);
app.component('EasyDataTable', Vue3EasyDataTable);
app.component('draggable', VueDraggableNext);
app.mount('#app')

