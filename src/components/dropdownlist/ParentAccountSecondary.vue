<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Parent Account"
        v-model="parentAccount"
        :items="parentAccounts"
        item-text="name"
        item-value="uuid"
        @change="emitParentAccount();onChanged()"
        return-object
        clearable
        outlined>
        <template slot='selection' slot-scope='{ item }'>
            {{ item.number }} - {{ item.name }}
        </template>
        <template slot='item' slot-scope='{ item }'>
            {{ item.number }} - {{ item.name }}
        </template>
    </v-select>
</template>

<script>
import store from "@/store";

export default {
    name: 'ParentAccountDropDownList',
    props: {
        initParentAccount: {
            type: Object,
        },
        initSecondaryTypeId: {
            type: String,
        }
    },
    data() {
        return {
            parentAccount: null,
            parentAccounts: [],
            loading: false
        }
    },
    methods: {
        async initialize () {
            this.loading = true;
            
            // Call List
            this.parentAccounts = await this.$store.dispatch('accounting/getSecondaryAccounts');

            this.loading = false;
        },
        initialData(){
            this.parentAccount = this.initParentAccount;
        },
        emitParentAccount() {
            this.$emit('emitParentAccount', this.parentAccount);
        },
        onChanged() {
            this.$emit('onChanged');
        },
    },
    watch: {
        initParentAccount: "initialData",
        initSecondaryTypeId() {
            this.parentAccounts = store.state.accounting.secondaryAccounts.filter((i) => i.secondary_type_uuid === this.initSecondaryTypeId);
        },
    },
    created() {
        this.initialize();
    },
    mounted() {
        /* Initial Obj */
        this.initialData();
    }
}
</script>