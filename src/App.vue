<template>
  <div id="app">
    <Loading :active.sync="isLoading" :opacity="0.9" :color="'#11787A'" :background-color="'#000'"></Loading>
    <div class="pos-f-t">
      <nav class="navbar d-flex align-items-center">
        <div class='nav-item d-flex align-items-center'>
          <img src="./assets/images/logo.png" alt="口罩即時查">
          <h1 class="mt-2">口罩即時查</h1>
        </div>
        <ul class="d-none d-sm-flex ml-auto my-auto">
          <li class="nav-item px-1 py-1" @click="menuOnselect = '口罩供給現況'"
          :class="{'nav-item__active': menuOnselect === '口罩供給現況'}">口罩供給現況</li>
          <li class="nav-item px-1 py-1 ml-2" @click="openImg;menuOnselect = '怎麼買'"
          :class="{'nav-item__active': menuOnselect === '怎麼買'}" data-toggle="modal" data-target="#instruction">怎麼買</li>
          <Googlesigninbutton 
            @sign-in="oAuthSignIn('google', $event)" v-if="user==null">
          </Googlesigninbutton>
          <li class="nav-item px-1 py-1 nav-item-line" @click.prevent="login()" v-if="user==null"><img src="./assets/images/btn_login_base.png"></li>
          <li class="nav-item px-1 py-1" v-else>Hi {{ user }}</li>
          <li class="nav-item px-1 py-1">
            <button class="btn btn-logout" v-if="user !== null && loginWith === 'google'" 
              @click.prevent="logoutGoogle()">登出</button>
            <button class="btn btn-logout" v-if="user !== null && loginWith === 'line'" 
              @click.prevent="logout()">登出</button>
          </li>
        </ul>
        <input type="checkbox" id="navi-toggle" class="d-none input-collapse">
        <label for="navi-toggle" class="d-block d-sm-none ml-auto my-auto btn-collapse navbar-toggler" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        </label>
      </nav>
      <div class="collapse" id="collapseExample">
        <ul class="collapse-ul pl-0 mb-0">
          <li class="nav-item px-3 py-3" @click="menuOnselect = '口罩供給現況'"
          :class="{'nav-item__active': menuOnselect === '口罩供給現況'}">口罩供給現況</li>
          <li class="nav-item px-3 py-3" @click="openImg;menuOnselect = '怎麼買'"
          :class="{'nav-item__active': menuOnselect === '怎麼買'}" data-toggle="modal" data-target="#instruction">怎麼買</li>
        </ul>
      </div>
    </div>
    <div class="row no-gutters content">
      <Sidebar :allData.sync="data" @reloadData="getData" :userPosition="userPosition" @changeCenter="updatePosition" :calcMaskstatus="calcMaskstatus" :adultnum="adultnum" :childnum="childnum"></Sidebar>
      <Map :allData.sync="data" :userPosition="userPosition" :calcMaskstatus="calcMaskstatus" :adultnum="adultnum" :childnum="childnum" ref="mapinfo"></Map>
    </div>
    <footer class="p-4">
      <p>防疫專線 1922 ｜ 口罩資訊 1919</p>
    </footer>
    <div class="modal fade" id="instruction" role="dialog" aria-hidden="true" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <img src="./assets/images/RULE.png" alt="怎麼買" class="instruction-img">
          <img src="./assets/images/ic_close@2x.png" alt="close" @click="closeImg"
          class="close-modal">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Sidebar from './components/Sidebar.vue';
import Map from './components/Map.vue';
import Qs from 'qs';
import jwt from 'jwt-decode';
import jwtDecode from 'jwt-decode';
import Googlesigninbutton from './components/GoogleSigninButton';

export default {
  name: 'App',
  components: {
    Sidebar,
    Map,
    Googlesigninbutton
  },
  data() {
    return {
      menuOnselect: '口罩供給現況',
      data: null,
      userPosition: [25.033671, 121.564427],
      adultnum: 800,
      childnum: 1000,
      query: '',
      user: null,
      userid: null,
      loginWith: ''
    };
  },
  computed: {
    isLoading() {
      const vm = this;
      return !vm.data;
    },
  },
  methods: {
    updatePosition(newPosition){
      const vm = this;
      const { map } = vm.$refs.mapinfo;
      map.setView(newPosition, 16);
    },
    closeImg() {
      $('#instruction').modal('hide');
      this.menuOnselect = '口罩供給現況';
    },
    openImg() {
      $('#instruction').modal('show');
    },
    getData() {
      const vm = this;
      vm.data = null;
      vm.$http.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json').then((response) => {
        vm.data = response.data.features;
        console.log(response.data.features);
      });
    },
    calcMaskstatus(num, limit) {
      if (num === 0) {
        return 'Maskstatus--zero';
      } else if(num <= limit * 0.1) {
        return 'Maskstatus--insufficient';
      } else {
        return 'Maskstatus--sufficient';
      }
    },
    randomString(length){
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
    },
    login() {
      let randomState = this.randomString(8);
      this.loginWith = 'line';
      console.log(randomState);
      let URL = 'https://access.line.me/oauth2/v2.1/authorize?';
      URL += '&response_type=code';
      URL += '&client_id=1656094239';
      URL += '&redirect_uri=https://huai-sian.github.io/maskmapvue/';
      URL += `&state=${randomState}`;
      URL += '&scope=profile%20openid%20email';
      URL += 'nonce=09876xyz';
      console.log(URL);
      window.open(URL,'_self');
    },
    getParameterByName(name, url = window.location.href) {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getInfo() {
      if(this.getParameterByName('code')) {
        let code = this.getParameterByName('code');
        let data = Qs.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'https://huai-sian.github.io/maskmapvue/',
          client_id: '1656094239',
          client_secret: '989bbca9b6564276fe790225af008cff',
        });
        console.log('if');
        this.$http.post('https://api.line.me/oauth2/v2.1/token', data, { headers: { 'content-type': 'application/x-www-form-urlencoded'}}).then((res) => {
          console.log('pass');
          console.log(res.data);
          let newcookie = `access_token=${res.data['access_token']}`;
          document.cookie = newcookie;
          console.log(jwtDecode(res.data.id_token));
          let decoded = jwtDecode(res.data.id_token);
          this.user = decoded.name;
          this.userid = decoded.sub;
          // jwtDecode(res.data.id_token) sample structure:
          /*{amr: ["linesso"] - authentication method
            aud: "xxxx" -channel id
            exp: xxxx -expiry date of id token
            iat: xxxx -id token generated time
            iss: "https://access.line.me" 
            name: "xx"
            picture: "xxx""
            sub: "xxx" - id } */
        })
      } else {
        this.getloginData();
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },
    logout() {
      let data = Qs.stringify({
        client_id: '1656094239',
        client_secret: '989bbca9b6564276fe790225af008cff',
        access_token: `${this.getCookie('access_token')}`
      });
      this.$http.post('https://api.line.me/oauth2/v2.1/revoke', data, { headers: { 'content-type': 'application/x-www-form-urlencoded'}}).then((res) => {
        console.log('logout');
        this.user = null;
        this.userid = null;
        console.log(res.data);
        let newcookie = `access_token=''`;
          document.cookie = newcookie;
      });
    },
    getloginData() {
      if(this.getCookie('access_token')) {
        let access_token = this.getCookie('access_token');
        this.$http.get('https://api.line.me/v2/profile', { headers: { Authorization: `Bearer ${access_token}` }}).then((res) => {
            console.log('get cookie');
            console.log(res.data);
            this.loginWith === 'line'
            this.user = res.data.displayName;
            this.userid = res.data.userId;
        }).catch((err) => {
          this.user = null;
          this.userid = null;
        })
      }
    },
    oAuthSignIn(provider, obj) {
      this.loginWith = 'google';
      console.log(obj);
      this.user = obj.name;
    },
    logoutGoogle() {
      const auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut()
      .then(() => {
        console.log('Google User signed out.');
        this.user = null;
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },
  created() {
    const vm = this;
    vm.getData();
  },
  mounted() {
    const vm = this;
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      vm.userPosition = [latitude, longitude];
    });
    this.getInfo();
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/all.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
