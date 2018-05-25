<template>
  <div class="row flex-xl-nowrap justify-content-center mt-4">
      <div class="col-11">
            <table class="table table-sm">
                <thead class="thead-dark">
                    <tr class="d-flex">
                        <th scope="col" class="col-1" >Номер контракта</th>
                        <th scope="col" class="col-3" >Описание</th>
                        <th scope="col" class="col-1" >Дата</th>
                        <th scope="col" class="col-1" >Цена</th>
                        <th scope="col" class="col-2" >Владелец контракта</th>
                        <th scope="col" class="col-1" >Ставка</th>
                        <th scope="col" class="col-2" >Участник</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in rateData" class="d-flex">
                        <td class = "col-sm-1">{{item[1][1]}}</td>
                        <td class = "col-sm-3">{{item[1][2]}}</td>
                        <td class = "col-sm-1">{{new Date(item[1][3] * 1000).toLocaleDateString("ru-RU", options)}}</td>
                        <td class = "col-sm-1">{{parseInt(item[1][4])}}</td>
                        <td class = "col-sm-2">{{item[1][5]}}</td>
                        <td class = "col-sm-1">{{parseInt(item[3])}}</td>
                        <td class = "col-sm-2">{{item[2]}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
  </div>
</template>

<script>
import {getBets} from './utils/contracts'
export default {
    data () {
        return {
            rateData:[],
            options :{ year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric' },
        }
    },
    methods: {
      fetchData(){
        getBets().then(dt => {
            this.rateData = dt
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
