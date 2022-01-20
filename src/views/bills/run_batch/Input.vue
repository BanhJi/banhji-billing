<template>
    <v-row>
        <v-col cols="12" sm="12">
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card outlined dense class="px-3 no_border mb-3" color="white">
                    <v-row class="grayBg">
                        <v-col sm="3" cols="6" class="pb-0">
                            <label class="label mb-0">{{ $t("invoice_type") }}</label>
                            <v-select
                                class="mt-1"
                                :items="invoiceTypes"
                                item-value="id"
                                item-text="name"
                                :disabled="disabledMe"
                                v-model="runBach.transactionType"
                                :rules="[(v) => !!v || 'Transaction Currency is required']"
                                return-object
                                outlined/>
                            <label class="label  mb-0">{{ $t("date") }}</label>
                            <app-datepicker
                                :initialDate="runBach.transactionDate"
                                :disabled="disabledMe"
                                @onChanged="onInvoiceDateChanged"
                                @emitDate="runBach.transactionDate = $event"/>
                            <label class="label mb-0">{{ $t("number") }}</label>
                            <v-row class="mt-1 mr-0">
                                <v-col sm="3" cols="3" class="py-0 pr-0">
                                    <div class="code_text text-bold">
                                        {{ runBach.transactionType.abbr }}
                                    </div>
                                </v-col>
                                <v-col sm="7" cols="7" class="py-0 pl-0 pr-1">
                                    <v-text-field
                                        class=" custom-border "
                                        v-model="runBach.number"
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
                                        :disabled="disabledMe"
                                        @click="generateNumber">mdi-qrcode
                                    </v-icon>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col sm="3" cols="6" class="pb-0">
                            <label class="label mb-0">{{ $t("customer_group") }}</label>
                            <v-select
                                :items="customerGroups"
                                item-value="id"
                                item-text="name"
                                return-object
                                @change="onCustomerTypeChanged('')"
                                v-model="mCustomerGroup"
                                :placeholder="$t('customer_group')"
                                clearable
                                outlined/>
                            <label class="label mb-0">{{ $t("late_fee") }}</label>
                            <v-select
                                class="mt-1"
                                v-model="runBach.lateFee"
                                :items="lateFeeList"
                                item-value="id"
                                :item-text="(item) => `${item.code} - ${item.name}`"
                                return-object
                                placeholder="Late Fee"
                                tage="Late Fee"
                                clearable
                                outlined/>
                            <label class="label">{{ $t("for_month_of") }}</label>
                            <month-picker 
                                :initialMonth="runBach.monthOf" 
                                @emitMonth="runBach.monthOf = $event"/>
                        </v-col>
                        <v-col sm="3" cols="6" class="pb-0">
                            <label class="label  mb-0">{{ $t("due_date") }}</label>
                            <app-datepicker
                                :initialDate="runBach.dueDate"
                                @emitDate="runBach.dueDate = $event"/>
                            <label class="label mb-0">{{ $t("price_level") }}</label>
                            <v-select
                                class="mt-1"
                                v-model="runBach.priceLevel"
                                :items="priceLevel"
                                item-value="id"
                                @change="onPriceLevelChange"
                                :disabled="disabledMe"
                                item-text="name"
                                return-object
                                placeholder="Price Level"
                                tage="Default Price Level"
                                outlined
                                :rules="[(v) => !!v['id'] || $t('is_required')]"/>
                            <v-col sm="12" col="12" class="d-flex justify-space-between pt-0">
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
                        <v-col sm="3" cols="6" class="pb-0">
                            <label class="label mb-0">{{ $t("segment") }}</label>
                            <v-select
                                class="mt-1"
                                v-model="runBach.segment"
                                :items="segments"
                                item-value="id"
                                :disabled="disabledMe"
                                :item-text="(item) => `${item.code} - ${item.name}`"
                                :rules="[(v) => !!v['id'] || $t('is_required')]"
                                return-object
                                tage="sub Of"
                                placeholder="Sub Of"
                                outlined=""/>
                            <label class="label mb-0">{{ $t("location") }}</label>
                            <v-select
                                class="mt-1"
                                v-model="runBach.location"
                                :items="locations"
                                :disabled="disabledMe"
                                item-value="id"
                                :item-text="(item) => `${item.code} - ${item.name}`"
                                :rules="[(v) => !!v['id'] || $t('is_required')]"
                                return-object
                                tage="Location"
                                placeholder="bu/location"
                                outlined=""/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <kendo-datasource
                                ref="itemLineDS"
                                :data="itemLines"
                                :change="dataSourceChanged"/>
                            <kendo-grid
                                id="gridItemLine"
                                class="grid-function"
                                :data-source-ref="'itemLineDS'"
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
                                    :field="'serviceDate'"
                                    :title="$t('date_from')"
                                    :width="200"
                                    :hidden="!saleFormContent.serviceDate"
                                    :template="'<span>#= kendo.toString(new Date(serviceDate), dateFormat)#</span>'"
                                    :editor="ServiceDateEditor"
                                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                <kendo-grid-column
                                    :field="'serviceDateTo'"
                                    :title="$t('date_to')"
                                    :width="200"
                                    :hidden="!saleFormContent.serviceDateTo"
                                    :template="'<span>#= kendo.toString(new Date(serviceDateTo), dateFormat)#</span>'"
                                    :editor="ServiceDateToEditor"
                                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                <kendo-grid-column
                                    :field="'item'"
                                    :title="$t('item')"
                                    :template="itemTemplate"
                                    :editor="ItemDropDownEditor"
                                    :attributes="{class:'tb_name_td isEditable'}"
                                    :width="200"
                                    :headerAttributes="{style: 'background-color: #EDF1F5'}"/>
                                <kendo-grid-column
                                    :field="'description'"
                                    :title="$t('description')"
                                    :template="'<span>#=description#</span>'"
                                    :width="200"
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
                                    :field="'qoh'"
                                    :title="$t('on_hand')"
                                    :template="qohTemplate"
                                    :width="170"
                                    :editable="() => {return false}"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                    :attributes="{ style: 'text-align: right; ' }"/>
                                <kendo-grid-column
                                    :field="'qty'"
                                    :title="$t('qty')"
                                    :format="'{0:n}'"
                                    :editor="numberEditor"
                                    :template="'<span>#=qty || 0#</span>'"
                                    :width="120"
                                    :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5',}"
                                    :attributes="{ style: 'text-align: right; ' }"/>
                                <kendo-grid-column
                                    :field="'price'"
                                    :title="$t('price')"
                                    :width="200"
                                    :template="'<span>#=kendo.toString(price || 0, decimalFormat)#</span>'"
                                    :editor="numberEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                    :attributes="{style: 'text-align: right'}"/>
                                <kendo-grid-column
                                    :field="'amount'"
                                    :title="$t('amount')"
                                    :width="200"
                                    :editable="() => {return false;}"
                                    :template="'<span>#=kendo.toString(amount || 0, decimalFormat)#</span>'"
                                    :editor="numberEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{style: 'text-align: right'}"/>
                                <kendo-grid-column
                                    :field="'modifier'"
                                    :title="$t('modifier')"
                                    :width="200"
                                    :hidden="!saleFormContent.modifier"
                                    :template="modifierTemplate"
                                    :editor="ModifierDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'discountItem'"
                                    :title="$t('discount_item')"
                                    :width="200"
                                    :hidden="!saleFormContent.discountItem"
                                    :template="discountItemTemplate"
                                    :editor="DiscountItemDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{style: 'text-align: left'}"/>
                                <kendo-grid-column
                                    :field="'vatTax'"
                                    :title="$t('vat')"
                                    :width="200"
                                    :template="vatTemplate"
                                    :editor="VatTaxDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5',}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'specificTax'"
                                    :title="$t('specific_tax')"
                                    :width="200"
                                    :hidden="!saleFormContent.specificTax"
                                    :template="'<span>#=specificTax.defaultTax || ``#</span>'"
                                    :editor="SpecificTaxDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'otherTax'"
                                    :title="$t('other_tax')"
                                    :width="200"
                                    :hidden="!saleFormContent.otherTax"
                                    :template="'<span>#=otherTax.defaultTax||``#</span>'"
                                    :editor="OtherTaxDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'publicLightingTax'"
                                    :title="$t('pl_tax')"
                                    :width="200"
                                    :hidden="!saleFormContent.publicLightingTax"
                                    :template="'<span>#=publicLightingTax.defaultTax||``#</span>'"
                                    :editor="PublicLightingTaxDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'otherChargeItem'"
                                    :title="$t('other_charge')"
                                    :width="200"
                                    :hidden="!saleFormContent.otherCharge"
                                    :template="'<span>#=otherChargeItem.name || ``#'"
                                    :editor="OtherChargeDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'saleUnit'"
                                    :title="$t('sale_unit')"
                                    :width="200"
                                    :hidden="!saleFormContent.saleUnit"
                                    :template="saleUnitTemplate"
                                    :editor="SaleUnitDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
                                    :attributes="{ style: 'text-align: left' }"/>
                                <kendo-grid-column
                                    :field="'employee'"
                                    :title="$t('employee')"
                                    :width="200"
                                    :hidden="!saleFormContent.employee"
                                    :template="empImpl"
                                    :editor="EmployeeDropDownEditor"
                                    :headerAttributes="{style:'text-align: left; background-color: #EDF1F5'}"
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
                </v-card>
            </v-form>
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                :myLoading="true"
                type="loading"/>
        </v-col>
    </v-row>
</template>

<script>
    import kendo from "@progress/kendo-ui";
    import LoadingMe from "@/components/Loading";
    import RunBachModel from "@/scripts/model/billing/RunBach";
    import ItemLineModel from "@/scripts/invoice/model/ItemLine";
    import {uuid} from "vue-uuid";
    import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
    import {dataStore} from "@/observable/store";
    import InvoiceModel from "@/scripts/invoice/model/Invoice";  
    import OtherChargeModel from "@/scripts/model/OtherCharge";
    const priceLevelHandler = require("@/scripts/priceLevelHandler");
    const employeeHandler = require("@/scripts/employeeHandler");
    const discountItemHandler = require("@/scripts/discountItemHandler");
    const itemModifierHandler = require("@/scripts/itemModifierHandler");
    const saleFormContentHandler = require("@/scripts/saleFormContentHandler");
    const productVariantHandler = require("@/scripts/productVariantHandler");
    const uomPriceHandler = require("@/scripts/uomPriceHandler");
    const prefixHandler = require("@/scripts/prefixHandler");
    const currencyHandler = require("@/scripts/currency/handler/currencyHandler");
    const lateFeeHandler = require("@/scripts/lateFeeHandler");
    const settingsHandler = require("@/scripts/settingsHandler");
    const locationHandler = require("@/scripts/locationHandler");
    const billingHandler = require("@/scripts/invoice/handler/billingHandler");
    const settingHandler = require("@/scripts/settingHandler");
    const customerGroupHandler = require("@/scripts/customerGroupHandler");
    const customerHandler = require("@/scripts/customerHandler");
    const accountHandler = require("@/scripts/handler/accounting/account");
    // const cookieJS = require("@/cookie.js");
    // const cookie = cookieJS.getCookie();
    const $ = kendo.jQuery
    const DISCOUNT_TYPE = "?type=Sale";
    const itemLinePrefix = "lin-";
    const runBachModel = new RunBachModel({});
    const itemLineModel = new ItemLineModel({});
    const invoiceModel = new InvoiceModel({});
    export default {
        name: "Task",
        components: {
            'LoadingMe': LoadingMe,
            'app-datepicker': DatePickerComponent,
            'month-picker' : ()=> import('@/components/custom_templates/MonthPicker'),
        },
        data: () => ({
            showLoading: false,
            valid: false,
            saleFormContent: {},
            itemLines: [],
            itemLine: itemLineModel,
            runBach: runBachModel,
            invoiceTypes: [],
            segments: [],
            priceLevel: [],
            lateFeeList: [],
            locations: [],
            currencyCode: '',
            transactionRate: 1,
            vatTax: [],
            isPriceLevelChanged: false,
            otherTax: [],
            specificTax: [],
            publicLightingTax: [],
            invoice: invoiceModel,
            mOtherCharge: [],
            mOtherChargeAmount: [],
            customerGroups: [],
            customers: [],
            mCustomerGroup: {},
            InvoiceAR:   []
        }),
        methods:{
            rowNumberTmpl(dataItem) {
                let ds = this.$refs.itemLineDS.kendoWidget(),
                    index = ds.indexOf(dataItem);
                return index + 1;
            },
            async loadSaleFormContent() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        saleFormContentHandler.list().then((res) => {
                            if (res.data.statusCode === 200) {
                                const data = res.data.data;
                                if (data.length > 0) {
                                    this.saleFormContent = data[0];
                                    // this.initData();
                                }
                            }
                        });
                    }, 10);
                });
            },
            ServiceDateEditor(container, options) {
                kendo.jQuery('<input required name="' + options.field + '"/>').appendTo(container).kendoDatePicker();
            },
            ServiceDateToEditor(container, options) {
                kendo.jQuery('<input required name="' + options.field + '"/>').appendTo(container).kendoDatePicker();
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
                                url: productVariantHandler.itemSearchURL('?plId=' + this.runBach.priceLevel.id + '&reUsed=1'),
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
                    }),
                });
            },
            itemTemplate(dataItem) {
                const item = dataItem.item;
                if (item) {
                    return `<span>${item.name ? item.name : ``}</span>`;
                } else {
                    return ``;
                }
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
                                amount = parseFloat(dataRow.price) * parseFloat(dataRow.qty);
                                xAmount = amount* parseFloat(this.runBach.txnRate);

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
                             window.console.log(1, this.isPriceLevelChanged)
                            if (this.isPriceLevelChanged === false) {
                                window.console.log(2)
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
                                        amount = parseFloat(dataRow.uom.price) * parseFloat(dataRow.qty);
                                        xAmount = amount * parseFloat(this.runBach.txnRate);

                                        dataRow.set("price", parseFloat(dataRow.uom.price));
                                        dataRow.set("amount", amount);
                                        dataRow.set("exchangeAmount", xAmount);
                                    } else {
                                        amount = parseFloat(dataRow.price) * parseFloat(dataRow.qty);
                                        xAmount = amount * parseFloat(this.runBach.txnRate);

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
                                amount = parseFloat(dataRow.price) * parseFloat(dataRow.qty);
                                xAmount = amount * parseFloat(this.runBach.txnRate);

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
                    if (e.field) {
                        this.autoCalculate();
                        // this.rawForJournal()
                    }
                }
            },
            dataBound: function (e) {
                const grid = kendo.jQuery("#gridItemLine").data("kendoGrid");
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
            removeRow(e) {
                e.preventDefault();
                const grid = kendo.jQuery("#gridItemLine").data("kendoGrid"),
                    dataSource = grid.dataSource,
                    dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

                if (dataSource.total() > 1) {
                    dataSource.remove(dataItem);
                    // this.autoCalculate();
                }
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
                            read: {url: uomPriceHandler.uomPriceByPriceLevelURL("id=" + options.model.item.id + "&plId=" + this.runBach.priceLevel.id + "&date=" + this.runBach.transactionDate),},
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
            qohTemplate(dataItem) {
                const buom = dataItem.buom || {};
                const qoh = dataItem.qoh || 0;
                if (buom.hasOwnProperty("name")) {
                    return kendo.toString(qoh, `n${this.saleFormContent.decimal}`) + ` ` + buom.name;
                }
                return ``;
            },
            numberEditor(container, options) {
                kendo.jQuery('<input data-bind="value:' + options.field + '"/>').appendTo(container).kendoNumericTextBox({
                    decimals: 30,
                    min: 0.00001,
                    format: `${this.saleFormContent.decimal}`,
                });
            },
            modifierTemplate(dataItem) {
                const modifier = dataItem.modifier;
                if (modifier) {
                    return `<span>${modifier.name || ``}</span>`;
                } else {
                    return ``;
                }
            },
            ModifierDropDownEditor(container, options) {
                const item = options.model.item || {}
                const uom = item.uom || {}
                const itemId = item.id || ''
                const uomId = uom.id || ''
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "contains",
                    dataTextField: "name",
                    dataValueField: "id",
                    headerTemplate:
                        '<div class="dropdown-header k-widget k-header">' +
                        "<span>Modifier </span>" +
                        "<span></span>" +
                        "</div>",
                    template: "<span>#=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: itemModifierHandler.searchURL('?plId=' + this.runBach.priceLevel.id + '&id=' + itemId + '&uomId=' + uomId),
                            },
                            dataType: "json",
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "string"},
                                    name: {type: "string"},
                                    price: {type: "number"},
                                    uom: {type: "string"},
                                },
                            },
                            data: function (response) {
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
                    }),
                });
            },
            discountItemTemplate(dataItem) {
                const discountItem = dataItem.discountItem;
                if (discountItem) {
                    return `<span>${discountItem.code ? discountItem.code : ``} - ${
                        discountItem.name ? discountItem.name : ``
                    }</span>`;
                } else {
                    return ``;
                }
            },
            DiscountItemDropDownEditor(container, options) {
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "name",
                    dataValueField: "id",
                    cascadeFrom: "item",
                    template: "<span>#=code# - #=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: discountItemHandler.getURL(DISCOUNT_TYPE),
                            },
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
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
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
            SpecificTaxDropDownEditor(container, options) {
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax || ``#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.specificTax.filter((m) => {
                            if (options.model.hasOwnProperty("vatTax")) {
                                const vat = options.model.vatTax || {};
                                if (vat) {
                                    if (
                                        options.model.vatTax !== null ||
                                        options.model.vatTax !== "null"
                                    ) {
                                        if (options.model.vatTax.baseAmount) {
                                            return (
                                                m.baseAmount.toLowerCase() ===
                                                options.model.vatTax.baseAmount.toLowerCase()
                                            );
                                        } else {
                                            return m;
                                        }
                                    }
                                } else {
                                    return m;
                                }
                            }
                        }),
                    }),
                });
            },
            OtherTaxDropDownEditor(container, options) {
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax || ``#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.otherTax.filter((m) => {
                            if (options.model.hasOwnProperty("vatTax")) {
                                const vat = options.model.vatTax;
                                if (vat) {
                                    if (
                                        options.model.vatTax !== null &&
                                        options.model.vatTax !== "null"
                                    ) {
                                        if (options.model.vatTax.baseAmount) {
                                            return (
                                                m.baseAmount.toLowerCase() ===
                                                options.model.vatTax.baseAmount.toLowerCase()
                                            );
                                        } else {
                                            return m;
                                        }
                                    }
                                } else {
                                    return m;
                                }
                            }
                        }),
                    }),
                });
            },
            PublicLightingTaxDropDownEditor(container, options) {
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax || ``#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.publicLightingTax.filter((m) => {
                            if (options.model.hasOwnProperty("vatTax")) {
                                const vat = options.model.vatTax;
                                if (vat) {
                                    if (
                                        options.model.vatTax !== null &&
                                        options.model.vatTax !== "null"
                                    ) {
                                        if (options.model.vatTax.baseAmount) {
                                            return (
                                                m.baseAmount.toLowerCase() ===
                                                options.model.vatTax.baseAmount.toLowerCase()
                                            );
                                        } else {
                                            return m;
                                        }
                                    }
                                } else {
                                    return m;
                                }
                            }
                        }),
                    }),
                });
            },
            OtherChargeDropDownEditor(container, options) {
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "name",
                    dataValueField: "id",
                    template: "<span>#=name#</span>",
                    optionLabel: "--Select--",
                    dataSource: new kendo.data.DataSource({
                        data: this.otherChargeList,
                    }),
                });
            },
            saleUnitTemplate(dataItem) {
                const saleUnit = dataItem.saleUnit;
                if (saleUnit) {
                    return `<span>${saleUnit.name ? saleUnit.name : ``}</span>`;
                } else {
                    return ``;
                }
            },
            SaleUnitDropDownEditor(container, options) {
                kendo.jQuery('<input name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "name",
                    dataValueField: "id",
                    template: "<span>#=code# - #=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.saleUnitItemList,
                    }),
                });
            },
            empImpl(dataItem) {
                let empIds = [];
                dataItem.employee.forEach((m) => {
                    empIds.push(m.firstName + " - " + m.lastName);
                });
                // window.console.log(empIds.join(', '))
                return `<span>${empIds.join(", ")}</span>`;
            },
            EmployeeDropDownEditor(container, options) {
                kendo.jQuery('<input data-bind="value:' + options.field + '"/>').appendTo(container).kendoMultiSelect({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    suggest: true,
                    filter: "contains",
                    dataTextField: "name",
                    dataValueField: "id",
                    headerTemplate:
                        '<div class="dropdown-header k-widget k-header">' +
                        "<span>Employee </span>" +
                        "<span></span>" +
                        "</div>",
                    template: "<span>#=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: employeeHandler.searchURL(),
                            },
                            dataType: "json",
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "string"},
                                    name: {type: "string"},
                                    firstName: {type: "string"},
                                    lastName: {type: "string"},
                                },
                            },
                            data: function (response) {
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
                    }),
                });
            },
            addRow() {
                let ds = this.$refs.itemLineDS.kendoWidget(),
                    total = ds.total();
                this.itemLine.id = itemLinePrefix + uuid.v1();
                this.itemLine.decimalFormat = "n" + this.saleFormContent.decimal;
                this.itemLine.isEditable = true;
                if (total < 36) {
                    ds.insert(total, this.itemLine);
                }
            },
            async loadPrefix() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        prefixHandler.get("invoice").then((res) => {
                            if (res.data.statusCode === 200) {
                                this.showLoading = false;
                                this.invoiceTypes = res.data.data;
                                if (this.invoiceTypes.length > 0) {
                                    this.runBach.transactionType = this.invoiceTypes[0];
                                }
                            }
                        });
                    }, 10);
                });
            },
            async onInvoiceDateChanged() {
                if (this.customer) {
                    const paymentTerm = this.runBach.paymentTerm || {}
                    if (paymentTerm) {
                        const netDue = paymentTerm.netDue || 0;
                        const someDate = new Date(this.runBach.transactionDate);
                        someDate.setDate(someDate.getDate() + parseInt(netDue)); //number  of days to add, e.x. 15 days
                        this.runBach.dueDate = someDate.toISOString().substr(0, 10);
                    }
                }
            },
            onPaymentTermChanged() {
                if (this.customer) {
                    const paymentTerm = this.runBach.paymentTerm || {}
                    if (paymentTerm) {
                        const netDue = paymentTerm.netDue || 0
                        const someDate = new Date(this.runBach.transactionDate);
                        someDate.setDate(someDate.getDate() + parseInt(netDue)); //number  of days to add, e.x. 15 days
                        this.runBach.dueDate = someDate.toISOString().substr(0, 10);
                    }
                }
            },
            async loadPriceLevel() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        const strFilter = '?nature=sale'
                        priceLevelHandler.get(strFilter).then((res) => {
                            this.priceLevel = res;
                            // if (this.priceLevel.length > 0) {
                            //     this.invoice.priceLevel = this.priceLevel[0];
                            // }
                        });
                    }, 10);
                });
            },
            onPriceLevelChange() {
                this.isPriceLevelChanged = true
                this.loadTransactionRate()
                this.clearUOMItem()
            },
            async clearUOMItem() {
                let ds = this.$refs.itemLineDS.kendoWidget()
                ds.data().map(n => {
                    n.set('uom', {})
                })
                this.isPriceLevelChanged = false
            },
            async loadTransactionRate() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        const date = new Date(this.runBach.transactionDate).toISOString().substr(0, 10);
                        const priceLevel = this.runBach.priceLevel || {};
                        const currency = priceLevel.currency || {}
                        const code = currency.code || ''
                        if (code) {
                            this.showLoading = true;
                            currencyHandler.getLastExchangeRateByDate(date, code).then((res) => {
                                    if (res.data.statusCode === 200) {
                                        this.showLoading = false;
                                        this.exchangeRate = res.data.data[0];
                                        this.currencyCode = this.exchangeRate.code;
                                        this.transactionRate = this.exchangeRate.rate;
                                        this.runBach.txnRate = this.exchangeRate.rate;
                                        this.runBach.exchangeRate = this.exchangeRate;
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
            async loadLateFee() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        const priceLevel = this.runBach.priceLevel || {}
                        const currency = priceLevel.currency || {}
                        const code = currency.code || ''
                        const strFilter = '?code=' + code
                        lateFeeHandler.list(strFilter).then((res) => {
                            if (res.data.statusCode === 200) {
                                this.showLoading = false;
                                this.lateFeeList = res.data.data;
                            } else {
                                this.showLoading = false;
                            }

                        });
                    }, 10);
                });
            },
            async loadSegment() {
                const roleType = dataStore.roleType || 0
                if (roleType === 0) {
                    if (dataStore.roleData) {
                        const roleData = dataStore.roleData || []
                        const segment = roleData.filter(itm => itm.type === 'segment')
                        const segmentDefault = segment.filter(m => m.isDefault === 1)
                        this.segments = segment
                        if (this.$route.params.id === undefined || this.$route.params.id === '') {
                            if (segmentDefault.length > 0) {
                                this.runBach.segment = segmentDefault[0];
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
                                            this.runBach.segment = this.segments[0];
                                        }
                                    }
                                })
                        }, 10);
                    });
                }
            },
            async loadLocation() {
                this.locations = []
                const roleType = dataStore.roleType || 0
                if (roleType === 0) {
                    if (dataStore.roleData) {
                        const roleData = dataStore.roleData || []
                        const location = roleData.filter(itm => itm.type === 'location')
                        const locationDefault = location.filter(m => m.isDefault === 1)
                        this.locations = location
                        if (this.$route.params.id === undefined || this.$route.params.id === '') {
                            if (locationDefault.length > 0) {
                                this.runBach.location = locationDefault[0];
                            }
                        }
                    }
                } else if (roleType === 1) {
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve("resolved");
                            this.locations = [];
                            locationHandler.list().then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.showLoading = false;
                                    this.locations = res.data.data;
                                    if (this.locations.length > 0) {
                                        this.runBach.location = this.locations[0];
                                    }
                                }
                            })
                        }, 10);
                    });
                }
            },
            generateNumber() {
                if (this.$route.params.id) {
                    const tranDate = new Date(this.runBach.transactionDate);
                    const tranDateInvoice = new Date(this.runBach.transactionDate);
                    const tranDateM = tranDate.getFullYear() + tranDate.getMonth();
                    const tranDateInvoiceM =
                        tranDateInvoice.getFullYear() + tranDateInvoice.getMonth();
                    if (tranDateM === tranDateInvoiceM) {
                        this.runBach.referenceNo = this.referenceNo;
                        return;
                    }
                }

                if (this.runBach.transactionDate !== "" && this.invoiceTypes.length > 0) {
                    let data = {
                        abbr: this.runBach.transactionType.abbr,
                        structure: this.runBach.transactionType.structure,
                        transactionDate: this.runBach.transactionDate,
                        sequcencing: this.runBach.transactionType.sequcencing,
                        type: "Invoice",
                        entity: 1,
                    };
                    billingHandler.lastNumber(data).then((response) => {
                        if (response.data.statusCode === 200) {
                            const res = response.data.data;
                            const lastNumber = this.zeroPad(
                                parseInt(res.lastNumber),
                                this.runBach.transactionType.format
                            );
                            const number =
                                res.suffix +
                                this.runBach.transactionType.numberSeparator +
                                lastNumber;
                            this.runBach.number = number;
                        }
                    })
                    .catch((e) => {
                        this.errors.push(e);
                    });
                }
            },
            zeroPad(num, places) {
                return String(num).padStart(places, "0");
            },
            taxMapping(objTax, tax) {
                const taxId = tax.id || ''
                const tax_ = objTax.filter(t => t.id === taxId)[0]
                return tax_ || {
                    id: '',
                    defaultTax: ''
                }
            },
            autoCalculate() {
                let ds = this.$refs.itemLineDS.kendoWidget(),
                    subTotal = 0,
                    totalTax = 0,
                    discountTotal = 0,
                    otherChargeTotal = 0,
                    spTax = 0,
                    pltax = 0,
                    otherTax = 0,
                    vatTax = 0,
                    discountInvoice = 0,
                    taxList = [],
                    taxListDetail = [],
                    discountItem = [],
                    otherChargeItem = [],
                    saleUnit = [],
                    inclusiveTax = 0,
                    discountLine = [],
                    otherChargeLine = [],
                    saleUnitLine = [],
                    itemSubtotal = 0,
                    txnItmSubtotal = 0,
                    serviceSubtotal = 0,
                    itemDiscount = 0,
                    serviceDiscount = 0,
                    txnDiscount = 0;
                let nature = "";
                this.jRaw = [];
                const rows = ds.data().filter((m) => parseFloat(m.amount) > 0);
                rows.forEach((value) => {
                    let modifierPrice = 0;
                    let vatSpTax = {}, vatPLTax = {}, vatOtherTax = {}
                    if (value.modifier) {
                        modifierPrice = kendo.parseFloat(value.modifier.price);
                    }

                    // subTotal += (kendo.parseFloat(value.amount) + modifierPrice)
                    let discount = 0, otherCharge = 0;
                    const otherChargeField = value.otherChargeItem || {};
                    const otherChargeFieldAcc = otherChargeField.account || {};
                    const otherChargeFieldAccId = otherChargeFieldAcc.uuid || ''
                    if (value.otherChargeItem) {
                        const subTotal = kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                        otherCharge = this.autoCalculateDiscount(otherChargeField, subTotal)
                        value["otherChargeAmount"] = otherCharge;
                        value["otherChargeExchangeAmount"] = otherCharge * kendo.parseFloat(this.invoice.txnRate);
                        if (value.otherChargeItem.hasOwnProperty("id")) {
                            otherChargeItem.push(value.otherChargeItem);
                            otherChargeLine.push({
                                id: value.otherChargeItem.id,
                                name: value.otherChargeItem.name,
                                amount: otherCharge,
                                exchangeAmount: otherCharge * parseFloat(this.invoice.txnRate),
                            });
                        }
                        otherChargeTotal += (otherCharge || 0);
                        if (otherCharge * -1 > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        if (otherChargeFieldAcc) {
                            if (otherChargeFieldAccId !== '') {
                                this.jRaw.push({
                                    id: otherChargeFieldAccId + "-" + nature,
                                    description: "Other Charge",
                                    account: otherChargeFieldAcc,
                                    accountId: otherChargeFieldAccId,
                                    amount: otherCharge * -1,
                                    exchangeAmount: otherCharge * -1 * kendo.parseFloat(this.invoice.txnRate),
                                    type: nature,
                                    typeAs: "otherCharge",
                                });
                            }
                        }
                    }
                    if (value.discountItem) {
                        const disItemField = value.discountItem;
                        const subTo = kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                        discount = this.autoCalculateDiscount(value.discountItem, subTo);
                        value["discountAmount"] = discount;
                        value["discountExchangeAmount"] = discount * kendo.parseFloat(this.invoice.txnRate);
                        // window.console.log('value', JSON.stringify(value))
                        if (value.discountItem.hasOwnProperty("id")) {
                            discountItem.push(value.discountItem);
                            discountLine.push({
                                id: value.discountItem.id,
                                name: value.discountItem.name,
                                amount: discount,
                                exchangeAmount: discount * parseFloat(this.invoice.txnRate),
                            });
                        }
                        discountTotal += (discount || 0)
                        if (discount > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        if (disItemField.account) {
                            if (disItemField.account.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: disItemField.account.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: "Discount",
                                    account: disItemField.account,
                                    accountId: disItemField.account.id,
                                    amount: discount,
                                    exchangeAmount:
                                        discount * kendo.parseFloat(this.runBach.txnRate),
                                    type: nature,
                                    typeAs: "discount",
                                });
                            }
                        }
                    }
                    if (value.saleUnit) {
                        if (value.saleUnit.hasOwnProperty("id")) {
                            saleUnit.push(value.saleUnit);
                            const item_ = value.item || {};
                            const amount_ =
                                kendo.parseFloat(value.price) * kendo.parseFloat(value.qty) || 0;
                            const itemObj = {
                                id: item_.id || "",
                                name: item_.name || "",
                                amount: amount_ - (discount || 0),
                            };
                            saleUnitLine.push({
                                lineId: value.id || "",
                                id: value.saleUnit.id,
                                name: value.saleUnit.name,
                                item: itemObj,
                                amount: itemObj.amount,
                                exchangeAmount: itemObj.amount * (this.runBach.txnRate || 1),
                                discount: discount || 0,
                                exchangeDiscount: (discount || 0) * (this.runBach.txnRate || 1),
                            });
                        }
                    }
                    if (value.specificTax) {
                        spTax = this.autoCalculateTax(
                            value.specificTax,
                            kendo.parseFloat(value.amount) - kendo.parseFloat(discount)
                        );
                        spTax = kendo.parseFloat(spTax) ? kendo.parseFloat(spTax) : 0;
                        value["specificTaxAmount"] = spTax;
                        value["specificTaxExchangeAmount"] =
                            spTax * kendo.parseFloat(this.runBach.txnRate);
                        const tax = value.specificTax;
                        const baseAmount = tax.baseAmount;
                        if (baseAmount) {
                            if (baseAmount.toLowerCase() === "inclusive") {
                                inclusiveTax += spTax;
                            }
                        }
                        // window.console.log(value.specificTax)
                        if (value.specificTax.hasOwnProperty("taxType")) {
                            taxList.push({
                                name: value.specificTax.taxType.name,
                                amount: spTax,
                                id: value.specificTax.taxType.id,
                            });
                            const spTax_ = value.specificTax || {}
                            // spTax_['taxAmount'] = spTax
                            spTax_['taxAmount_'] = spTax
                            spTax_['amount'] = value.amount || 0
                            spTax_['discount'] = discount || 0
                            spTax_['txnRate'] = this.runBach.txnRate || 1
                            // delete tax_['account']
                            taxListDetail.push(spTax_);
                            vatSpTax = spTax_
                        }
                        if (spTax * -1 > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        const specificTaxField = value.specificTax;
                        if (specificTaxField.account) {
                            if (specificTaxField.account.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: specificTaxField.account.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: "Tax",
                                    account: specificTaxField.account,
                                    accountId: specificTaxField.account.id,
                                    amount: spTax * -1,
                                    exchangeAmount:
                                        spTax * -1 * kendo.parseFloat(this.runBach.txnRate),
                                    type: nature,
                                    typeAs: "tax",
                                });
                            }
                        }
                    }
                    if (value.publicLightingTax) {
                        pltax = this.autoCalculateTax(
                            value.publicLightingTax,
                            kendo.parseFloat(value.amount) - kendo.parseFloat(discount)
                        );
                        pltax = kendo.parseFloat(pltax) ? kendo.parseFloat(pltax) : 0;
                        value["publicLightingTaxAmount"] = pltax;
                        value["publicLightingTaxExchangeAmount"] =
                            pltax * kendo.parseFloat(this.runBach.txnRate);
                        const tax = value.publicLightingTax;
                        const baseAmount = tax.baseAmount;
                        if (baseAmount) {
                            if (baseAmount.toLowerCase() === "inclusive") {
                                inclusiveTax += pltax;
                            }
                        }
                        if (value.publicLightingTax.hasOwnProperty("taxType")) {
                            taxList.push({
                                name: value.publicLightingTax.taxType.name,
                                amount: pltax,
                                id: value.publicLightingTax.taxType.id,
                            });
                            const plTax_ = value.publicLightingTax || {}
                            // plTax_['taxAmount'] = pltax
                            plTax_['taxAmount_'] = pltax
                            plTax_['amount'] = value.amount || 0
                            plTax_['discount'] = discount || 0
                            plTax_['txnRate'] = this.runBach.txnRate || 1
                            // delete tax_['account']
                            taxListDetail.push(plTax_);
                            vatPLTax = plTax_
                        }
                        if (pltax * -1 > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        const PLTaxField = value.publicLightingTax;
                        if (PLTaxField.account) {
                            if (PLTaxField.account.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: PLTaxField.account.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: "Tax",
                                    account: PLTaxField.account,
                                    accountId: PLTaxField.account.id,
                                    amount: pltax * -1,
                                    exchangeAmount:
                                        pltax * kendo.parseFloat(this.runBach.txnRate) * -1,
                                    type: nature,
                                    typeAs: "tax",
                                });
                            }
                        }
                    }
                    if (value.otherTax) {
                        otherTax = this.autoCalculateTax(
                            value.otherTax,
                            kendo.parseFloat(value.amount) - kendo.parseFloat(discount)
                        );
                        otherTax = kendo.parseFloat(otherTax)
                            ? kendo.parseFloat(otherTax)
                            : 0;
                        value["otherTaxAmount"] = otherTax;
                        value["otherTaxExchangeAmount"] =
                            otherTax * kendo.parseFloat(this.runBach.txnRate);
                        const tax = value.otherTax;
                        const baseAmount = tax.baseAmount;
                        if (baseAmount) {
                            if (baseAmount.toLowerCase() === "inclusive") {
                                inclusiveTax += otherTax;
                            }
                        }
                        if (value.otherTax.hasOwnProperty("taxType")) {
                            taxList.push({
                                name: value.otherTax.taxType.name,
                                amount: otherTax,
                                id: value.otherTax.taxType.id,
                            });
                            const tax__ = value.otherTax || {}
                            // tax__['taxAmount'] = otherTax
                            tax__['taxAmount_'] = otherTax
                            tax__['amount'] = value.amount || 0
                            tax__['discount'] = discount || 0
                            tax__['txnRate'] = this.runBach.txnRate || 1
                            // delete tax_['account']
                            taxListDetail.push(tax__);
                            vatOtherTax = tax__
                        }
                        if (otherTax * -1 > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        const otherTaxField = value.otherTax;
                        if (otherTaxField.account) {
                            if (otherTaxField.account.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: otherTaxField.account.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: "Tax",
                                    account: otherTaxField.account,
                                    accountId: otherTaxField.account.id,
                                    amount: otherTax * -1,
                                    exchangeAmount:
                                        otherTax * kendo.parseFloat(this.runBach.txnRate) * -1,
                                    type: nature,
                                    typeAs: "tax",
                                });
                            }
                        }
                    }

                    if (value.vatTax) {
                        // window.console.log('Vat Tax', value.vatTax)
                        let amt =
                            kendo.parseFloat(spTax ? spTax : 0) +
                            kendo.parseFloat(pltax ? pltax : 0) +
                            kendo.parseFloat(otherTax ? otherTax : 0) +
                            (kendo.parseFloat(value.amount ? value.amount : 0) -
                                (discount ? discount : 0));
                        vatTax = this.autoCalculateTax(value.vatTax, amt);
                        vatTax = kendo.parseFloat(vatTax) ? kendo.parseFloat(vatTax) : 0;
                        value["vatTaxAmount"] = vatTax;
                        value["vatTaxExchangeAmount"] =
                            vatTax * kendo.parseFloat(this.runBach.txnRate);
                        const tax = value.vatTax;
                        const baseAmount = tax.baseAmount;
                        if (baseAmount) {
                            if (baseAmount.toLowerCase() === "inclusive") {
                                inclusiveTax += vatTax;
                            }
                        }
                        if (value.vatTax.hasOwnProperty("taxType")) {
                            taxList.push({
                                name: value.vatTax.taxType.name,
                                amount: vatTax,
                                id: value.vatTax.taxType.id,
                            });
                            const vatTax_ = value.vatTax || {}
                            // vatTax_['taxAmount'] = vatTax
                            vatTax_['taxAmount_'] = vatTax
                            vatTax_['amount'] = value.amount || 0
                            vatTax_['discount'] = discount || 0
                            vatTax_['txnRate'] = this.runBach.txnRate || 1
                            vatTax_['isVat'] = 1
                            vatTax_.detail = {
                                specificTax: vatSpTax,
                                publicLightingTax: vatPLTax,
                                otherTax: vatOtherTax,
                            }
                            // delete tax_['account']
                            taxListDetail.push(vatTax_);

                        }

                        if (vatTax * -1 > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        const vatTaxField = value.vatTax;
                        if (vatTaxField.account) {
                            if (vatTaxField.account.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: vatTaxField.account.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: "Tax",
                                    account: vatTaxField.account,
                                    accountId: vatTaxField.account.id,
                                    amount: vatTax * -1,
                                    exchangeAmount:
                                        vatTax * kendo.parseFloat(this.runBach.txnRate) * -1,
                                    type: nature,
                                    typeAs: "tax",
                                });
                            }
                        }
                    }
                    vatSpTax = {}, vatPLTax = {} , vatOtherTax = {}
                    totalTax +=
                        kendo.parseFloat(spTax ? spTax : 0) +
                        kendo.parseFloat(pltax ? pltax : 0) +
                        kendo.parseFloat(otherTax ? otherTax : 0) +
                        kendo.parseFloat(vatTax ? vatTax : 0);
                    subTotal +=
                        kendo.parseFloat(value.amount) + modifierPrice - inclusiveTax;
                    const amt =
                        kendo.parseFloat(value.amount) + modifierPrice - inclusiveTax;
                    const xAmount =
                        kendo.parseFloat(amt) * kendo.parseFloat(this.runBach.txnRate) * -1;
                    const item = value.item;
                    const itmType = item.type || "";
                    if (itmType === "Variant") {
                        itemSubtotal +=
                            kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                        itemDiscount += kendo.parseFloat(discount);
                    } else if (itmType === "Service") {
                        serviceSubtotal +=
                            kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                        itemDiscount += kendo.parseFloat(discount);
                    } else {
                        txnItmSubtotal +=
                            kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                        itemDiscount += kendo.parseFloat(discount);
                    }

                    const conversionRate = value.conversionRate || 1;
                    const bQty = parseFloat(value.qty * conversionRate);
                    const wac = parseFloat(value.wac) || 0;
                    const itemAmount = parseFloat(bQty) * wac;
                    // const itemxAmount = itemAmount
                    if (amt * -1 > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    if (item) {
                        if (item.type === "Service") {
                            if (value.isPlan) {
                                if (item.hasOwnProperty("deferredIncomeAcc")) {
                                    if (item.deferredIncomeAcc.hasOwnProperty("id")) {
                                        let deferredInAcc = item.deferredIncomeAcc;
                                        this.jRaw.push({
                                            id: deferredInAcc.id + "-" + nature,
                                            // line: new ItemLineModel(value),
                                            description: this.invoice.journalNote,
                                            account: deferredInAcc,
                                            accountId: deferredInAcc.id,
                                            amount: amt * -1,
                                            exchangeAmount: xAmount,
                                            type: nature,
                                            typeAs: "item",
                                        });
                                    }
                                }
                            } else {
                                let incomeAcc = item.incomeAcc;
                                if (item.hasOwnProperty("incomeAcc")) {
                                    if (item.incomeAcc.hasOwnProperty("id")) {
                                        this.jRaw.push({
                                            id: incomeAcc.id + "-" + nature,
                                            // line: new ItemLineModel(value),
                                            description: this.invoice.journalNote,
                                            account: incomeAcc,
                                            accountId: incomeAcc.id,
                                            amount: amt * -1,
                                            exchangeAmount: xAmount,
                                            type: nature,
                                            typeAs: "item",
                                            cashBasic: 1
                                        });
                                    }
                                }
                            }
                        } else if (item.type === "Variant") {
                            if (item.hasOwnProperty("incomeAcc")) {
                                if (item.incomeAcc.hasOwnProperty("id")) {
                                    let incomeAcc = item.incomeAcc;
                                    this.jRaw.push({
                                        id: incomeAcc.id + "-" + nature,
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: item.incomeAcc,
                                        accountId: item.incomeAcc.id,
                                        amount: amt * -1,
                                        exchangeAmount: xAmount,
                                        type: nature,
                                        typeAs: "item",
                                        cashBasic: 1
                                    });
                                }
                            }
                            if (item.hasOwnProperty("inventoryAcc")) {
                                if (item.inventoryAcc.hasOwnProperty("id")) {
                                    let inventoryAcc = item.inventoryAcc;
                                    this.jRaw.push({
                                        id: inventoryAcc.id + "-" + "cr",
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: item.inventoryAcc,
                                        accountId: item.inventoryAcc.id,
                                        amount: itemAmount * -1, // qty*avg_cost ,
                                        exchangeAmount: itemAmount * -1, //xAmount,
                                        type: "cr",
                                        typeAs: "item",
                                    });
                                }
                            }
                            if (item.hasOwnProperty("costOfGoodsSoldAcc")) {
                                if (item.costOfGoodsSoldAcc.hasOwnProperty("id")) {
                                    let costOfGoodsSoldAcc = item.costOfGoodsSoldAcc;
                                    this.jRaw.push({
                                        id: costOfGoodsSoldAcc.id + "-" + "dr",
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: item.costOfGoodsSoldAcc,
                                        accountId: item.costOfGoodsSoldAcc.id,
                                        amount: itemAmount, // qty*avg_cost ,
                                        exchangeAmount: itemAmount, //xAmount,
                                        type: "dr",
                                        typeAs: "item",
                                    });
                                }
                            }

                        } else if (item.type === "Fixed Asset") {
                            if (item.hasOwnProperty("assetAcc")) {
                                if (item.assetAcc.hasOwnProperty("id")) {
                                    let assetAcc = item.assetAcc;
                                    this.jRaw.push({
                                        id: assetAcc.id + "-" + nature,
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: item.assetAcc,
                                        accountId: item.assetAcc.id,
                                        amount: amt * -1,
                                        exchangeAmount: xAmount,
                                        type: nature,
                                        typeAs: "item",
                                    });
                                }
                            }
                        } else if (item.type === "Transaction Item") {
                            if (item.hasOwnProperty("account")) {
                                if (item.account.hasOwnProperty("id")) {
                                    this.jRaw.push({
                                        id: item.account.id + "-" + nature,
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: item.account,
                                        accountId: item.account.id,
                                        amount: amt * -1,
                                        exchangeAmount: xAmount,
                                        type: nature,
                                        typeAs: "item",
                                    });
                                }
                            }
                        }
                    }
                    //include Tax Amount
                    const amountNodiscount = kendo.parseFloat(value.price) * kendo.parseFloat(value.qty) - discount;
                    const includeTaxAmount = amountNodiscount + vatTax + pltax + spTax + otherTax;
                    value["includeTaxAmount"] = includeTaxAmount;
                    value["includeTaxExchangeAmount"] = includeTaxAmount * kendo.parseFloat(this.runBach.txnRate);
                });
                this.invoice.itemSubtotal = itemSubtotal;
                this.invoice.exchangeItemSubtotal =
                    itemSubtotal * kendo.parseFloat(this.runBach.txnRate);
                this.invoice.serviceSubtotal = serviceSubtotal;
                this.invoice.exchangeServiceSubtotal =
                    serviceSubtotal * kendo.parseFloat(this.runBach.txnRate);
                this.invoice.txnItmSubtotal = txnItmSubtotal;
                this.invoice.exchangeTxnItmSubtotal =
                    txnItmSubtotal * kendo.parseFloat(this.runBach.txnRate);
                this.invoice.itemDiscount = itemDiscount;
                this.invoice.exchangeItemDiscount =
                    itemDiscount * kendo.parseFloat(this.runBach.txnRate);
                this.invoice.serviceDiscount = serviceDiscount;
                this.invoice.exchangeServiceDiscount =
                    serviceDiscount * kendo.parseFloat(this.runBach.txnRate);
                this.invoice.txnItmDiscount = txnDiscount;
                this.invoice.exchangeTxnItmDiscount =
                    txnDiscount * kendo.parseFloat(this.runBach.txnRate);
                // window.console.log(spTax, pltax, otherTax, vatTax)
                let total =
                    kendo.parseFloat(subTotal) -
                    kendo.parseFloat(discountTotal) +
                    kendo.parseFloat(totalTax);
                this.invoice.subTotal = subTotal;
                this.invoice.exchangeSubTotal =
                    subTotal * parseFloat(this.runBach.txnRate);
                // $("#subtotal").text(kendo.parseFloat(subTotal))
                this.invoice.totalTaxAmount = kendo.parseFloat(totalTax);
                this.invoice.discountTotal = kendo.parseFloat(discountTotal);
                this.invoice.otherChargeTotal = kendo.parseFloat(otherChargeTotal);
                if (this.invoice.specificDiscountItem) {
                    discountInvoice = this.autoCalculateDiscount(
                        this.invoice.specificDiscountItem,
                        kendo.parseFloat(subTotal)
                    );
                    discountInvoice = discountInvoice ? discountInvoice : 0;
                }
                // this.onOtherChargeChange()
                this.invoice.total = kendo.parseFloat(total) - discountInvoice + kendo.parseFloat(this.invoice.otherChargeAmount) + otherChargeTotal;
                this.invoice.remainingAmount = kendo.parseFloat(this.invoice.total) - kendo.parseFloat(this.invoice.depositDeduction);
                this.invoice.amountDue = kendo.parseFloat(this.invoice.total) - kendo.parseFloat(this.invoice.depositDeduction);
                this.invoice.exchangeAmount = kendo.parseFloat(this.invoice.amountDue) * kendo.parseFloat(this.runBach.txnRate);
                // window.console.log('Exchange Amount', this.invoice.exchangeAmount)
                this.autoCalculateTaxByType(taxList);
                if (this.invoice.specificDiscountItem) {
                    const specificDiscount = this.invoice.specificDiscountItem || {};
                    if (specificDiscount.id) {
                        discountItem.push(specificDiscount);
                        discountLine.push({
                            id: specificDiscount.id,
                            name: specificDiscount.name,
                            amount: this.invoice.specificDiscountTotal,
                            exchangeAmount:
                                this.invoice.specificDiscountTotal * this.runBach.txnRate,
                        });
                    }
                }
                const uniqueDiscountItem = this.removeDuplicate(discountItem);
                this.shrinkDiscountItem(uniqueDiscountItem, discountLine);

                const uniqueOtherCharge = this.removeDuplicate(otherChargeItem);
                this.shrinkOtherChargeItem(uniqueOtherCharge, otherChargeLine);

                this.customerSaleUnit = this.removeDuplicate(saleUnit);
                this.customerSaleUnitLine = saleUnitLine; //this.removeDuplicate(saleUnit)
                this.taxListDetail = taxListDetail
                // window.console.log('taxListDetail--', taxListDetail)
                // todo: raw Journal
                const receivableAcc = this.invoice.receivableAcc || {};
                if (this.invoice.amountDue > 0) {
                    nature = "dr";
                } else {
                    nature = "cr";
                }
                if (receivableAcc) {
                    if (receivableAcc.hasOwnProperty("id")) {
                        this.jRaw.push({
                            id: receivableAcc.id + "-" + nature,
                            // line: new ItemLineModel({}),
                            description: this.invoice.journalNote,
                            account: receivableAcc,
                            accountId: receivableAcc.id,
                            exchangeAmount: this.invoice.exchangeAmount,
                            amount: this.invoice.amountDue,
                            type: nature,
                            typeAs: "ar",
                        });
                    }
                }
                const specificDisc = this.invoice.specificDiscountItem;
                if (this.invoice.specificDiscountTotal > 0) {
                    nature = "dr";
                } else {
                    nature = "cr";
                }
                if (specificDisc) {
                    if (specificDisc.hasOwnProperty("account")) {
                        if (specificDisc.account) {
                            if (specificDisc.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: specificDisc.account.id + "-" + nature,
                                    // line: new ItemLineModel({}),
                                    description: "Discount",
                                    account: specificDisc.account || {},
                                    accountId: specificDisc.account.id,
                                    exchangeAmount:
                                        kendo.parseFloat(this.invoice.specificDiscountTotal) *
                                        kendo.parseFloat(this.runBach.txnRate),
                                    amount: this.invoice.specificDiscountTotal,
                                    type: nature,
                                    typeAs: "discount",
                                });
                            }
                        }
                    }
                }

                if (this.invoice.depositDeduction > 0) {
                    nature = "dr";
                } else {
                    nature = "cr";
                }
                this.invoice.exchangeDepositDeduction =
                    (this.runBach.txnRate || 0) * this.invoice.depositDeduction;
                if (this.invoice.depositDeduction) {
                    if (this.invoice.depositDeduction > 0) {
                        const saleDepositAcc = this.customer.saleDepositAcc || {};
                        if (saleDepositAcc) {
                            if (saleDepositAcc.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: saleDepositAcc.id + "-" + nature,
                                    description: "Deposit",
                                    // line: new ItemLineModel({}),
                                    account: saleDepositAcc,
                                    accountId: saleDepositAcc.id,
                                    exchangeAmount: this.invoice.exchangeDepositDeduction,
                                    amount: this.invoice.depositDeduction,
                                    type: nature,
                                    typeAs: "deposit",
                                });
                            }
                        }
                    }
                }
                if (this.mOtherCharge.length > 0) {
                    let otherCharge = 0;
                    this.mOtherCharge.forEach((m) => {
                        otherCharge = this.autoCalculateDiscount(m, this.invoice.subTotal);
                        if (otherCharge * -1 > 0) {
                            nature = "dr";
                        } else {
                            nature = "cr";
                        }
                        if (m) {
                            if (m.hasOwnProperty("account")) {
                                if (m.account.hasOwnProperty("id")) {
                                    const account = m.account;
                                    if (account) {
                                        if (account.hasOwnProperty("id")) {
                                            this.jRaw.push({
                                                id: account.id + "-" + nature,
                                                // line: new ItemLineModel({}),
                                                description: "Other Charge",
                                                account: account,
                                                accountId: account.id,
                                                exchangeAmount:
                                                    otherCharge *
                                                    kendo.parseFloat(this.runBach.txnRate) *
                                                    -1,
                                                amount: otherCharge * -1,
                                                type: nature,
                                                typeAs: "otherCharge",
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                    // this.invoice.otherChargeAmount = otherCharge

                    window.console.log(this.mOtherCharge);
                }
                this.autoCalculateTaxDetail();
                // todo: end raw Journal
                // window.console.log(JSON.stringify(this.accounts), 'accounts')
                this.shrinkData(this.jRaw);
                // const unique = this.removeDuplicate(this.accounts)
                // window.console.log(unique, 'unique')
                this.loopInvoice()
            },
            autoCalculateDiscount(discountItem, subTotal) {
                if (discountItem) {
                    const nature = discountItem.nature || ''
                    const amount = discountItem.amount || 0
                    if (nature === 'Amount') {
                        return parseFloat(amount)
                    } else if (nature === 'Percentage') {
                        return (subTotal * (parseFloat(amount) / 100))
                    } else {
                        return 0
                    }
                } else {
                    return 0
                }
            },
            autoCalculateTaxByType(tax) {
                // return by a key
                const groupAll = (list) =>
                    list.reduce((tax, item) => {
                        const taxAmount = tax[item.name] || 0;
                        return Object.assign({}, tax, {
                            [item.name]: taxAmount + parseFloat(item.amount),
                        });
                    }, {});
                this.taxListTotal = groupAll(tax);
                // window.console.log('nimol', groupAll(tax))
            },
            removeDuplicate(array) {
                const result = [];
                const map = new Map();
                for (const item of array) {
                    if (!map.has(item.id)) {
                        map.set(item.id, true); // set any value to Map
                        result.push(item);
                    }
                }
                return result;
            },
            shrinkDiscountItem(discountItem, discountLine) {
                let uniqueDiscountItems = [];
                const unique = this.removeDuplicate(discountItem);
                unique.forEach((m) => {
                    const found = discountLine.filter((n) => n.id === m.id);
                    let amount = 0,
                        exchangeAmount = 0;
                    found.map((o) => {
                        amount += o.amount;
                    });
                    found.map((o) => {
                        exchangeAmount += o.exchangeAmount;
                    });
                    uniqueDiscountItems.push({
                        id: m.id,
                        name: m.name,
                        amount: amount,
                        exchangeAmount: exchangeAmount,
                    });
                });
                this.customerDiscountItem = uniqueDiscountItems;
                window.console.log(uniqueDiscountItems, "uniqueDiscountItems");
            },
            shrinkOtherChargeItem(otherChargeItem, otherChargeLine) {
                let items = [];
                const unique = this.removeDuplicate(otherChargeItem);
                unique.forEach((m) => {
                    const found = otherChargeLine.filter((n) => n.id === m.id);
                    let amount = 0, exchangeAmount = 0;
                    found.map((o) => {
                        amount += o.amount;
                    });
                    found.map((o) => {
                        exchangeAmount += o.exchangeAmount;
                    });
                    items.push({
                        id: m.id,
                        name: m.name,
                        amount: amount,
                        exchangeAmount: exchangeAmount,
                    });
                });
                this.customerOtherChargeItem = items;
            },
            autoCalculateTaxDetail() {
                let ids = []
                this.taxListDetail.forEach(n => {
                    ids.push(n.id || '')
                })
                const unique = [...new Set(ids)]
                let result = []
                unique.forEach(m => {
                    let amount = 0, row = {}, discount = 0, xDiscount = 0, xAmount = 0, taxAmount = 0, xTaxAmount = 0
                    let taxDetail = [], isVat = 0
                    const found = this.taxListDetail.filter(n => n.id === m)
                    // window.console.log('taxListDetailids', found)
                    found.forEach(k => {
                        row = k
                        if (k.isVat === 1) {
                            isVat = 1
                            const detail_ = k.detail || {}
                            taxDetail.push(detail_)

                        }
                        taxAmount += k.taxAmount_ || 0
                        xTaxAmount += (k.taxAmount_ || 0) * (k.txnRate || 1)
                        amount += (k.amount || 0)
                        xAmount += (k.amount || 0) * (k.txnRate || 1)
                        discount += (k.discount || 0)
                        xDiscount += (k.discount || 0) * (k.txnRate || 1)
                    })
                    let spTaxAmt = 0, spXTaxAmt = 0, plTaxAmt = 0, plXTaxAmt = 0, otTaxAmt = 0, otXTaxAmt = 0,
                        spTaxName = '', plTaxName = '', otTaxName = '',
                        spTaxNameLocale = '', plTaxNameLocale = '', otTaxNameLocale = '',
                        spAccId = '', plAccId = '', otAccId = '',
                        spRate = '', plRate = '', otRate = ''
                    taxDetail.forEach(n => {
                        const spTax = n.specificTax || {}
                        const plTax = n.publicLightingTax || {}
                        const otherTax = n.otherTax || {}
                        if (Object.keys(spTax).length > 0) {
                            spTaxAmt += (spTax.taxAmount_ || 0)
                            spXTaxAmt += ((spTax.taxAmount_ || 0) * (spTax.taxRate || 1))
                            spTaxName = spTax.defaultTax || ''
                            spTaxNameLocale = spTax.defaultTaxLocale || ''
                            spAccId = spTax.account ? spTax.account.id : ''
                            spRate = spTax.rate || 1
                        }
                        if (Object.keys(plTax).length > 0) {
                            plTaxAmt += (plTax.taxAmount_ || 0)
                            plXTaxAmt += ((plTax.taxAmount_ || 0) * (plTax.taxRate || 1))
                            plTaxName = plTax.defaultTax || ''
                            plTaxNameLocale = plTax.defaultTaxLocale || ''
                            plAccId = plTax.account ? plTax.account.id : ''
                            plRate = plTax.rate || 1
                        }
                        if (Object.keys(otherTax).length > 0) {
                            otTaxAmt += (otherTax.taxAmount_ || 0)
                            otXTaxAmt += ((otherTax.taxAmount_ || 0) * (plTax.taxRate || 1))
                            otTaxName = otherTax.defaultTax || ''
                            otTaxNameLocale = otherTax.defaultTaxLocale || ''
                            otAccId = otherTax.account ? otherTax.account.id : ''
                            otRate = otherTax.rate || 1
                        }
                    })
                    if (isVat === 1) {
                        row.detail = {
                            specificTax: {
                                name: spTaxName,
                                nameLocale: spTaxNameLocale,
                                amount: spTaxAmt,
                                exchangeAmount: spXTaxAmt,
                                accountId: spAccId,
                                rate: spRate,
                            },
                            publicLightingTax: {
                                name: plTaxName,
                                nameLocale: plTaxNameLocale,
                                amount: plTaxAmt,
                                exchangeAmount: plXTaxAmt,
                                accountId: plAccId,
                                rate: plRate,
                            },
                            otherTax: {
                                name: otTaxName,
                                nameLocale: otTaxNameLocale,
                                amount: otTaxAmt,
                                exchangeAmount: otXTaxAmt,
                                accountId: otAccId,
                                rate: otRate,
                            }
                        }
                    } else {
                        row.detail = {}
                    }

                    row['amount'] = amount
                    row['exchangeAmount'] = xAmount
                    row['taxAmount'] = taxAmount
                    row['exchangeTaxAmount'] = xTaxAmount
                    row['discount'] = discount
                    row['exchangeDiscount'] = xDiscount
                    row['currency'] = this.invoice.exchangeRate || {}
                    result.push(row)
                    taxDetail = []
                })
                this.invoice.saleTaxDetail = result
                window.console.log('saleTaxDetail', result)
            },
            shrinkData(obj) {
                const uniques = this.removeDuplicate(
                    obj
                ); /*[...new Set(accountId.map(i => {
                    return {
                        id_: i.id_,
                        id: i.id,
                        type: i.type
                    }
                }))]*/
                /* todo: cash basic account */
                let cashBasicAmount = 0
                let xCashBasicAmount = 0
                this.invoice.cashBasicIncomeAcc = []
                let cashBasicAcc = uniques.filter(m => m.cashBasic === 1)
                cashBasicAcc.forEach(k => {
                    cashBasicAmount += k.amount
                    xCashBasicAmount += k.exchangeAmount
                })
                cashBasicAcc.map(o => {
                    o['amountPercentage'] = o.amount / cashBasicAmount
                    o['xAmountPercentage'] = o.exchangeAmount / xCashBasicAmount
                })
                this.invoice.cashBasicIncomeAcc = cashBasicAcc
                /* todo: end */
                uniques.forEach((n) => {
                    const found = obj.filter((m) => m.id === n.id);
                    let amount = 0,
                        xAmount = 0;
                    found.forEach((z) => {
                        amount += parseFloat(z.amount || 0);
                        xAmount += parseFloat(z.exchangeAmount || 0);
                    });
                    n.amount = parseFloat(amount); //this.numberFormat(amount)
                    n.exchangeAmount = parseFloat(xAmount); //parseFloat(parseFloat(amount * parseFloat(this.invoice.txnRate))) //this.numberFormat(amount * parseFloat(this.invoice.txnRate)) //.toFixed(this.saleFormContent.decimal)
                });
                this.jRaw = uniques;
                let dr = 0,
                    cr = 0;
                this.jRaw.forEach((j) => {
                    switch (j.type) {
                        case "cr":
                            cr += parseFloat(j.amount);
                            break;
                        case "dr":
                            dr += parseFloat(j.amount);
                            break;
                        default:
                            break;
                    }
                });
                this.invoice.dr = dr;
                this.invoice.cr = cr;
                window.console.log("dr=", dr, "cr=", cr, "dr+cr = ", dr + cr);
                window.console.log(JSON.stringify(uniques), "uniques");
            },
            autoCalculateTax(tax, amount) {
                if (tax) {
                    var formula = tax.formula;
                    var inAmt = kendo.parseFloat(amount);
                    var nAmt = kendo.parseFloat(amount);
                    var taxBase = kendo.parseFloat(tax.taxBase) / 100;
                    var rate = kendo.parseFloat(tax.rate) / 100;
                    var total = eval(formula);
                    window.console.log(inAmt, nAmt, taxBase, rate, formula, total);
                    return total;
                }
                // return 0
            },
            async loadCustomerGroup() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        customerGroupHandler.get().then((res) => {
                            this.showLoading = false;
                            this.customerGroups = res;
                            // if (this.customerGroups.length > 0) {
                            //     this.mCustomerGroup = this.customerGroups[0];
                            //     this.loadCustomerCenter(this.search);
                            // }
                        });
                    }, 10);
                });
            },
            async loadCustomerCenter(search) {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        this.customers = [];
                        let groupId = '';
                        let customerTypeId = '';
                        if (this.mCustomerGroup) {
                            groupId = this.mCustomerGroup.id || ''
                        }
                        if (this.mCustomerType) {
                            customerTypeId = this.mCustomerType.id || ''
                        }
                        let strFilter = "?is_donor=false";
                        if (this.appType === 'npo') {
                            strFilter = "?is_donor=true";
                        }
                        const strSearch = search || "";
                        window.console.log('strFilter', strFilter, strSearch)
                        const strFilterV1 = '?donor=0&ctid=' + customerTypeId + '&grp=' + groupId + '&search=' + strSearch
                        customerHandler.centerv1(strFilterV1).then((res) => {
                                this.showLoading = true;
                                if (res.data.statusCode === 200) {
                                    this.showLoading = false;
                                    this.customers = res.data.data;
                                    window.console.log(this.customers)
                                } else {
                                    this.showLoading = false;
                                }
                            });
                    }, 10);
                });
            },
            onCustomerTypeChanged(search) {
                this.showLoading = true;
                this.loadCustomerCenter(search);
            },
            async loadAccount() {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        accountHandler.getAll().then((res) => {
                            this.showLoading = false;
                            //Receivable Account
                            this.accReceivable = res.data.filter((m) => m.account_type.number === 7).map((item) => {
                                return {
                                    id: item.uuid,
                                    uuid: item.uuid,
                                    name: item.name,
                                    local_name: item.local_name,
                                    number: item.number,
                                    is_taxable: item.is_taxable,
                                    banhjiAccCode: item.banhjiAccCode,
                                    group_code: item.group_code,
                                    parent_account: item.parent_account,
                                    type_code: item.type_code,
                                    account_type: item.account_type,
                                };
                            });
                        });
                    }, 10);
                });
            },
            loopInvoice(){
                 let itemLineDS = this.$refs.itemLineDS.kendoWidget();
                const dataRow = itemLineDS.data().filter((o) => o.amount > 0).map((n) => {
                    const otherCharge = new OtherChargeModel(n.otherChargeItem || {})
                    n['otherChargeItem'] = otherCharge
                    return new ItemLineModel(n);
                });
                if(this.customers.length > 0){
                    window.console.log('customers', this.customers.length)
                    this.InvoiceAR = []
                    for (const element of this.customers){
                        this.InvoiceAR.push(new InvoiceModel({
                            customer:               element,
                            priceLevel:             this.runBach.priceLevel,
                            monthOf:                this.runBach.monthOf,
                            segment:                this.runBach.segment,
                            location:               this.runBach.location,
                            dueDate:                this.runBach.dueDate,
                            transactionDate:        this.runBach.transactionDate,
                            transactionType:        this.runBach.transactionType,
                            itemLines:              dataRow,
                            isJournal:              0,
                            journalStatus:          0
                        }))
                    }
                }
                window.console.log('InvoiceAR', this.InvoiceAR)
            },
            cancel(){

            },
            saveClose(){
                
            }
        },
        async mounted(){
            await this.loadCustomerGroup()
        },
        created() {
            this.loadTax();
            this.loadPriceLevel();
            this.loadPrefix();
            this.loadSegment();
            this.loadLocation();
            this.loadAccount()
        },
        computed: {
            disabledMe() {
                return !!this.$route.params.id;
            }
        },
        watch:{
            '$route': 'loadSinglePayment'
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
