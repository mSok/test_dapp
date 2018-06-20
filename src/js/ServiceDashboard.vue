
<template>
    <div>
      <div>
        <p> serviceData</p>
        <p> {{serviceData}}</p>
      </div>
      <div>
        <p> тут все события покупки этим кошельком, id  покупки можно вытащить из ethereum</p>
        {{events}}
        <p> Например</p>
        {{firstEv}}
      </div>
    </div>
</template>

<script>

import Vue from 'vue'
import VueResourse from 'vue-resource'
import {getAllServices, getService, getPurchaceEvent} from './utils/placemarket.js'

export default {
  data () {
    return {
      serviceData:null,
      events: [],
      firstEv: null
    }
  },
  methods: {
    fetchData(){
      // getService(1).then(_srv => {
      //   console.log(_srv)
      //   this.serviceData = _srv
      // })
      getAllServices().then(dt => {
        this.serviceData = dt
      })
      getPurchaceEvent().then(ev => {
        console.log('purchase events: ', ev)
        ev.forEach(element => {
          this.events.push(element.returnValues)
        });
        // TODO для теста
        getService(this.events[0]['_purchaseId']).then(res => {
          console.log('покупка 0: ', res)
          this.firstEv = {
            'raw': this.events[0],
            'purchase': res
          }
        })
      })
    }
  },
  created(){
    this.fetchData()
  },
}
</script>

<style>
.table {
	table-layout:fixed;
}

.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
