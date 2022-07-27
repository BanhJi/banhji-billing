<template>
    <v-row>
        <v-col cols="12" sm="12">
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                :myLoading="true"
                type="loading"
                />
            <kendo-datasource
                ref="customerDS"
                :data="customers"/>
            <kendo-grid
                id="gridCustomerLine"
                class="grid-function"
                :data-source-ref="'customerDS'"
                :sortable="false"
                :column-menu="true"
                :editable="true"
                :scrollable-virtual="true">
                <kendo-grid-column
                    :field="'name'"
                    :title="$t('customer')"
                    :width="200"
                    :template="'<span>#= name#</span>'"
                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                <kendo-grid-column
                    :field="'number'"
                    :title="$t('number')"
                    :width="200"
                    :template="'<span>#= number#</span>'"
                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
            </kendo-grid>
        </v-col>
    </v-row>
</template>
<script>
    import LoadingMe from '@/components/Loading'
    // import kendo from "@progress/kendo-ui"; 
    const customerHandler = require("@/scripts/customerHandler");
    // const $ = kendo.jQuery
    export default {
        name: "Task",
        props: ['loadData'],
        components: {
            'LoadingMe': LoadingMe,
        },
        data: () => ({
            customers: [],
            showLoading: false,
        }),
        methods:{
            async loadCustomerCenter() {
                if(this.loadData.customerGroup.id){
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve("resolved");
                            this.params = {
                                isDonor: '',
                                ctid: '',
                                grid: this.loadData.customerGroup.id || '',
                                key: '',
                                search: '',
                            };
                            this.showLoading = true;
                            customerHandler.centerv1(this.params).then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.showLoading = true;
                                    let result = res.data.data || [];
                                    this.loadCustomerDetail(result)
                                } else {
                                    this.showLoading = false;
                                }
                            });
                        }, 10);
                    });
                }
            },
            async loadCustomerDetail(data) {
                // this.customers = []
                for(const index of data){
                    const strFilter = '?id=' + index.id
                    customerHandler.customerDetail(strFilter).then(async (res) => {
                        if (res.data.statusCode === 200) {
                            const lines = res.data.data || []
                            lines.forEach(item => {
                                this.customers.push({
                                    id: item.id,
                                    type: item.type || {},
                                    isDonor: item.isDonor || false,
                                    crn: item.crn || '',
                                    customerType: item.customerType || {},
                                    number: item.number || '',
                                    numberName: (item.number || '') + ' - ' + (item.name || ''),
                                    name: item.name || '',
                                    connectId: item.connectId || '',
                                    gender: item.gender || '',
                                    alternativeName: item.alternativeName || '',
                                    taxId: item.taxId || '',
                                    consumerId: item.consumerId || '',
                                    registeredDate: item.registeredDate || '',
                                    customerGroup: item.customerGroup,
                                    receivableAcc: item.receivableAcc,
                                    saleDepositAcc: item.saleDepositAcc,
                                    saleDiscountAcc: item.saleDiscountAcc,
                                    priceLevel: item.priceLevel,
                                    billPayment: item.billPayment,
                                    cashPayment: item.cashPayment || {},
                                    qrPayment: item.qrPayment || {},
                                    nature: item.nature,
                                    image: item.image || {},
                                    noteOnInvoice: item.noteOnInvoice || '',
                                    billingAddress: item.billingAddress,
                                    contactPerson: item.contactPerson,
                                    deliveryAddress: item.deliveryAddress,
                                    email: item.email,
                                    baseCurrency: item.baseCurrency,
                                    decimalFormat: item.decimalFormat
                                });
                            })
                        }
                    })
                }
                // $("#gridCustomerLine").data("kendoGrid").dataSource.data(this.customers);
                this.showLoading = false;
            },
        },
        async mounted(){
            window.console.log('loadData', this.loadData)
            this.loadCustomerCenter()
        },
        created() {
            
        },
        computed: {
           
        },
        watch:{
            loadData() {
				if (this.loadData !== undefined) {
					this.loadCustomerCenter();
				}
			},
        },        
    };
</script>

<style scoped>
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row),
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
        border-bottom: thin solid #ddd;
    }

    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
        height: 32px !important;
        border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
        border-top: thin solid rgba(0, 0, 0, 0.12) !important;
    }
    .v-text-field__details{
        display: none !important;
    }

@media (min-width: 1264px) {
    .container {
        max-width: 1080px !important;
    }

}

.k-dropdown {
    width: 100%;
    margin-top: 3px;
}
</style>
