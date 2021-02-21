<template>
  <div class="col-sm-6 col-md-8 col-xl-9">
    <l-map v-bind:zoom='zoom' v-bind:minZoom='5' v-bind:center="userPosition" ref="mapInfo" class="h-100">
      <l-tile-layer v-bind:url="url"></l-tile-layer>
      <l-marker-cluster>
        <l-marker :lat-lng="userPosition" @add="openPopup">
          <l-popup v-bind:option="{ autoClose: false, closeOnClick: false }">
            <div class="d-flex align-items-center flex-column">
              <div class="mr-1"><i class="fas fa-user-secret"></i></div>
              <div>你的位置</div>
            </div>
          </l-popup>
        </l-marker>
        <l-marker v-for="(item, i) in allData" v-bind:key="i" v-bind:lat-lng="[item['geometry']['coordinates'][1], item['geometry']['coordinates'][0]]" @click.prevent="openPopup">
          <l-popup v-bind:option="{ autoClose: false, closeOnClick: false }">
            <a target="_blank" v-bind:href="`https://www.google.com.tw/maps/place/${item['properties']['address']}`"
            class="d-block popup-name mb-2">{{ item['properties']['name'] }}</a>
            <div class="d-flex w-100 justify-content-center">
              <div class="popup-num text-white" :class="calcMaskstatus(item.properties['mask_adult'], adultnum)">{{ item['properties']['mask_adult'] }}</div>
              <div class="popup-num text-white ml-2" :class="calcMaskstatus(item.properties['mask_child'], childnum)">{{ item['properties']['mask_child'] }}</div>
            </div>
          </l-popup>
        </l-marker>
      </l-marker-cluster>
    </l-map>
  </div>
</template>

<script>
/* eslint-disable */
import {
  LMap, LTileLayer, LMarker, LPopup,
} from 'vue2-leaflet';
import LMarkerCluster from 'vue2-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LMarkerCluster,
  },
  props: [
    'allData',
    'userPosition',
    'adultnum',
    'childnum',
    'calcMaskstatus',
  ],
  data() {
    return {
      zoom: 15,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      map: null,
    };
  },
  methods: {
    openPopup(e) {
      this.$nextTick(() => {
        e.target.openPopup();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.mapInfo.mapObject;
    });
  },
};
</script>
