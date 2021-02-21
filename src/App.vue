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

export default {
  name: 'App',
  components: {
    Sidebar,
    Map
  },
  data() {
    return {
      menuOnselect: '口罩供給現況',
      data: null,
      userPosition: [25.033671, 121.564427],
      adultnum: 800,
      childnum: 1000
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
