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
                                            <label class="label  mb-0">{{ $t("due_date") }}</label>
                                            <app-datepicker
                                                :initialDate="invoice.dueDate"
                                                @emitDate="invoice.dueDate = $event"/>
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
                                                        CL
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
                                                v-model="contract.contractLevel"
                                                :items="contractLevels"
                                                item-value="id"
                                                item-text="name"
                                                :rules="[(v) => !!v || 'contract type is required']"
                                                return-object
                                                outlined/>
                                            <label class="label mb-0">{{ $t("term") }}</label>
                                            <v-select
                                                class="mt-1"
                                                v-model="invoice.paymentTerm"
                                                :items="paymentTerms"
                                                placeholder="Term"
                                                :rules="[(v) => !!v['id'] || $t('is_required')]"
                                                item-text="name"
                                                item-value="id"
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
                                                @change="onPriceLevelChange"
                                                return-object
                                                placeholder="Price Level"
                                                tage="Default Price Level"
                                                outlined
                                                :rules="[(v) => !!v['id'] || $t('is_required')]"/>
                                            <v-col
                                                sm="12"
                                                col="12"
                                                class="d-flex justify-space-between pt-0">
                                                <div>
                                                    <p class="label mb-0">{{ $t("currency") }}</p>
                                                    <p class="label mb-0 mt-4">{{ currencyCode }}</p>
                                                </div>
                                                <div>
                                                    <p class="label mb-0">{{ $t("rate") }}</p>
                                                    <p class="label mb-0 mt-4">{{ transactionRate }}</p>
                                                </div>
                                            </v-col>
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
                                                item-value="abbreviation"
                                                :item-text="(item) =>`${item.abbreviation} - ${item.country}`"
                                                :rules="[(v) => !!v['abbreviation'] || $t('is_required')]"
                                                return-object
                                                tage="Country"
                                                @change="onChangeCountry"
                                                placeholder="Country"
                                                outlined=""/>
                                            <label class="label font_14">{{ $t("Commune") }}</label>
                                            <v-select
                                                class=" mt-1"
                                                v-model="contract.commune"
                                                :items="communes"
                                                item-value="id"
                                                :item-text="(item) => `${item.name} - ${item.nameLocal}`"
                                                @change="onChangeCommune"
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
                                                :item-text="(item) => `${item.name} - ${item.nameLocal}`"
                                                item-value="id"
                                                tage="Province"
                                                return-object
                                                clearable
                                                @change="onChangeProvince"
                                                placeholder="Province"
                                                outlined/>
                                            <label class="label font_14">{{ $t("village") }}</label>
                                            <v-select
                                                class=" mt-1"
                                                v-model="contract.village"
                                                :items="villages"
                                                item-value="id"
                                                :item-text="(item) => `${item.name} - ${item.nameLocal}`"
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
                                                :item-text="(item) => `${item.name} - ${item.nameLocal}`"
                                                item-value="id"
                                                tage="District"
                                                @change="onChangeDistrict"
                                                clearable
                                                return-object
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
                                                    :command="{iconClass: 'k-icon k-i-trash', text: ' ', click: removeRow}"
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
                                                    :change="changedDeposit"
                                                    :data="depositLine"/>
                                                <kendo-grid
                                                    id="gridSaleDeposit"
                                                    class="grid-function"
                                                    :data-source-ref="'depositItemDS'"
                                                    :sortable="false"
                                                    :filterable="false"
                                                    :column-menu="true"
                                                    :editable="true"
                                                    :scrollable-virtual="true">
                                                    <kendo-grid-column
                                                        :command="{iconClass: 'k-icon k-i-trash', text: ' ', click: removeRowDeposit}"
                                                        :title="''"
                                                        :width="63"
                                                        :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
                                                    <kendo-grid-column
                                                        :title="$t('no.')"
                                                        :width="54"
                                                        :template="rowNumberTmplDeposit"
                                                        :column-menu="false"
                                                        :headerAttributes="{style: 'background-color: #EDF1F5;', class: 'text-products'}"
                                                        :attributes="{style: 'text-align: products'}"/>
                                                    <kendo-grid-column
                                                        :field="'paymentOption'"
                                                        :title="$t('payment_option')"
                                                        :width="250"
                                                        :template="methodTemplate"
                                                        :editor="PaymentOptionEditor"
                                                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                                    <kendo-grid-column
                                                        :field="'account'"
                                                        :title="$t('account')"
                                                        :width="200"
                                                        :editable="() => {return false}"
                                                        :template="accountTemplate"
                                                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                                    <kendo-grid-column
                                                        :field="'description'"
                                                        :title="$t('description')"
                                                        :width="200"
                                                        :template="'<span>#=description#</span>'"
                                                        :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                                    <kendo-grid-column
                                                        :field="'amount'"
                                                        :title="$t('amount')"
                                                        :width="200"
                                                        :template="amountTemplate"
                                                        :editor="amountEditor"
                                                        :headerAttributes="{style:'text-align: right; background-color: #EDF1F5'}"
                                                        :attributes="{style: 'text-align: right'}"/>
                                                    <kendo-grid-column
                                                        :field="'refNo'"
                                                        :title="$t('payment_ref')"
                                                        :width="200"
                                                        :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                        :attributes="{style: 'text-align: right'}"/>
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
import SaleDepositModel from "@/scripts/sale_deposit/model/SaleDeposit";
import PaymentOptionEditor from "@/scripts/kendo_editor/PaymentOptionEditor";
import ItemLineModel from "@/scripts/sale_deposit/model/ItemLine";
import InvoiceModel from "@/scripts/invoice/model/Invoice";
import {dataStore} from "@/observable/store";
const settingsHandler = require("@/scripts/settingsHandler");
const paymentTermHandler = require("@/scripts/settingsHandler");
const customerHandler = require("@/scripts/customerHandler");
const productVariantHandler = require("@/scripts/productVariantHandler");
const uomPriceHandler = require("@/scripts/uomPriceHandler");
const accountHandler = require("@/scripts/handler/accounting/account");
const priceLevelHandler = require("@/scripts/priceLevelHandler");
const settingHandler = require("@/scripts/settingHandler");
const otherHandler = require("@/scripts/otherHandler");
const currencyHandler = require("@/scripts/currency/handler/currencyHandler");
const billingSettingHandler = require("@/scripts/billingSettingHandler")
const textField = "numberName";
const keyField = "id";
const OPTION_TYPE = "Customer";
const $ = kendo.jQuery
const defaultItem = {[textField]: "Select customer...", [keyField]: null};
const emptyItem = {[textField]: "loading ..."};
const pageSize = 10;
const loadingData = [];
const contractModel = new ContractModel({});
const saleDepositModel = new SaleDepositModel({});
const itemLineModel = new ItemLineModel({});
const invoiceModel = new InvoiceModel({});
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
        dimentsions: [],
        contractLevels: [],
        country: [],
        depositLine: [],
        saleDeposit: saleDepositModel,
        PaymentOptionEditor: PaymentOptionEditor,
        itemLine: itemLineModel,
        currencyCode: '',
        transactionRate: 1,
        invoice: invoiceModel,
        paymentTerms: []
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
                window.console.log(result)
                if (result.value) {
                    // this.clear();
                    // this.$router.go(-1);
                    this.$router.push({name: 'Contract'});
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
            await this.onPriceLevelChange()
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
                ds.insert(total, this.itemLine);
                this.itemLine.optionType = OPTION_TYPE;
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
            const grid = kendo.jQuery("#gridSaleDeposit").data("kendoGrid"),
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
                            this.loadTransactionRate()
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
        onSaveClose(){
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = new ContractModel({
                        customer:           this.customer,
                        receivableAcc:      this.contract.receivableAcc,
                        number:             this.contract.number,
                        contractLevel:      this.contract.contractLevel,
                        priceLevel:         this.contract.priceLevel,
                        country:            this.contract.country,
                        province:           this.contract.province,
                        district:           this.contract.district,
                        commune:            this.contract.commune,
                        village:            this.contract.village,
                        transactionDate:    this.contract.transactionDate,
                        abbr:               this.contract.abbr,
                        location:           this.contract.location,
                        subLocation:        this.contract.subLocation,
                        box:                this.contract.box,
                        invoiceId:          this.contract.invoiceId,
                        invoice:            new InvoiceModel({
                            id:                 this.contract.invoiceId || "",
                            uuid:               this.contract.invoiceId || "",
                            journal_uuid:       this.invoice.journal_uuid? this.invoice.journal_uuid: "",
                            type:               "Invoice",
                            number:             this.invoice.number,
                            transactionDate:    this.contract.transactionDate,
                            customer:           this.customer,
                            receivableAcc:      this.contract.receivableAcc,
                            location:           this.contract.location,
                            rate:               1,
                            priceLevel:         this.contract.priceLevel,
                            dueDate:            this.invoice.dueDate,
                            monthOf:            this.contract.transactionDate,
                            currency:           this.contract.priceLevel.currency,
                            paymentTerm:        this.invoice.paymentTerm,

                            // abbr:               this.invoice.transactionType.abbr,
                            // transactionType:    this.invoice.transactionType,
                            // approvedTerm:       this.invoice.approvedTerm,
                            
                            // txnRate:            this.invoice.txnRate,
                            // taxExchangeRate:    this.invoice.taxExchangeRate,
                            // exchangeRate:       this.invoice.exchangeRate,
                            // exchangeAmount:     this.invoice.exchangeAmount,
                            // itemLines:          dataRow,
                            // segment:            this.invoice.segment,
                            // saleChannel:        this.invoice.saleChannel,
                            // billingAddress:     this.invoice.billingAddress,
                            // deliveryAddress:    this.invoice.deliveryAddress,
                            // deliveryDateTime:   this.invoice.deliveryDateTime,
                            // transactionNote:    this.invoice.transactionNote,
                            // journalNote:        this.invoice.journalNote,
                            // subTotal:           this.invoice.subTotal,
                            // exchangeSubTotal:   this.invoice.exchangeSubTotal,
                            // total:              this.invoice.total,
                            // exchangeTotal:      parseFloat(this.invoice.total) * parseFloat(this.invoice.txnRate),
                            // discountTotal:      this.invoice.discountTotal,
                            // specificDiscountTotal:  this.invoice.specificDiscountTotal,
                            // deliveryFee:            this.invoice.deliveryFee,
                            // totalTaxAmount:         this.invoice.totalTaxAmount,
                            // depositAmount:          this.invoice.depositAmount,
                            // depositDeduction:       this.invoice.depositDeduction,
                            // remainingAmount:        this.invoice.remainingAmount,
                            // amountDue:              this.invoice.amountDue,
                            // currentBalance:         this.invoice.currentBalance,
                            // balance:                this.invoice.balance,
                            // creditLimit:            this.invoice.creditLimit,
                            // saveOption:             this.invoice.saveOption,
                            // status:                 1,
                            // approvedBy:             this.invoice.approvedBy,
                            // formTemplate:           this.templatesForm[this.template],
                            // specificDiscountItem:   this.invoice.specificDiscountItem,
                            // otherCharge:            this.mOtherCharge,
                            // otherChargeLine:        this.invoice.otherChargeLine,
                            // otherChargeAmount:      this.invoice.otherChargeAmount,
                            // lateFee:                this.invoice.lateFee,
                            // publicLink:             this.invoice.publicLink,
                            // paymentCode:            this.invoice.paymentCode,
                            // taxListTotal:           this.taxListTotal,
                            // customerDiscountItem:       this.customerDiscountItem,
                            // customerOtherChargeItem:    this.customer.customerOtherChargeItem,
                            // customerSaleUnit:           this.customerSaleUnit,
                            // customerSaleUnitLine:       this.customerSaleUnitLine,
                            // paymentScheme:              this.invoice.paymentScheme,
                            // createdAt:                  this.invoice.createdAt,
                            // loggedUser:                 this.loggedUser,
                            // isAutoGenerate:             isAutoGenerate,
                            // jRaw:                       this.jRaw,
                            // sourceTransaction:          sourceTxn,
                            // itemSubtotal:               this.invoice.itemSubtotal,
                            // exchangeItemSubtotal:       this.invoice.exchangeItemSubtotal,
                            // serviceSubtotal:            this.invoice.serviceSubtotal,
                            // exchangeServiceSubtotal:    this.invoice.exchangeServiceSubtotal,
                            // txnItmSubtotal:             this.invoice.txnItmSubtotal,
                            // exchangeTxnItmSubtotal:     this.invoice.exchangeTxnItmSubtotal,
                            // itemDiscount:               this.invoice.itemDiscount,
                            // exchangeItemDiscount:       this.invoice.exchangeItemDiscount,
                            // serviceDiscount:            this.invoice.serviceDiscount,
                            // exchangeServiceDiscount:    this.invoice.exchangeServiceDiscount,
                            // txnItmDiscount:             this.invoice.txnItmDiscount,
                            // exchangeTxnItmDiscount:     this.invoice.exchangeTxnItmDiscount,
                            // cashPayment:                new PaymentOptionModel(this.invoice.cashPayment),
                            // qrPayment:                  new PaymentOptionModel(this.invoice.qrPayment),
                            // bankTransfer:               new PaymentOptionModel(this.invoice.bankTransfer),
                            // billPayment:                new PaymentOptionModel(this.invoice.billPayment),
                            // refFrom:                    this.invoice.refFrom || [],
                            // refTo:                      this.invoice.refTo || [],
                            // saleTaxDetail:              this.invoice.saleTaxDetail || [],
                            // cashBasicIncomeAcc:         this.invoice.cashBasicIncomeAcc || [],
                            // actionType:                 this.$route.params.id ? this.$route.query.type : "new",
                        })
                    })
                    
                    window.console.log('data', data)
                }, 300);
            })
        },
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
                type: "location"
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
        },
        async loadContractLevel(){
            billingSettingHandler.getContractLevel().then(res => {
                window.console.log('res',res)
                if (res.data.statusCode === 200) {
                    this.dialogM1 = false
                    this.contractLevels = res.data.data
                }
                
            })
        },
        async onloadCountry(location, parent) {
            billingSettingHandler.get(location, parent).then(res => {
                this.country = res
                window.console.log('coun', this.country)

            })
        },
        async loadCountry() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    otherHandler.country().then((res) => {
                        this.showLoading = false;
                        this.countries = res;
                        if(this.countries.length > 0){
                            this.contract.country = this.countries.filter(index => index.country =="Cambodia").map(i => {
                                return {
                                    country:        i.country,
                                    abbreviation:   i.abbreviation
                                }
                            })[0]
                            this.onChangeCountry()
                        }
                    });
                }, 10);
            });
        },
        onChangeCountry() {
            let coun = this.country.filter(c => c.name == this.contract.country.country).map(i => {
                return {id: i.id}
            })[0]
            billingSettingHandler.get('province', coun.id).then(res => {
                this.provinces = res
            })
        },
        onChangeProvince() {
            let province = this.contract.province
            window.console.log('province', province)
            billingSettingHandler.get('district', province.id).then(res => {
                this.districts = res
                 window.console.log('districts',this.districts )
            })
        },
        onChangeDistrict() {
            let district =  this.contract.district
            billingSettingHandler.get('commune', district.id).then(res => {
                this.communes = res
            })
        },
        onChangeCommune() {
            let commune = this.contract.commune
            billingSettingHandler.get('village', commune.id).then(res => {
                this.villages = res
            })
        },
        accountTemplate(dataItem) {
            const acc = dataItem.account;
            if (acc) {
                return `<span>${acc.name ? acc.name : ``}</span>`;
            } else {
                return ``;
            }
        },
        amountTemplate(dataItem) {
            const amt = dataItem.amount;
            if (amt) {
                return kendo.toString(
                    parseFloat(amt),
                    `n2`
                );
            } else {
                return kendo.toString(
                    parseFloat(0),
                    `n2`
                );
            }
        },
        amountEditor(container, options) {
            kendo
                .jQuery('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    min: 0,
                    decimals: 30,
                    format: `n2`,
                });
        },
        methodTemplate(dataItem) {
            const method = dataItem.paymentOption || {};
            if (method) {
                return `<span>${method.bankAccountName || ``}</span>`;
            } else {
                return ``;
            }
        },
        changedDeposit(e) {
            if (e.field) {
                let dataRow = e.items[0],
                    pOption = {};
                switch (e.field) {
                    case "paymentOption":
                        pOption = dataRow.paymentOption || {};
                        dataRow.set("account", pOption.account || {});
                        break;
                    default:
                        break;
                }
                // if (e.field) {
                //     this.autoCalculate();
                // }
            }
        },
        onPriceLevelChange() {
            this.isPriceLevelChanged = true
            this.loadTransactionRate()
            // this.clearUOMItem()
            // this.loadLateFee()
        },
        async loadTransactionRate() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const date = new Date(this.contract.transactionDate).toISOString().substr(0, 10);
                    const priceLevel = this.contract.priceLevel || {};
                    const currency = priceLevel.currency || {}
                    const code = currency.code || ''
                    if (code) {
                        this.showLoading = true;
                        currencyHandler.getLastExchangeRateByDate(date, code).then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.showLoading = false;
                                    this.exchangeRate = res.data.data[0];
                                    this.currencyCode = this.exchangeRate.code;
                                    window.console.log('exchangeRate',this.exchangeRate)
                                    this.transactionRate = this.exchangeRate.rate;
                                    this.showLoading = false;
                                    // this.loadCustomerDepositBalance(this.customer.id);
                                }
                            });
                    }
                    // this.loadSaleOrder();
                    // this.loadTransactionTaxRate();
                }, 10);
            });
        },
        async loadPaymentTerm() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const strFilter = "?type=pmt-customer";
                    paymentTermHandler.getPaymentTerm(strFilter).then((res) => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false;
                            this.paymentTerms = res.data.data;
                            // if (this.paymentTerms.length > 0) {
                            //     this.invoice.paymentTerm = this.paymentTerms[0];
                            // }
                        }
                    });
                }, 10);
            });
        },
        async loadSegment() {
            window.console.log('dataStore.roleData', dataStore)
            const roleType = dataStore.roleType || 0
            if (roleType === 0) {
                if (dataStore.roleData) {
                    const roleData = dataStore.roleData || []
                    const segment = roleData.filter(itm => itm.type === 'segment')
                    const segmentDefault = segment.filter(m => m.isDefault === 1)
                    this.segments = segment
                    if (this.$route.params.id === undefined || this.$route.params.id === '') {
                        if (segmentDefault.length > 0) {
                            this.invoice.segment = segmentDefault[0];
                        }
                    }
                }
            } else if (roleType === 1) {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        this.segments = [];
                        settingsHandler
                            .getSeg()
                            .then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.showLoading = false;
                                    this.segments = res.data.data;
                                    if (this.segments.length > 0) {
                                        this.invoice.segment = this.segments[0];
                                    }
                                }
                            })
                    }, 10);
                });
            }


        },
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
         await this.onloadCountry('country', 0)
        await this.loadAccount();
        await this.loadDimension()
        await this.loadContractLevel()
        await this.loadCountry()
        await this.loadPaymentTerm()
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