<template>
  <div class="search-list p-2" v-if='filterData'>
     <div class="card border-0 p-2 mb-3 w-100" v-for="(single, i) in filterData.slice(0, showNum)" :key="i" @click="newCenter(single)" :id="i">
       <div class="card-body p-0">
         <div class="d-flex mb-4">
           <div class="py-1 px-2 w-100 num-block mr-1" :class="calcMaskstatus(single.properties['mask_adult'], adultnum)">
             <p class="text-white mb-0">成人口罩數量</p>
             <p class="text-white mb-0"><span>{{ single.properties['mask_adult'] }}</span>片</p>
           </div>
           <div class="py-1 px-2 w-100 num-block" :class="calcMaskstatus(single.properties['mask_child'], childnum)">
             <p class="text-white mb-0">兒童口罩數量</p>
             <p class="text-white mb-0"><span>{{ single.properties['mask_child'] }}</span>片</p>
           </div>
         </div>
         <div class="pharmacy-info">
          <div class="d-flex">
            <div class="opening-status-bg" :class="isOpening(single.properties['service_periods']).bgColor"></div>
            <h5>{{ single.properties.name }}</h5>
            <span class="badge ml-2" :class="isOpening(single.properties['service_periods']).txtColor">{{ isOpening(single.properties['service_periods']).status}}</span>
          </div>
          <div class="info-detail">
            <div class="d-flex justify-content-between mb-1">
              <div class="d-flex">
                <span>地址</span>
                <p>{{ single.properties.address }}</p>
              </div>
              <a :href="`https://www.google.com.tw/maps/place/${single.properties.address}`" class="togoogle">查看地圖</a>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <div class="d-flex">
                <span>電話</span>
                <p>{{ single.properties.phone }}</p>
              </div>
              <a :href="`tel:${single.properties.phone}`" class="tocall">撥打電話</a>
            </div>
            <div class="d-flex">
              <span>備註</span>
              <p class="w-100">{{ single.properties.note }}</p>
            </div>
          </div>
         </div>
       </div>
     </div>
     <div class="d-flex flex-column">
       <span class="mb-1">尚有{{ filterData.length - showNum >= 0 ? filterData.length - showNum : 0 }}筆資料</span>
       <div class="d-flex w-100 btns-bottom">
         <button class="btn rounded-pill shadow-lg btn-showMore text-white py-2 px-4 mb-2" v-if="filterData.length > showNum" @click.prevent="showNum+=5">查看更多</button>
         <button class="btn shadow-lg text-white btn-top mb-2" v-if="filterData.length > 0"><a href="#0">Top</a></button>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['filterData', 'adultnum', 'childnum', 'calcMaskstatus'],
  data() {
    return {
      showNum: 8,
    };
  },
  watch: {
    filterData() {
      const vm = this;
      vm.showNum = 8;
    },
  },
  methods: {
    newCenter(item) {
      const center = [...item.geometry.coordinates];
      const newCenter = [center[1], center[0]];
      this.$emit('changeCenter', newCenter);
    },
    isOpening(time) {
      let isOpen;
      let openBg;
      let opentxtColor;
      if(!time || time ==='') {
        isOpen = '無資料';
      } else {
        const hour = new Date().getHours();
        if (hour < 9 || hour >= 21) {
          isOpen = '休息中';
          openBg = 'bg-primary';
          opentxtColor = 'isClosed';
        } else {
          const morning = time.split('').slice(0, 7);
          const afternoon = time.split('').slice(7, 14);
          const night = time.split('').slice(14, 21);
          let today = new Date().getDay();
          today = today === 0 ? 7 : today;
          if (hour >=9 && hour <14) {
            isOpen = morning[today-1] === 'N' ? '營業中' : '休息中';
            openBg = morning[today-1] === 'N' ? 'bg-primary' : 'bg-gray';
            opentxtColor = morning[today-1] === 'N' ? 'isOpening' : 'isClosed';
          } else if (hour >=14 && hour <18) {
            isOpen = afternoon[today-1] === 'N' ? '營業中' : '休息中';
            openBg = afternoon[today-1] === 'N' ? 'bg-primary' : 'bg-gray';
            opentxtColor = afternoon[today-1] === 'N' ? 'isOpening' : 'isClosed';
          } else if (hour >= 18 && hour < 22) {
            isOpen = night[today-1] === 'N' ? '營業中' : '休息中';
            openBg = night[today-1] === 'N' ? 'bg-primary' : 'bg-gray';
            opentxtColor = night[today-1] === 'N' ? 'isOpening' : 'isClosed';
            if (hour === 20 && isOpen === '營業中') {
              isOpen = '即將休息';
              openBg = 'bg-secondary';
              opentxtColor = 'nearlyClose';
            }
          }
        }
      }
      return { status: isOpen, bgColor: openBg, txtColor: opentxtColor };
    }
  },
};
</script>
