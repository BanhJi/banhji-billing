<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="font_20">{{ $t('examption') }}</h2>
            <!-- dialogM1 Tariff -->
            <v-dialog v-model="dialogM1" max-width="400px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" class=" text-capitalize white--text float-right" v-on="on">
                        {{ $t('create_new') }}
                    </v-btn>
                </template>
                <v-card>
                    <div class="modal_header">
                        <v-card-title>{{ $t('examption') }}</v-card-title>
                        <v-icon class="btn_close" @click="dialogM1 = false">close</v-icon>
                    </div>
                    <v-card-text class="modal_text_content">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation>
                            <v-row>
                                <v-col sm="12" cols="12" class="pb-0">
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="exemption.name"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required')]"
                                        required
                                        placeholder=""/>
                                    <label class="label">{{ $t('exemption_type') }}</label>
                                    <v-select class="mt-1"
                                        v-model="exemption.exemptionType"
                                        :items="exemptionTypes"
                                        item-value="name"
                                        :rules="[v => !!v || 'Tax type is required']"
                                        item-text="name"
                                        outlined
                                        dense/>
                                    <label class="label">{{ $t('amount *') }}</label>
                                    <v-text-field class="mt-1"
                                        v-model="exemption.amount"
                                        outlined
                                        :rules="[v => !!v || $t('name_is_required')]"
                                        required
                                        placeholder=""/>
                                    <label class="label">{{ $t('currency') }}</label>
                                    <v-select class="mt-1"
                                        v-model="exemption.currency"
                                        :items="currencies"
                                        item-value="name"
                                        :rules="[v => !!v || 'Tax type is required']"
                                        item-text="name"
                                        outlined
                                        dense/>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="modal_footer">
                        <v-row>
                            <v-col sm="6" cols="6" class="py-0 text-left">
                                <v-btn color="primary" outlined
                                       class=" text-capitalize  black--text float-left"
                                       @click="dialogM1 = false">{{ $t('cancel') }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn color="primary" class="px-3  white--text text-capitalize"
                                       @click="onSaveClose">{{ $t('save_close') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

                </v-card>
            </v-dialog>
        </v-col>
        <v-col sm="12" cols="12" class="pt-0">
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                type="loading"
                :myLoading="true"/>
            <kendo-datasource ref="exemptionDS"
                :data="exemptions"/>
                <kendo-grid id="gridexamption" class="grid-function"
                    ref="exemption"
                    :data-source-ref="'exemptionDS'"
                    :editable="false">
                    <kendo-grid-column
                        :width="200"
                        :field="'name'"
                        :title="$t('name')"
                        :template="'<span>#= name#</span>'"
                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                    <kendo-grid-column
                        :width="200"
                        :field="'exemptionType'"
                        :title="$t('exemptionType')"
                        :template="'<span>#= exemptionType#</span>'"
                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                    <kendo-grid-column
                        :width="200"
                        :field="'currency'"
                        :title="$t('currency')"
                        :template="'<span>#= currency#</span>'"
                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                    <kendo-grid-column
                        :width="200"
                        :field="'amount'"
                        :title="$t('amount')"
                        :template="'<span>#= amount#</span>'"
                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                </kendo-grid>
        </v-col>
    </v-row>
</template>

<script>
import LoadingMe from "@/components/Loading";
import kendo from "@progress/kendo-ui";
// import {i18n} from '@/i18n'
const serviceItemHandler = require("@/scripts/serviceItemHandler");

export default {
    props: {},
    components: {
        'LoadingMe': LoadingMe
    },
    data: function (){ 
        return {
            showLoading: false,
            dialogM1: false,
            exemptions: [{name: "E1", amount: 10000, exemptionType: "Money", currency: "KHR"}],
            valid: false,
            exemptionTypes: [
                {name: "Usage"},
                {name: "Money"},
                {name: "Percentage"}
            ],
            exemption: {
                id: '',
                name: '',
                amount: '',
                exemptionType: '',
                currency: '',
            },
            currencies: []
        }
    },
    methods: {
        editUsage(e){
            e.preventDefault();
            let treeList = this.$refs.tariffTreeList.kendoWidget()
            let dataItem = treeList.dataItem(kendo.jQuery(e.target).closest("tr"));
            window.console.log(dataItem,1)
            if(dataItem.type =="usage"){
                this.readonly = true
                this.tariffItme = {
                    id:     dataItem.id,
                    name:   dataItem.name,
                    usage:  dataItem.usage,
                    price:  dataItem.price,
                    parentId: dataItem.parentId,
                    parentName: dataItem.parentName,
                    type:   dataItem.type
                }
                this.tariff = {
                    id: dataItem.parentId,
                    name: dataItem.parentName
                }
                this.dialogM2 = true
            }else{
                this.tariff = {
                    id: dataItem.id,
                    name: dataItem.name,
                    minimumCharge: dataItem.minimumCharge,
                    minimumPrice: dataItem.minimumPrice,
                    // serviceItem: dataItem.serviceItem
                }
                this.dialogM1 = true
            }
        },
        addUsage(e){
            window.console.log(3,e)
            e.preventDefault();
            let treeList = this.$refs.tariffTreeList.kendoWidget()
            let dataItem = treeList.dataItem(kendo.jQuery(e.target).closest("tr"));
            window.console.log(dataItem)
            this.tariff = {
                id: dataItem.id,
                name: dataItem.name
            }
            this.dialogM2 = true

        },
        onDataBound (e) {
            window.console.log(e.sender)
            var headers = e.sender.thead.children();
            for (var i = 0; i < headers.length; i++) {
                var th = kendo.jQuery(headers[i]);
                th.css("font-weight", "bold");
                th.css("text-align", "center");
            }

            var items = e.sender.items();
            for (var j = 0; j < items.length; j++) {
                var dataItem = e.sender.dataItem(items[j]);
                var row = kendo.jQuery(items[j]);

                /* Parent in bold */
                if(dataItem.get("type") ===`usage`){
                    // row.find("[data-command='customedit']").hide();
                    row.find("[data-command='tariffadd']").hide();
                    row.css("font-weight", "bold");
                }
            }

            let treeList = this.$refs.tariffTreeList.kendoWidget()
            treeList.hideColumn("usage");
            treeList.hideColumn("price");
            treeList.bind("expand", this.expand);
            treeList.bind("collapse", this.collapse);
        },
        onSaveClose(){

        },
        async loadProducts() {
            this.showLoading = true;
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.isLoaded = true;
                    this.showLoading = true;
                    let cateId = "",
                        groupId = "",
                        search = "";
                    if (this.mCategory) {
                        cateId = this.mCategory.id;
                    }
                    if (this.mGroup) {
                        groupId = this.mGroup.id;
                    }
                    if (this.search) {
                        search = this.search;
                    }
                    let strFilter = "?";
                    if (cateId) {
                        strFilter += "cateId=" + cateId;
                    }
                    if (groupId) {
                        strFilter += "&groupId=" + groupId;
                    }
                    if (search) {
                        strFilter += "&search=" + search;
                    }
                    // window.console.log('search', strFilter)
                    serviceItemHandler.filter(strFilter).then((res) => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false;
                            this.isLoaded = false;
                            this.serviceItems = res.data.data;
                        }
                    });
                }, 300);
            });
        },
        expand() {
            let treeList = this.$refs.tariffTreeList.kendoWidget()
            treeList.showColumn("usage");
            treeList.showColumn("price");
        },
        collapse(){
            let treeList = this.$refs.tariffTreeList.kendoWidget()
            treeList.hideColumn("usage");
            treeList.hideColumn("price");
        }
    },
    computed: {
    },
    async mounted() {
        await this.loadProducts()
    },
    watch: {},
};
</script>