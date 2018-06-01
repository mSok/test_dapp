<template>
  <div class="row flex-xl-nowrap justify-content-center mt-4">
      <div id="no-more-tables" class="col-11">
            <table class="table table-sm">
                <thead class="thead-dark">
                    <tr>
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
                    <tr v-for="item in rateData">
                        <td data-title="Номер контракта" >{{item[1][1]}}</td>
                        <td data-title="Описание">{{item[1][2]}}</td>
                        <td data-title="Дата" >{{new Date(item[1][3] * 1000).toLocaleDateString("ru-RU", options)}}</td>
                        <td data-title="Цена" >{{parseInt(item[1][4])}}</td>
                        <td data-title="Владелец контракта" >{{item[1][5]}}</td>
                        <td data-title="Ставка" >{{parseInt(item[3])}}</td>
                        <td data-title="Участник">{{item[2]}}</td>
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
      },
      error => {
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
