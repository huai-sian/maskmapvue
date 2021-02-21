<template>
  <div class="menu col-sm-6 col-md-4 col-xl-3 pb-2 h-100">
    <form class="form-inline">
      <div class="d-flex w-100 mb-2" v-if="!onSearch">
        <select class="w-50 custom-select" v-model="county" @change="searchBy='byselect'">
          <option disabled value>請選擇縣市</option>
          <option v-for="counte in County" :key="counte">{{ counte }}</option>
        </select>
        <select class="w-50 custom-select" v-model="town" @change="'byselect'">
          <option disabled value>請選擇鄉鎮</option>
          <option v-for="townie in Town" :key="townie">{{ townie }}</option>
        </select>
      </div>
      <div class="w-100 search-input">
        <button 
          @click.prevent="
          keyword='';
          onSearch=!onSearch;
          searchBy=''
          "
          class="btn back-btn" v-if="onSearch">
          <i class="fas fa-chevron-left"></i>
        </button>
        <i class="fas fa-search-location magnifier d-sm-none" v-if="!onSearch"></i>
        <input type="text" placeholder="地址/店名" v-model.trim="keyword" @focus="onSearch = true;searchBy='bykeyword'"
          class="form-control ml-auto w-100">
        <button @click.prevent="search(keyword)" class="btn search-btn"><img src="../assets/images/ic_location@2x.png" alt="Search"
          style="width: 24px; height: 24px;"></button>
        <ul class="auto-recommend list-group list-group-flush" v-if="keyword && keyword.length >= 2 && onSearch && filterData.length > 0">
          <li class="list-group-item recommend-item text-left pl-2" v-for="(recommend, i) in filterData" :key="i" @click="search(recommend.properties.address)">
            <i class="fas fa-map-marker-alt mr-2"></i>{{ recommend.properties.name }}
            <p class="recommend-item pl-3 pb-0">{{ recommend.properties.address }}</p>
          </li>
        </ul>
      </div>
    </form>
    <div v-if="onSearch">
      <div class="search-record mt-3">
        <div class="search-record-top px-2 py-2">
          <p class="d-block mb-0">最近5筆搜尋紀錄</p>
          <button @click.prevent="clearKeywords" class="btn d-block btn-clear">清除</button>
        </div>
        <ul class="list-group">
          <li class="list-group-item" v-for="(word, i) in keywords" :key="i" @click="search();keyword=word">{{ word }}</li>
        </ul>
      </div>
    </div>
    <div v-if="!onSearch" class="px-2 pt-2 mb-3">
      <div class='today'>
        <h2>{{ Today }}</h2>
        <span></span>
      </div>
      <div class="d-flex justify-content-between align-items-center search-behavior">
        <div>
          <p v-if="searchBy!=='bykeyword'&&searchBy!=='byselect'" class="mb-0">距離方圓 5公里 以內的供應商</p>
          <p v-if="searchBy==='byselect'" class="mb-0">{{ county }}{{ town }}以內的供應商</p>
          <p v-if="searchBy==='bykeyword'" class="mb-0">搜尋 {{ keyword }} 的供應商</p>
          <p class="mb-0">資訊更新時間: {{ updateTime }}</p>
        </div>
        <button class="btn px-3 btn-reload" @click.prevent="reloadData">重整列表</button>
      </div>
    </div>
    <Card v-if="!onSearch" class="p-1" :filterData.sync="filterData" @changeCenter="emitNewcenter" :calcMaskstatus="calcMaskstatus" :adultnum="adultnum" :childnum="childnum"></Card>
  </div>
</template>

<script>
import Districts from '../assets/Districts.json';
import Card from './Card.vue';
import L from 'leaflet';

export default {
  name: 'Sidebar',
  props: ['allData', 'userPosition', 'adultnum', 'childnum', 'calcMaskstatus'],
  data() {
    return {
      county: '',
      town: '',
      keyword: null,
      keywords: [],
      onSearch: false,
      searchBy: '',
      newCenter: ''
    };
  },
  components: {
    Card,
  },
  computed: {
    County() {
      return Districts.map((city) => city.CityName);
    },
    Town() {
      const vm = this;
      let towns;
      if (vm.county) {
        const fitcounty = Districts.find((item) => item.CityName === vm.county);
        towns = fitcounty.AreaList.map((item) => item.AreaName);
      }
      return towns;
    },
    Today() {
      const d = new Date();
      const y = d.getFullYear();
      let month = d.getMonth().toString();
      let date = d.getDate().toString();
      month = month.length < 2 ? `0${month}` : month;
      date = date.length < 2 ? `0${date}` : date;
      return `${y}-${month}-${date}`;
    },
    filterData() {
      const vm = this;
      let data;
      if (vm.allData) {
        if(vm.keyword && vm.searchBy === 'bykeyword') {
          data = vm.allData.filter((item) => item.properties.address.includes(vm.keyword) || item.properties.name.includes(vm.keyword));
        } else if (vm.searchBy === 'byselect') {
          const countyFirst = vm.allData.filter((item) => item.properties.county === vm.county);
          data = vm.town === '' ? countyFirst : countyFirst.filter((item) => item.properties.town === vm.town);
        } else {
          const userPos = L.latLng(vm.userPosition);
          data =
            vm.allData
            .filter((item) => {
              item.distance = userPos.distanceTo(L.latLng(item.geometry.coordinates[1], item.geometry.coordinates[0]));
              return item.distance < 5000;
          });
        }
      }
      return data;
    },
    updateTime() {
      const vm =this;
      if(vm.filterData && vm.filterData.length > 0){
        return vm.filterData[0].properties.updated.substring(10);
      }
    }
  },
  methods: {
    reloadData() {
      const vm = this;
      vm.$emit('reloadData');
    },
    emitNewcenter(center) {
      const vm = this;
      vm.$emit('changeCenter', center);
    },
    search(word) {
      const vm = this;
      vm.keywords = JSON.parse(localStorage.getItem('keywordsList')) || [];
      if(!vm.keywords.includes(vm.keyword)) {
        vm.keywords.unshift(vm.keyword);
      }
      if (vm.keywords.length > 5) {
        vm.keywords.pop();
      }
      vm.onSearch = false;
      localStorage.setItem('keywordsList', JSON.stringify(vm.keywords));
      if(word) {
        vm.keyword = word;
      }
    },
    clearKeywords() {
      localStorage.clear('keywordsList');
      this.keywords = JSON.parse(localStorage.getItem('keywordsList')) || [];
    },
  },
  watch: {
    filterData() {
      const  vm = this;
      if(vm.filterData.length > 0) {
        const coordinates = [...vm.filterData[0].geometry.coordinates];
        vm.newCenter = [coordinates[1], coordinates[0]];
        vm.emitNewcenter(vm.newCenter);
      };
    },
  },
  created() {
    const vm = this;
    vm.keywords = JSON.parse(localStorage.getItem('keywordsList')) || [];
  }
};
</script>
