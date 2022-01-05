<template>
    <v-autocomplete
        class="mt-1"
        :loading="loading"
        placeholder="Search Bank"
        @change="emitBank();onChanged();"
        v-model="bank"
        :items="banks"
        item-text="name"
        item-value="uuid"
        hide-no-data
        hide-selected
        return-object
        clearable
        outlined
    ></v-autocomplete>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'BankDropDownList',
    props: {
        initBank: {
            type: Object,
        },
    },
    data() {
        return {
            bank : null,
            loading : false,
        }
    },
    methods: {
        initData(){
            this.bank = this.initBank;
        },
        async loadData () {
            this.loading = true;
            
            // Call List
            await this.$store.dispatch('banking/getBanks')

            this.loading = false;
        },
        emitBank() {
            this.$emit('emitBank', this.bank);
        },
        onChanged() {
            this.$emit('onChanged');
        },
    },
    watch: {
        initBank() {
            this.initData();
        }
    },
    computed: mapState({
        banks: state => state.banking.banks
    }),
    created() {
        this.loadData();
    },
    mounted() {
        /* Initial obj */
        this.initData();
    }
}
</script>