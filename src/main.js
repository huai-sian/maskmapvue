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
Vue.component('Loading', Loading);

new Vue({
  created() {
    //Google Sign-in initial
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '282789078464-1efvjomt8lteont9btgp60gjo65mvebt.apps.googleusercontent.com',
      });
    });
    // window.onload = function () {
    //   google.accounts.id.initialize({
    //     client_id: "282789078464-1efvjomt8lteont9btgp60gjo65mvebt.apps.googleusercontent.com",
    //   });
    //   console.log(google.accounts.id);
    //   google.accounts.id.renderButton(
    //     document.getElementById("buttonDiv"),
    //     { theme: "outline", size: "large" }  // customization attributes
    //   );
    // }
  },
  render: (h) => h(App),
}).$mount('#app');
