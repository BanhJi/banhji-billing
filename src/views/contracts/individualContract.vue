<template>
    <v-app class="zoom-in">
        <v-container>
            <v-row>
                <v-form ref="form" v-model="valid" lazy-validation>
                <v-col sm="12" cols="12">
                    <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                        <v-row>
                            <v-col class="bigSide pr-2 py-0" sm="8" cols="12" style="transition: .3s ease-in;">
                                <v-card outlined dense class="no_border">
                                    <h2 class="mb-0">{{ $t("Contract") }}</h2>
                                </v-card>
                                <v-card outlined dense class="px-4 no_border" color="grayBg">
                                    <v-row>
                                        <v-col sm="4" cols="12" class="pb-0 pt-4">
                                            <label class="label  mb-0">{{ $t("customer") }}</label>
                                            <v-col
                                                sm="12"
                                                cols="12"
                                                class="kendo_dropdown_custom px-0 pb-3 pt-0">
                                                <dropdownlist
                                                    :data-items="customerList"
                                                    @change="onChange"
                                                    :value="customer"
                                                    :data-item-key="dataItemKey"
                                                    :text-field="textField"
                                                    :default-item="defaultItem"
                                                    :filterable="true"
                                                    :required="true"
                                                    :valid="validCustomer"
                                                    @filterchange="onFilterChange">
                                                </dropdownlist>
                                            </v-col>
                                            <label class="label mb-0">{{ $t("accounts_receivable") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.receivableAcc"
                                                :items="receivableAcc"
                                                item-value="id"
                                                :item-text="(item) => `${item.number} - ${item.name}`"
                                                return-object
                                                placeholder="Account Receivable"
                                                tage="Account Receivable"
                                                outlined/>
                                        </v-col>
                                        <v-col sm="4" cols="12" class="pb-0 pt-4">
                                            <label class="label mb-0">{{ $t("number") }}</label>
                                            <v-row class="mt-1 mr-0">
                                                <v-col sm="3" cols="3" class="py-0 pr-0">
                                                    <div class="code_text text-bold">
                                                        AAA
                                                    </div>
                                                </v-col>
                                                <v-col sm="7" cols="7" class="py-0 pl-0 pr-1">
                                                    <v-text-field
                                                        class=" custom-border "
                                                        v-model="contract.number"
                                                        outlined
                                                        disabled
                                                        :rules="[(v) => !!v || 'Number is required']"
                                                        required/>
                                                </v-col>
                                                <v-col sm="2" cols="2" class="py-0 px-0">
                                                    <v-icon
                                                        color="black"
                                                        size="30"
                                                        class="border_qrcode"
                                                        @click="generateNumber">mdi-qrcode
                                                    </v-icon>
                                                </v-col>
                                            </v-row>
                                            <label class="label mb-0">{{ $t("contract_type") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.contractTypes"
                                                :items="contractTypes"
                                                item-value="id"
                                                item-text="name"
                                                :rules="[(v) => !!v || 'contract type is required']"
                                                return-object
                                                outlined/>
                                        </v-col>
                                        <v-col sm="4" cols="12" class="pb-0 pt-4">
                                            <label class="label  mb-0">{{ $t("date") }}</label>
                                            <app-datepicker
                                                :initialDate="contract.transactionDate"
                                                @onChanged="onInvoiceDateChanged"
                                                @emitDate="contract.transactionDate = $event"/>
                                            <label class="label mb-0">{{ $t("price_level") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.priceLevel"
                                                :items="priceLevel"
                                                item-value="id"
                                                item-text="name"
                                                return-object
                                                placeholder="Price Level"
                                                tage="Default Price Level"
                                                outlined
                                                :rules="[(v) => !!v['id'] || $t('is_required')]"/>
                                        </v-col>
                                    </v-row>
                                </v-card>
                                <v-divider class="mb-3"/>
                                <v-card outlined dense class="px-4 no_border" color="grayBg">
                                    <v-row>
                                        <v-col sm="4" cols="4" outlined dense class="px-4 no_border" color="grayBg">
                                            <label class="label mb-0">{{ $t("country") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.country"
                                                :items="countries"
                                                item-value="id"
                                                :item-text="(item) => `${item.code} - ${item.name}`"
                                                :rules="[(v) => !!v['id'] || $t('is_required')]"
                                                return-object
                                                tage="Country"
                                                placeholder="Country"
                                                outlined=""/>
                                            <label class="label font_14">{{ $t("Commune") }}</label>
                                            <v-select
                                                class=" mt-1"
                                                v-model="contract.commune"
                                                :items="communes"
                                                item-value="id"
                                                item-text="name"
                                                return-object
                                                tage="Commune"
                                                placeholder="Commune"
                                                outlined/>
                                        </v-col>
                                        <v-col sm="4" cols="4" outlined dense class="px-4 no_border" color="grayBg">
                                            <label class="label font_14">{{ $t("Province") }}</label>
                                            <v-select
                                                class=" mt-1"
                                                v-model="contract.province"
                                                :items="provinces"
                                                :item-text="(item) => `${item.code} - ${item.name}`"
                                                item-value="id"
                                                tage="Province"
                                                clearable
                                                placeholder="Province"
                                                outlined/>
                                            <label class="label font_14">{{ $t("village") }}</label>
                                            <v-select
                                                class=" mt-1"
                                                v-model="contract.village"
                                                :items="villages"
                                                item-value="id"
                                                item-text="name"
                                                return-object
                                                tage="Village"
                                                placeholder="Village"
                                                outlined/>
                                        </v-col>
                                        <v-col sm="4" cols="4" outlined dense class="px-4 no_border" color="grayBg">
                                            <label class="label font_14">{{ $t("District") }}</label>
                                            <v-select
                                                class=" mt-1"
                                                v-model="contract.district"
                                                :items="districts"
                                                :item-text="(item) => `${item.code} - ${item.name}`"
                                                item-value="id"
                                                tage="District"
                                                clearable
                                                placeholder="District"
                                                outlined/>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                            <v-col class="bigSide pr-2 py-0" sm="4" cols="12" style="transition: .3s ease-in;">
                                <div class="d-flex justify-end">
                                    <h3
                                        style="color: #b3b5bc; font-size:20px;"
                                        class="text-uppercase">
                                        <span class="pointer" @click="Help('invoice')">{{ $t("help") }}</span>
                                        <v-icon
                                            @click="cancel()"
                                            style="cursor: pointer; color: #333; font-size: 40px;"
                                            class="">close
                                        </v-icon>
                                    </h3>
                                </div>
                                <div class="rounded-4 mt-1 px-4 pt-4 grayBg">
                                    <v-row>
                                        <v-col sm="12" cols="12" class="pt-3">
                                            <label class="label mb-0">{{ $t("location") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.location"
                                                :items="locations"
                                                item-value="id"
                                                :item-text="(item) => `${item.code} - ${item.name}`"
                                                :rules="[(v) => !!v['id'] || $t('is_required')]"
                                                return-object
                                                tage="Location"
                                                placeholder="Location"
                                                @change="locationChange"
                                                outlined=""/>
                                            <label class="label mb-0">{{ $t("sub_location") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.subLocation"
                                                :items="subLocations"
                                                item-value="id"
                                                :item-text="(item) => `${item.code} - ${item.name}`"
                                                :rules="[(v) => !!v['id'] || $t('is_required')]"
                                                return-object
                                                tage="Sub Location"
                                                placeholder="Sub Location"
                                                @change="subLocationChange"
                                                outlined=""/>
                                            <label class="label mb-0">{{ $t("box") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="contract.box"
                                                :items="boxs"
                                                item-value="id"
                                                :item-text="(item) => `${item.code} - ${item.name}`"
                                                return-object
                                                tage="Box"
                                                placeholder="Box"
                                                outlined=""/>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-col>
                            <v-col class="bigSide pr-2 py-1" sm="6" cols="12" style="transition: .3s ease-in;">
                                <v-card outlined dense class="px-4 no_border" color="grayBg">
                                    <v-row style="background-color: #fff;">
                                        <v-col sm="12" cols="12" class="pt-4 pb-0 px-4">
                                            <kendo-datasource
                                                ref="serviceItemDS"
                                                :data="serviceItems"
                                                :change="dataSourceChanged"/>
                                            <kendo-grid
                                                id="gridServiceItem"
                                                class="grid-function"
                                                :data-source-ref="'serviceItemDS'"
                                                :sortable="false"
                                                :column-menu="true"
                                                :editable="true"
                                                v-on:databound="dataBound"
                                                :scrollable-virtual="true">
                                                <kendo-grid-column
                                                    :command="{iconClass: 'k-icon k-i-trash', text: ' ', click: removeRow, className: 'btn-plus isEditable'}"
                                                    :title="''"
                                                    :width="63"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"/>
                                                <kendo-grid-column
                                                    :title="$t('no.')"
                                                    :width="53"
                                                    :column-menu="false"
                                                    :template="rowNumberTmpl"
                                                    :headerAttributes="{style: 'background-color: #EDF1F5;', class: 'text-products'}"
                                                    :attributes="{style: 'text-align: products'}"/>
                                                <kendo-grid-column
                                                    :field="'item'"
                                                    :title="$t('item')"
                                                    :width="200"
                                                    :template="itemTemplate"
                                                    :editor="ItemDropDownEditor"
                                                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                                <kendo-grid-column
                                                    :field="'uom'"
                                                    :title="$t('uom')"
                                                    :width="120"
                                                    :template="UOMTemplate"
                                                    :editor="UOMDropDownEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: left'}"/>
                                                <kendo-grid-column
                                                    :field="'price'"
                                                    :title="$t('price')"
                                                    :width="200"
                                                    :template="'<span>#=price || 0#</span>'"
                                                    :editor="numberEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                                    :attributes="{style: 'text-align: right'}"/>
                                                    <kendo-grid-column
                                                    :field="'amount'"
                                                    :title="$t('amount')"
                                                    :width="200"
                                                    :editable="() => {return false;}"
                                                    :template="'<span>#=amount || 0#</span>'"
                                                    :editor="numberEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right'}"/>
                                                <kendo-grid-column
                                                    :field="'vatTax'"
                                                    :title="$t('vat')"
                                                    :width="200"
                                                    :template="vatTemplate"
                                                    :editor="VatTaxDropDownEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                                    :attributes="{ style: 'text-align: left' }"/>
                                            </kendo-grid>
                                        </v-col>
                                        <v-col sm="12" cols="12" class="pt-2">
                                            <v-btn
                                                color="primary"
                                                class="float-left btn_plus mr-2"
                                                @click="addRow">
                                                <v-icon size="" class="ma-1">mdi-plus</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                <v-divider/>
                                </v-card>
                            </v-col>
                            <v-col class="bigSide pr-2 py-1" sm="6" cols="12" style="transition: .3s ease-in;">
                                <v-card outlined dense class="px-4 no_border" color="grayBg">
                                    <v-row style="background-color: #fff;">
                                        <v-col sm="12" cols="12" class="pt-4 pb-0 px-4">
                                            <kendo-datasource
                                                ref="depositItemDS"
                                                :data="depositItems"
                                                :change="dataSourceChanged"/>
                                            <kendo-grid
                                                id="gridDepositItem"
                                                class="grid-function"
                                                :data-source-ref="'depositItemDS'"
                                                :sortable="false"
                                                :column-menu="true"
                                                :editable="true"
                                                v-on:databound="dataBound"
                                                :scrollable-virtual="true">
                                                <kendo-grid-column
                                                    :command="{iconClass: 'k-icon k-i-trash', text: ' ', click: removeRowDeposit, className: 'btn-plus isEditable'}"
                                                    :title="''"
                                                    :width="63"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"/>
                                                <kendo-grid-column
                                                    :title="$t('no.')"
                                                    :width="53"
                                                    :column-menu="false"
                                                    :template="rowNumberTmplDeposit"
                                                    :headerAttributes="{style: 'background-color: #EDF1F5;', class: 'text-products'}"
                                                    :attributes="{style: 'text-align: products'}"/>
                                                <kendo-grid-column
                                                    :field="'item'"
                                                    :title="$t('item')"
                                                    :width="200"
                                                    :template="itemTemplate"
                                                    :editor="ItemDropDownEditor"
                                                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                                <kendo-grid-column
                                                    :field="'uom'"
                                                    :title="$t('uom')"
                                                    :width="120"
                                                    :template="UOMTemplate"
                                                    :editor="UOMDropDownEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: left'}"/>
                                                <kendo-grid-column
                                                    :field="'price'"
                                                    :title="$t('price')"
                                                    :width="200"
                                                    :template="'<span>#=price || 0#</span>'"
                                                    :editor="numberEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                                    :attributes="{style: 'text-align: right'}"/>
                                                    <kendo-grid-column
                                                    :field="'amount'"
                                                    :title="$t('amount')"
                                                    :width="200"
                                                    :editable="() => {return false;}"
                                                    :template="'<span>#=amount || 0#</span>'"
                                                    :editor="numberEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right'}"/>
                                                <kendo-grid-column
                                                    :field="'vatTax'"
                                                    :title="$t('vat')"
                                                    :width="200"
                                                    :template="vatTemplate"
                                                    :editor="VatTaxDropDownEditor"
                                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                                    :attributes="{ style: 'text-align: left' }"/>
                                            </kendo-grid>
                                        </v-col>
                                        <v-col sm="12" cols="12" class="pt-2">
                                            <v-btn
                                                color="primary"
                                                class="float-left btn_plus mr-2"
                                                @click="addRowDeposit">
                                                <v-icon size="" class="ma-1">mdi-plus</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                <v-divider/>
                                </v-card>
                            </v-col>
                            <v-col class="bigSide pr-2 py-1" sm="12" cols="12" style="transition: .3s ease-in;">
                                <v-btn
                                    outlined
                                    class="text-capitalize  black--text float-left"
                                    color="primary"
                                    @click="cancel">{{ $t("cancel") }}
                                </v-btn>
                                <v-btn
                                    style="margin-left: 10px !important"
                                    class="float-right text-capitalize  white--text"
                                    @click="onSaveClose()"
                                    color="primary">{{ $t("save_pay") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                </v-form>
            </v-row>
            <LoadingMe :isLoading="showLoading" :fullPage="false" :myLoading="true"/>
        </v-container>
    </v-app>
</template>

<script>
// import kendo from "@progress/kendo-ui"
import {i18n} from "@/i18n";
import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
import {DropDownList} from "@progress/kendo-vue-dropdowns";
import kendo from "@progress/kendo-ui";
import ContractModel from "@/scripts/model/billing/Contract";
const customerHandler = require("@/scripts/customerHandler");
const productVariantHandler = require("@/scripts/productVariantHandler");
const uomPriceHandler = require("@/scripts/uomPriceHandler");
const accountHandler = require("@/scripts/handler/accounting/account");
const priceLevelHandler = require("@/scripts/priceLevelHandler");
const settingHandler = require("@/scripts/settingHandler");
// const locationHandler = require("@/scripts/locationHandler")
const billingSettingHandler = require("@/scripts/billingSettingHandler")
const textField = "numberName";
const keyField = "id";
const $ = kendo.jQuery
const defaultItem = {[textField]: "Select customer...", [keyField]: null};
const emptyItem = {[textField]: "loading ..."};
const pageSize = 10;
const loadingData = [];
const contractModel = new ContractModel({});
while (loadingData.length < pageSize) {
    loadingData.push({...emptyItem});
}
export default {
    name: "CustomerInvoice",
    props: ["id", "transactionDate"],
    components: {
        LoadingMe: () => import(`@/components/Loading`),
        "app-datepicker": DatePickerComponent,
        dropdownlist: DropDownList,
    },
    data: () => ({
        showLoading: false,
        valid: false,
        customer: {},
        cusBaseUrl: customerHandler.searchv1(),
        customerList: [],
        dataItemKey: "id",
        defaultItem: defaultItem,
        contract: contractModel,
        priceLevel: [],
        textField: "numberName",
        filter: "",
        contractTypes: [],
        locations: [],
        subLocations: [],
        boxs: [],
        countries: [],
        provinces: [],
        districts: [],
        communes: [],
        villages: [],
        serviceItems: [],
        itemlist: {
            item: {},
            amount: 0,
            uom: {},
            price: 0,
            txnRate: 1
        },
        receivableAcc: [],
        isPriceLevelChanged: false,
        depositItems: [],
        dimentsions: []
    }),
    methods: {
        cancel() {
            this.$swal({
                title: i18n.t("msg_title_warning"),
                text: i18n.t("msg_discard"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: i18n.t("cancel"),
                confirmButtonColor: "#4d4848",
                cancelButtonColor: "#ED1A3A",
                confirmButtonText: i18n.t("discard"),
            }).then((result) => {
                if (result.value) {
                    this.clear();
                    this.$router.go(-1);
                }
            });
        },
        afterFetch(json) {
            this.customerList = json.data;
            window.console.log('111',this.customerList)
        },
        onFilterChange(event) {
            const filter = event.filter.value;
            this.requestData(0, filter, this.cusBaseUrl);
            this.filter = filter;
        },
        requestData(skip, filter, baseUrl) {
            const url = baseUrl + `?filter=${filter}`;
            this.requestStarted = true;
            fetch(url).then((response) => {
                    return response.json();
            }).then(this.afterFetch);
        },
        async onInvoiceDateChanged() {
        },
        onChange(event) {
            const value = event.value;
            if (value && value[textField] === emptyItem[textField]) {
                return;
            }
            const id = value.id || ''
            if (id !== '') {
                this.customer = value;
            }
        },
        generateNumber() {},
        addRow() {
            window.console.log(1)
            let ds = this.$refs.serviceItemDS.kendoWidget(),
                total = ds.total();
                ds.insert(total, this.itemlist);
        },
        addRowDeposit() {
            window.console.log(1)
            let ds = this.$refs.depositItemDS.kendoWidget(),
                total = ds.total();
                ds.insert(total, this.itemlist);
        },
        removeRow(e) {
            e.preventDefault();
            const grid = kendo.jQuery("#gridServiceItem").data("kendoGrid"),
                dataSource = grid.dataSource,
                dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

            if (dataSource.total() > 1) {
                dataSource.remove(dataItem);
                // this.autoCalculate();
            }
        },
        removeRowDeposit(e){
             e.preventDefault();
            const grid = kendo.jQuery("#gridDepositItem").data("kendoGrid"),
                dataSource = grid.dataSource,
                dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

            if (dataSource.total() > 1) {
                dataSource.remove(dataItem);
                // this.autoCalculate();
            }
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.serviceItemDS.kendoWidget(),
                index = ds.indexOf(dataItem);
            return index + 1;
        },
        rowNumberTmplDeposit(dataItem){
            let ds = this.$refs.depositItemDS.kendoWidget(),
                index = ds.indexOf(dataItem);
            return index + 1;
        },
        dataBound: function (e) {
            const grid = kendo.jQuery("#gridServiceItem").data("kendoGrid");
            const items = e.sender.items();
            if (grid) {
                items.each(function () {
                    let dataItem = grid.dataItem(this);
                    $("tr[data-uid='" + dataItem.uid + "']").find('.isEditable')
                        .each(function () {
                            if (dataItem.isEditable === false) {
                                $(this).addClass("k-state-disabled");
                            }
                        });
                });
            }
        },
        itemTemplate(dataItem) {
            const item = dataItem.item;
            if (item) {
                return `<span>${item.name ? item.name : ``}</span>`;
            } else {
                return ``;
            }
        },
        ItemDropDownEditor(container, options) {
            kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                height: 400,
                filter: "contains",
                dataTextField: "name",
                dataValueField: "id",
                headerTemplate:
                    '<div class="dropdown-header k-widget k-header">' +
                    "<span>Items </span>" +
                    "<span></span>" +
                    "</div>",
                template: "<span>#=name#</span>",
                optionLabel: "--- Select ---",
                dataSource: new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: productVariantHandler.itemSearchURL('?plId=' + this.contract.priceLevel.id + '&reUsed=1'),
                        },
                        dataType: "json",
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "string"},
                                name: {type: "string"},
                                sku: {type: "string"},
                            },
                        },
                        data: function (response) {
                            return response.data;
                        },
                        total: function (response) {
                            return response.data.count;
                        },
                    },
                    // data: this.variants
                }),
            });
        },
        UOMTemplate(dataItem) {
            const uom = dataItem.uom;
            const code = uom.code || ''
            if (uom) {
                return `<span>${uom.uom ? code : ``}</span>`;
            } else {
                return ``;
            }
        },
        UOMDropDownEditor(container, options) {
            kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                height: 400,
                filter: "startswith",
                dataTextField: "code",
                dataValueField: "uomConvertId",
                cascadeFrom: "item",
                template: "<span>#= code || `No Price Level`#</span>",
                optionLabel: "--- Select ---",
                dataSource: new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: {url: uomPriceHandler.uomPriceByPriceLevelURL("id=" + options.model.item.id + "&plId=" + this.contract.priceLevel.id + "&date=" + this.contract.transactionDate),},
                        dataType: "json",
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "string"},
                                // name: {type: "string"},
                                // sku: {type: "string"},
                            },
                        },
                        data: function (response) {
                            return response.data
                        },
                        total: function (response) {
                            return response.data.count;
                        },
                    },
                    // data: this.variants
                }),
            });
        },
        async loadAccount() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    accountHandler.getAll().then((res) => {
                        this.showLoading = false;
                        //Receivable Account
                        this.receivableAcc = res.data.filter((m) => m.account_type.number === 7).map((itm) => {
                            return {
                                id: itm.uuid,
                                uuid: itm.uuid,
                                name: itm.name,
                                local_name: itm.local_name,
                                number: itm.number,
                                is_taxable: itm.is_taxable,
                                banhjiAccCode: itm.banhjiAccCode,
                                group_code: itm.group_code,
                                parent_account: itm.parent_account,
                                type_code: itm.type_code,
                                account_type: itm.account_type,
                            };
                        });
                        if(this.receivableAcc.length > 0){
                            this.contract.receivableAcc = this.receivableAcc[0]
                        }
                    });
                }, 10);
            });
        },
        async loadPriceLevel() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const strFilter = '?nature=sale'
                    priceLevelHandler.get(strFilter).then((res) => {
                        this.priceLevel = res;
                        if(res.length > 0){
                            this.contract.priceLevel = res[0]
                        }
                    });
                }, 10);
            });
        },
        numberEditor(container, options) {
            kendo.jQuery('<input data-bind="value:' + options.field + '"/>').appendTo(container).kendoNumericTextBox({
                decimals: 30,
                min: 0.00001
            });
        },
        async dataSourceChanged(e) {
            if (e.field) {
                let dataRow = e.items[0], item = {},
                    buom = {}, vTax = {}, spTax = {}, otTax = {}, plTax = {},
                    conversionRate = 1,
                    wac = 0,
                    qoh = 0,
                    amount = 0,
                    xAmount = 0;
                switch (e.field) {
                    case "item":
                        // this.attribute_ = this.attributes.filter(m => m.type.id === dataRow.variant.id)
                        item = dataRow.item || {}
                        dataRow.set("description", item.description || '');
                        buom = item.uom || {};
                        dataRow.set("buom", buom);
                        // dataRow.set('uom', buom)
                        // window.console.log(dataRow.item,'row')
                        // await this.inventoryBalance(dataRow, dataRow.item.id)
                        break;
                    case "price":
                        try {
                            amount = parseFloat(dataRow.price) // parseFloat(dataRow.qty);
                            xAmount = amount * parseFloat(this.contract.txnRate);

                            dataRow.set("price", parseFloat(dataRow.price));
                            dataRow.set("amount", amount);
                            dataRow.set("exchangeAmount", xAmount);
                            // window.console.log('price',dataRow.price)
                        } catch {
                            dataRow.set("price", 0);
                            dataRow.set("amount", 0);
                            dataRow.set("exchangeAmount", 0);
                        }
                        break;
                    case "uom":
                        if (this.isPriceLevelChanged === false) {
                            try {
                                buom = dataRow.uom.buom || {};
                                qoh = dataRow.uom.qoh || 0;
                                conversionRate = dataRow.uom.conversionRate || 1;
                                wac = dataRow.uom.wac || 0;
                                dataRow.set("buom", buom);
                                dataRow.set("wac", wac);
                                dataRow.set("qoh", qoh);
                                /* todo: mapping tax object */
                                vTax = this.taxMapping(this.vatTax, dataRow.uom.vatTax || {})
                                otTax = this.taxMapping(this.otherTax, dataRow.uom.otherTax || {})
                                spTax = this.taxMapping(this.specificTax, dataRow.uom.specificTax || {})
                                plTax = this.taxMapping(this.publicLightingTax, dataRow.uom.publicLightingTax || {})

                                dataRow.set("vatTax", vTax);
                                dataRow.set("specificTax", spTax);
                                dataRow.set("otherTax", otTax);
                                dataRow.set("publicLightingTax", plTax);

                                dataRow.set("conversionRate", parseFloat(conversionRate));
                                if (dataRow.uom) {
                                    amount = parseFloat(dataRow.uom.price) //* parseFloat(dataRow.qty);
                                    xAmount = amount * parseFloat(this.contract.txnRate);

                                    dataRow.set("price", parseFloat(dataRow.uom.price));
                                    dataRow.set("amount", amount);
                                    dataRow.set("exchangeAmount", xAmount);
                                } else {
                                    amount = parseFloat(dataRow.price) //* parseFloat(dataRow.qty);
                                    xAmount = amount * parseFloat(this.contract.txnRate);

                                    dataRow.set("price", parseFloat(dataRow.price));
                                    dataRow.set("amount", amount);
                                    dataRow.set("exchangeAmount", xAmount);
                                }
                            } catch (err) {
                                window.console.log("error", err);
                                dataRow.set("buom", {});
                                dataRow.set("conversionRate", 1);
                                dataRow.set("price", 0);
                                dataRow.set("qoh", 0);
                                dataRow.set("wac", 0);
                                dataRow.set("amount", 0);
                                dataRow.set("exchangeAmount", 0);
                            }
                        }
                        break;
                    case "qty":
                        try {
                            amount = parseFloat(dataRow.price) //* parseFloat(dataRow.qty);
                            xAmount = amount * parseFloat(this.contract.txnRate);

                            dataRow.set("price", parseFloat(dataRow.price));
                            dataRow.set("amount", amount);
                            dataRow.set("exchangeAmount", xAmount);
                        } catch {
                            dataRow.set("price", 0);
                            dataRow.set("amount", 0);
                            dataRow.set("exchangeAmount", 0);
                        }
                        break;
                    case "otherTax":
                        // window.console.log("--", dataRow)
                        break;
                    default:
                        break;
                }
                // if (e.field) {
                //     this.autoCalculate();
                //     // this.rawForJournal()
                // }
            }
        },
        async loadTax() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    settingHandler.get().then((res) => {
                        this.tax = res;
                        this.otherTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 7 || m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        this.specificTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 8 || m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        this.publicLightingTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 9 || m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        this.vatTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 1 ||
                                    m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        // window.console.log('tax', JSON.stringify(this.vatTax))
                    });
                }, 10);
            });
        },
        VatTaxDropDownEditor(container, options) {
            kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                height: 400,
                filter: "startswith",
                dataTextField: "defaultTax",
                dataValueField: "id",
                template: "<span>#=defaultTax || ``#</span>",
                optionLabel: "--Select--",
                dataSource: new kendo.data.DataSource({
                    data: this.vatTax,
                }),
            });
        },
        vatTemplate(dataItem) {
            const vat = dataItem.vatTax;
            if (vat) {
                return `<span>${vat.defaultTax || ``}</span>`;
            } else {
                return ``;
            }
        },
        taxMapping(objTax, tax) {
            const taxId = tax.id || ''
            const tax_ = objTax.filter(t => t.id === taxId)[0]
            return tax_ || {
                id: '',
                defaultTax: ''
            }
        },
        onSaveClose(){},
        // async loadLocation() {
        //     new Promise(resolve => {
        //         setTimeout(() => {
        //             resolve('resolved');
        //             locationHandler.list().then(res => {
        //                 if(res.data.statusCode === 200){
        //                     this.locations = res.data.data
        //                 }
                        
        //             })
        //         }, 300);
        //     })
        // },
        async loadDimension() {
            let param= {
                type: "dimension"
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    billingSettingHandler.getDimension(param).then(res => {
                        if(res.data.statusCode === 200){
                            window.console.log(res.data,11)
                            this.dimentsions = res.data.data
                            this.locations   = this.dimentsions.filter(index => index.type =="location")
                        }
                    })
                }, 300);
            })
        },
        locationChange(){
            this.subLocations = this.dimentsions.filter(index => index.parentId == this.contract.location.id) 
        },
        subLocationChange(){
            this.boxs = this.dimentsions.filter(index => index.parentId == this.contract.subLocation.id) 
            window.console.log('boxs', this.boxs)
        }
    },
    computed: {
        validCustomer: function () {
            return this.customer.id !== undefined && this.customer.id !== null;
        },
    },
    watch: {

    },
    created() {
        this.loadPriceLevel();
        this.loadTax();
    },
    mounted: async function () {
        this.requestData(0, this.filter, this.cusBaseUrl);
        await this.loadAccount();
        await this.loadDimension()
    }
};
</script>

<style scoped>
.k-dropdown {
    width: 100%;
    margin-top: 3px;
}

.function_wrapper {
    box-shadow: none !important;
}

.v-application--is-ltr .v-text-field .v-input__append-inner {
    margin-top: 0 !important;
}

.v-input__slot {
    background-color: #fff !important;
}

.function_content .label {
    margin-bottom: 10px;
    display: inline-block;
}

.border_radius10 {
    border-radius: 10px !important;
    background-color: #f2f2f2;
}

.pa-3.v-card h4 {
    font-size: 18px;
    color: #333;
}

.pa-3.v-card p {
    font-size: 12px;
    color: #b5b5b5;
}

.attachment_file {
    background-color: #efeded;
    border-radius: 0 !important;
}

.attachment_table.v-data-table table {
    border: thin solid rgba(0, 0, 0, 0.12);
}

.attachment_table table tr th {
    border-left: thin solid rgba(0, 0, 0, 0.12);
    height: 35px;
    border-right: thin solid rgba(0, 0, 0, 0.12);
}

.block_debit,
.block_credit {
    border-bottom: 1px solid #fff;
}

.block_debit p.number,
.block_credit p.number {
    font-size: 25px;
    color: #7f7f7f;
}

.block_debit h5,
.block_credit h5,
.block_difference h5 {
    text-transform: uppercase;
    color: #7f7f7f;
    font-size: 15px;
    font-weight: normal;
}

.block_difference h5 {
    font-size: 18px;
}

.block_difference h5 span {
    font-size: 15px;
}

.custom_grid table th:last-child {
    text-align: right !important;
}

.color_green {
    color: #c80000;
}

@media (min-width: 1264px) {
    .container {
        max-width: 1250px;
    }
}

@media (max-width: 576px) {
    .pt-6.col-sm-5.col-12 {
        padding-top: 0 !important;
    }

    .code_text {
        width: 100%;
    }

    .phone_no_pt {
        padding-top: 0 !important;
    }

    .select_template,
    .save_option {
        margin-bottom: 10px;
    }
}

.hide_small_bar_class {
    max-width: 0;
    transition: 0.5s ease-in;
    flex: 0 0 0;
}

.hide_big_bar_class {
    max-width: 100%;
    transition: 0.5s ease-in;
    flex: 0 0 100%;
}

.info_add {
    background-color: #ffffff;
}

.small_sidebar {
    height: 98%;
    position: relative;
    padding: 12px;
    background-color: #edf1f5;
}

.my_card h3 {
    display: block !important;
}

.iconArrow {
    right: -35px;
    position: absolute;
    bottom: -10px;
}

.iconArrowHide {
    position: absolute;
    right: -7px;
    bottom: -10px;
}

.color_grey {
    color: #808080;
}

.card_green {
    min-height: 70px;
    background-color: #c80000 !important;
    color: #ffffff;
}

.lb_bold {
    font-size: 12px;
}

.detial_smallside_p {
    position: absolute;
    bottom: 10px;
}

.card_background {
    background-color: #edf1f5;
    min-height: 120px;
}

.deposite_input {
    width: 100px;
}

.btn_save_draft {
    color: #ffffff;
    background-color: #00b0f0 !important;
    text-transform: capitalize;
}

.save_option {
    background-color: #203864 !important;
}

.btn_add_small {
    height: 27px !important;
    min-width: 25px !important;
    font-size: 10px;
    padding: 0 22px !important;
    background-color: #c80000 !important;
    color: #ffffff;
    border-radius: 0 !important;
}

.list_site_inv {
    background-color: #f44336;
    color: #ffffff;
    font-size: 12px;
}

.list_site_exp {
    background-color: #c5e0b4;
    color: #000000;
    font-size: 12px;
    line-height: 16px;
    min-height: 40px;
}

.checkbox_inv {
    padding: 2px;
    margin-top: 3px;
    margin-right: 2px;
}

.exp_select {
    font-size: 12px !important;
}

.theme--light.v-data-table
> .v-data-table__wrapper
> table
> tbody
> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

.b_add {
    height: 30px !important;
}
</style>
ss