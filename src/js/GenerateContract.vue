<template>
<form id="contract-data">
    <div class="p-2 mb-2 alert-danger" role="alert" v-if="errors.length">
        <b>Пожалуйста исправьте указанные ошибки:</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </div>
    <div class="form-row">
        <div class="col mb-2 pb-2">
            <input v-model="contructnum" type="text" class="form-control" placeholder="Номер контракта">
        </div>
        <div class="col">
            <input v-model="descr" type="text" class="form-control" placeholder="Описание">
        </div>
        <div class="col">
            <input v-model="amount" type="text" class="form-control" placeholder="Цена">
        </div>
        <div class="col">
            <button @click.prevent.stop="createContract" type="button" class="btn btn-primary">Создать</button>
        </div>
    </div>
</form>
</template>

<script>
export default {
    data () {
        return {
            contructnum: '',
            descr: '',
            amount: 0,
            errors:[]
        }
    },
    methods: {
        checkForm:function() {
            this.errors = [];
            if(this.contructnum && this.descr && this.amount && this.amount>0) return true;
            if(!this.name) this.errors.push("не верно заполнены поля формы.");
        },
        createContract: function(e){
            if (this.checkForm()) {
                this.$emit('createContract', {contructnum: this.contructnum, descr: this.descr, amount: this.amount})
                this.descr = this.contructnum = '';
                this.amount = 0;
                event.target.form.reset();
            }
        }
    }
}
</script>
