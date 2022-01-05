<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <v-card color="white" class="no_border" elevation="0">
                <h2 class="mb-0 font_20">{{ $t("chart_of_accounts") }}</h2>
                <p class="mb-4">{{$t('chart_of_accounts_desc2')}}</p>
                <v-row>
                    <v-col sm="12" cols="12" class="py-0">
                        <template>
                            <v-data-table
                                :headers="headers"
                                :items="accounts"
                                :items-per-page="50"
                                sort-by="account.number"
                                class="attachment_table elevation-1">

                                <template v-slot:[`item.balance`]="{ item }">
                                    {{ Number(item.balance).toLocaleString() }}
                                </template>
                                    
                            </v-data-table>
                        </template>
                        <LoadingMe 
							:isLoading ="showLoading" 
							:fullPage  ="false" 
							:myLoading ="true"/>

                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import kendo from '@progress/kendo-ui';
    import {i18n} from '@/i18n';
    
    const { trialBalanceHandler } = require("@/scripts/AppHandlers");

    export default {
        components: {
            "LoadingMe": () => import('@/components/Loading'),
        },
        data: () => ({
            // Obj
            accounts: [],
            headers: [
                {
                    text: i18n.t("number"),
                    value: 'account.number',
                },
                { text: i18n.t("name"), value: 'account.name' },
                { text: i18n.t("type"), value: 'account.account_type.name' },
                { text: i18n.t("group"), value: 'account.account_group.name' },
                { text: i18n.t("gl_balance"), value: 'balance', align: 'right' },
            ],            
            // LoadingMe
            showLoading: false,
            loadingAlert: false,
            loadingColorAlert: "",
            loadingTextAlert: "",
        }),
        methods: {
            loadData(){
                this.showLoading = true;
                trialBalanceHandler.getTrialBalance({
                    params : {
                        as_of_date: kendo.toString(new Date(), 'yyyy-MM-dd') + 'T23:59:59.999Z',
                        include_0_balance: true
                    }
                }).then(res => {
                    if (res.data) {
                        // Bind data
                        this.accounts = res.data.tbdetails;
                    }
                }).finally(()=>{
                    this.showLoading = false;
                })
            }
        },
        mounted() {
            this.loadData();
        },
    };
</script>
<style scoped>
</style>