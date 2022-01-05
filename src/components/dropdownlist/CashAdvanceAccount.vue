<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Cash Advance Account"
        v-model="account"
        :items="accounts"
        item-value="uuid"
        :item-text="(item) => `${item.number} - ${language ==='English' ? item.name : item.local_name}`"
        @change="emitAccount"
        return-object
        outlined>
        <template slot="item" slot-scope="{ item }">
            {{ item.number }} - {{ language ==='English' ? item.name : item.local_name }}
        </template>
    </v-select>
</template>

<script>
import { mapState } from 'vuex';

const AccountTypeCode = require("@/scripts/default_setup/AccountTypeCode");

export default {
    name: 'CashAdvanceAccountDropDownList',
    props: {
        initAccount: {
            type: Object,
        },
    },
    data() {
        return {
            account: null,
            loading: false
        }
    },
    methods: {
        async loadData () {
            this.loading = true;
            
            // Call List
            await this.$store.dispatch('accounting/getAccounts');

            this.loading = false;
        },
        emitAccount() {
            this.$emit('emitAccount', this.account);
        },
    },
    watch: {
        initAccount() {
            this.account = this.initAccount;
        }
    },
    computed: mapState({
        accounts: state => state.accounting.accounts.filter(i => i.account_type.code === AccountTypeCode.CASH_ADVANCE),
        language: state =>  state.accounting.accountLanguage
    }),
    created() {
        this.loadData();
    },
    mounted() {
        /* Initial Obj */
        this.account = this.initAccount;
    }
}
</script>