<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <v-card color="white" class="no_border" elevation="0">
                <v-row>
                    <v-col sm="12" cols="12" class="pt-0">
                        <h2 class="mb-0 font_20">
                            {{ $t("inventory_transaction_detail") }}
                        </h2>
                        <p class="mb-0">{{ $t("inventory_transaction_detail_desc") }}</p>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col sm="4" cols="12" class="py-0">
                        <v-select
                            class="mt-1"
                            :items="dateSorters"
                            v-model="mDateSorter"
                            @change="onSorterChanges"
                            clearable
                            outlined
                            placeholder="ALL"
                        />
                    </v-col>
                    <v-col sm="3" cols="12" class="py-0">
                        <app-datepicker
                            :initialDate="startDate"
                            @emitDate="startDate = $event"
                        />
                    </v-col>
                    <v-col sm="3" cols="12" class="py-0">
                        <app-datepicker
                            :initialDate="endDate"
                            @emitDate="endDate = $event"
                        />
                    </v-col>
                    <v-col sm="1" cols="1" class="pt-1">
                        <v-btn
                            class="btn_search"
                            @click="searchTransaction"
                            style="background-color: rgb(237, 241, 245)"
                        >
                            <i
                                class="b-search"
                                style="font-size: 18px; color:#fff !important;"
                            />
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col sm="12" cols="12" class="py-0">
                        <template>
                            <LoadingMe
                                :isLoading="showLoading"
                                :fullPage="false"
                                type="loading"
                                :myLoading="true"
                            >
                            </LoadingMe>
                            <kendo-datasource
                                ref="productTxnDS"
                                :group="group"
                                :data="inventoryList"
                            />
                            <kendo-grid
                                id="gridProductTXN"
                                class="grid-function"
                                :data-source-ref="'productTxnDS'"
                                :sortable="false"
                                :groupable="true"
                                :filterable="true"
                                :column-menu="true"
                                :editable="false"
                                :resizable="true"
                                :style="{ width: '100%' }"
                                :noRecords="true"
                                :scrollable-virtual="true"
                            >
                                <kendo-grid-column
                                    :field="'type'"
                                    :title="$t('type')"
                                    :template="'<span>#=type#</span>'"
                                    :width="150"
                                    :filterable="{ multi: true }"
                                    :group-footer-template="
                    '<div style=text-align:right><span class=text-bold>Total:</span>'
                  "
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'txnDate'"
                                    :title="$t('date')"
                                    :filterable="false"
                                    :template="
                    '<span>#=kendo.toString(new Date(txnDate), dateFormat)#</span>'
                  "
                                    :width="130"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: center;',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'name'"
                                    :title="$t('name')"
                                    :template="'<span>#=name#</span>'"
                                    :width="200"
                                    :filterable="{ multi: true }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'txnNumber'"
                                    :title="$t('reference_no')"
                                    :template="referenceTemplate"
                                    :width="150"
                                    :filterable="false"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'itemName'"
                                    :title="$t('item')"
                                    :template="'<span>#=itemName || ``#</span>'"
                                    :width="200"
                                    :filterable="{ multi: true }"
                                    :hidden="true"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'uom'"
                                    :title="$t('txn_uom')"
                                    :template="UOMTemplate"
                                    :width="150"
                                    :filterable="false"
                                    :hidden="true"
                                    :attributes="{ style: 'text-align: center' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: center',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'qty'"
                                    :title="$t('txn_qty')"
                                    :filterable="false"
                                    :template="
                    '<span>#=kendo.toString(qty, decimalFormat)#</span>'
                  "
                                    :aggregates="['sum']"
                                    :group-footer-template="
                    '<div style=text-align:right><span class=text-bold>#= kendo.toString(sum, `n2`)#</span>'
                  "
                                    :width="150"
                                    :hidden="true"
                                    :attributes="{ style: 'text-align: right' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: right;',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'exchangeCost'"
                                    :filterable="false"
                                    :title="$t('cost')"
                                    :template="
                    '<span>#=kendo.toString(exchangeCost, decimalFormat)#</span>'
                  "
                                    :width="150"
                                    :hidden="true"
                                    :attributes="{ style: 'text-align: right' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: right;',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'buom'"
                                    :filterable="false"
                                    :title="$t('base_uom')"
                                    :template="BUOMTemplate"
                                    :width="150"
                                    :attributes="{ style: 'text-align: center' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: center;',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'bQty'"
                                    :filterable="false"
                                    :title="$t('base_qty')"
                                    :template="
                    '<span>#=kendo.toString(bQty, decimalFormat)#</span>'
                  "
                                    :width="150"
                                    :aggregates="['sum']"
                                    :group-footer-template="
                    '<div style=text-align:right><span class=text-bold>#= kendo.toString(sum, `n2`)#</span>'
                  "
                                    :attributes="{ style: 'text-align: right' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: right;',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'avgCost'"
                                    :title="$t('wac')"
                                    :filterable="false"
                                    :template="
                    '<span>#=kendo.toString(avgCost, decimalFormat)#</span>'
                  "
                                    :width="130"
                                    :attributes="{ style: 'text-align: right' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: right;',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'exchangeBAmount'"
                                    :filterable="false"
                                    :title="$t('amount')"
                                    :template="
                    '<span>#=kendo.toString(exchangeBAmount, decimalFormat)#</span>'
                  "
                                    :width="180"
                                    :aggregates="['sum']"
                                    :group-footer-template="
                    '<div style=text-align:right><span class=text-bold>#= kendo.toString(sum, `n2`)#</span>'
                  "
                                    :attributes="{ style: 'text-align: right' }"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5;text-align: right;',
                  }"
                                />
                            </kendo-grid>
                        </template>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import kendo from "@progress/kendo-ui";
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";

const billingHandler = require("@/scripts/invoice/handler/billingHandler");

export default {
    data: () => ({
        showLoading: false,
        mDateSorter: "Today",
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        dateSorters: ["Today", "This Week", "This Month", "This Year"],
        group: {field: "itemName"},
        aggregateDefinition: [
            {field: "itemName", aggregate: "count"},
            {field: "qty", aggregate: "sum"},
            {field: "amount", aggregate: "sum"},
            {field: "bAmount", aggregate: "sum"},
            {field: "bQty", aggregate: "sum"},
            {field: "exchangeAmount", aggregate: "sum"},
            {field: "exchangeBAmount", aggregate: "sum"},
        ],
        isLoaded: false,
        inventoryList: [],
    }),
    components: {
        LoadingMe: () => import(`@/components/Loading`),
        "app-datepicker": () => import(`@/components/custom_templates/DatePickerComponent`),
    },
    methods: {
        onSorterChanges(val) {
            let today = new Date();
            switch (val) {
                case "Today":
                    this.startDate = kendo.toString(today, "yyyy-MM-dd");
                    this.endDate = kendo.toString(today, "yyyy-MM-dd");

                    break;
                case "This Week":
                    var first = today.getDate() - today.getDay(),
                        last = first + 6;

                    this.startDate = kendo.toString(
                        new Date(today.setDate(first)),
                        "yyyy-MM-dd"
                    );
                    this.endDate = kendo.toString(
                        new Date(today.setDate(last)),
                        "yyyy-MM-dd"
                    );

                    break;
                case "This Month":
                    this.startDate = kendo.toString(
                        new Date(today.getFullYear(), today.getMonth(), 1),
                        "yyyy-MM-dd"
                    );
                    this.endDate = kendo.toString(
                        new Date(today.getFullYear(), today.getMonth(), 31),
                        "yyyy-MM-dd"
                    );

                    break;
                case "This Year":
                    this.startDate = kendo.toString(
                        new Date(today.getFullYear(), 0, 1),
                        "yyyy-MM-dd"
                    );
                    this.endDate = kendo.toString(
                        new Date(today.getFullYear(), 11, 31),
                        "yyyy-MM-dd"
                    );

                    break;
                default:
                    this.startDate = "";
                    this.endDate = "";
            }
        },
        async searchTransaction() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.showLoading = true;
                    const startDate = this.startDate;
                    const endDate = this.endDate;
                    let strFilter =
                        "?start=" + startDate + "&end=" + endDate + "&item=1&group=0";
                    billingHandler.inventoryListByFunction(strFilter).then((res) => {
                        if (res.data.statusCode === 200) {
                            this.inventoryList = res.data.data;
                        }
                        this.showLoading = false;
                    });
                }, 10);
            });
        },
        referenceTemplate(data) {
            let url = `#`;
            const id = data.txnId || data.id;
            if (data.type === "Invoice") {
                url = `invoice_view/${id}`;
            } else if (data.type === "Sale Quote") {
                url = `sale_quote_view/${id}`;
            } else if (data.type === "Delayed Invoice") {
                url = `delayed_invoice_view/${id}`;
            } else if (data.type === "Sale Order") {
                url = `sale_order_view/${id}`;
            } else if (data.type === "Purchase Order") {
                url = `purchase_order_view/${id}`;
            } else if (data.type === "Credit Memo") {
                url = `sale_return_view/${id}`;
            } else if (data.type === "Debit Memo") {
                url = `purchase_return_view/${id}`;
            } else if (data.type === "Inventory Adjustment") {
                url = `inventory_adjustment_view/${id}`;
            } else if (data.type === "Purchase") {
                url = `credit_purchase_view/${id}`;
            } else if (data.type === "Production Order") {
                url = `production_order_view/${id}`;
            } else if (data.type === "Production") {
                url = `production/${id}`;
            }

            let args = {
                text: data.txnNumber,
                url: url,
                data: data,
            };
            return {
                template: LinkTemplate,
                templateArgs: args,
            };
        },
        UOMTemplate(dataItem) {
            if (dataItem.hasOwnProperty("uom")) {
                const uom = dataItem.uom;
                if (uom.hasOwnProperty("uom")) {
                    if (uom.uom.hasOwnProperty("name")) {
                        return uom.uom.name;
                    }
                }
            }
            return ``;
        },
        BUOMTemplate(dataItem) {
            if (dataItem.hasOwnProperty("buom")) {
                const buom = dataItem.buom;
                if (buom.hasOwnProperty("name")) {
                    return buom.name;
                }
            }
            return ``;
        },
        sumGroupAmount(dataItem) {
            if (dataItem.hasOwnProperty("sum")) {
                return "<span>#= kendo.toString(sum, `n2`)#</span>";
            }
            return `<span>#= kendo.toString(sum, 'n2')#</span>`;
        },
    },
    computed: {},
    mounted: async function () {
        this.group = [
            {
                field: "itemName",
                aggregates: this.aggregateDefinition,
            },
        ];
    },
};
</script>
<style scoped>
.theme--light.v-data-table {
    background-color: transparent !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    height: 32px !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {
    border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}

.theme--light.v-data-table
> .v-data-table__wrapper
> table
> tbody
> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}
</style>
