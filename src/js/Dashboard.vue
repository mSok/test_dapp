
<template>
    <div class="row flex-xl-nowrap justify-content-center mt-4">
      <div class="col-11">
        <GenerateContract @createContract="onCreateContract"> </GenerateContract>
        <div id="no-more-tables">
        <table class="table table-sm">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Номер контракта</th>
                    <th scope="col">Описание</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Цена</th>
                    <th scope="col">Владелец</th>
                    <th scope="col">Закрыт</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in contractsData" :key="item[0]">
                    <td data-title="#">{{parseInt(item[0])}}</td>
                    <td data-title="Номер контракта">{{item[1]}}</td>
                    <td data-title="Описание">{{item[2]}}</td>
                    <td data-title="Дата">{{new Date(item[3] * 1000).toLocaleDateString("ru-RU", options)}}</td>
                    <td data-title="Цена">{{parseInt(item[4])}}</td>
                    <td data-title="Владелец">{{item[5]}}</td>
                    <td data-title="Закрыт">{{item[6]}}</td>
                    <td data-title="-">
                        <router-link exact :to="{name: 'setbet', params: { contract_id: parseInt(item[0]) }}">Сделать cтавку</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
      </div>
    </div>
</template>

<script>

import Vue from 'vue'
import VueResourse from 'vue-resource'
import GenerateContract from './GenerateContract.vue'
import {getAllContracts, createContract} from './utils/contracts.js'
Vue.component('GenerateContract', GenerateContract)

export default {
  data () {
    return {
      message: 'Hello Vue!',
      contracts: {},
      contractsData:[],
      options :{ year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric' },
    }
  },
  methods: {
    onCreateContract: function(contract_obj) {
      createContract(contract_obj)
    },
    fetchData(){
      getAllContracts().then(dt => {
        this.contractsData = dt
      },
      error => {
        console.error('error')
        if (error.code !== 403){
          console.error(error)
        }
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
