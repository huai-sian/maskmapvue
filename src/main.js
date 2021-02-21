import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { Icon } from 'leaflet';
import App from './App.vue';
import 'leaflet/dist/leaflet.css';

// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.component('Loading', Loading);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
