'use strict'

/* Cookie */
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();
const instituteId = cookie !== undefined ? cookie.instituteId : '';
const creator = cookie !== undefined ? cookie.creator : '';

/* Base Url */
const baseUrl = process.env.VUE_APP_API;

const accountingUrl         = `${baseUrl}/accounting-v2/${instituteId}`;
const accountingReportUrl   = `${baseUrl}/accountingreport-v2/${instituteId}`;
const reconcielRuleUrl      = `${baseUrl}/bill.srv/institutes/${instituteId}`;
const workingCapitalUrl     = `${baseUrl}/workingcapital-v2/${instituteId}`;
const bankingUrl            = `${baseUrl}/banking-v2/${instituteId}`;
const financingUrl          = `${baseUrl}/financing-v2/${instituteId}`;
const bankfeedUrl       = baseUrl + '/bankfeed';
const banhjiUrl         = baseUrl + '/entity/v1/';
const partnerServiceUrl = baseUrl + '/partner-service/v1';
const prefixUrl         = `https://wcn7vpmgh3.execute-api.ap-southeast-1.amazonaws.com/dev/v1/settings/institute/${instituteId}`
// const xchangeUrl        = 'https://unkcbmfm41.execute-api.ap-southeast-1.amazonaws.com/dev/v1/'
// const currencyUrl       = 'https://unkcbmfm41.execute-api.ap-southeast-1.amazonaws.com/dev/v1/currency/institute/' + instituteId
const accPeriodUrl      = 'https://hhj7au1509.execute-api.ap-southeast-1.amazonaws.com/dev/v1/accounting-periods/'
const wcapSettingUrl    = 'https://7m0h9en2s3.execute-api.ap-southeast-1.amazonaws.com/dev/v1/wcapsettings/'
const products          = require("./api/product.js")
const warehouseUrl      = require("./api/warehouse.js")
const other             = require("./api/unknown")
const customer          = require("./api/customer")
const taxSetting        = require("./api/taxSetting")
const supplier          = require("./api/supplier")
const member            = require("./api/member")
const loan              = require("./api/loan")
const setting           = require("./api/setting")
const payroll           = require("./api/payroll")
const billing           = require("./api/billing")
const saleQuote         = require("./api/saleQuote")
const transaction       = require("./api/transaction")
const bank              = require("./api/bank-payment")
const employee          = require("./api/employee")
const institute         = require("./api/institute")
const currency         = require("./api/currency")
const service           = require("./api/service")
const compliance        = require("./api/compliance")
const price_promotion   = require("./api/price-promotion")
const item              = require("./api/item")
const dashboard         = require("./api/dashboard")
const financing         = require("./api/financing")
const billing_setting   = require("./api/billing-setting")
const location          = baseUrl + '/locations/'

module.exports = {
    // INSTITUTE
    institute_get                       : banhjiUrl + 'institutes/' + instituteId,
    institutes_get                      : banhjiUrl + 'users/' + creator + '/institutes',
    institute_put                       : banhjiUrl + 'institutes/' + instituteId + '?user=' + creator,

    // FISCALYEAR
    fiscalyear_get                      : accountingUrl + '/fiscalyear',

    // SEARCH
    search_get                          : accountingUrl + '/search',

    // ACCOUNT
    accounts                            : accountingUrl + '/accounts',
    account_types                       : accountingUrl + '/accounts/types',
    account_groups                      : accountingUrl + '/groups',

    // JOURNAL
    journals                            : accountingUrl + '/journals',

    // ACCOUNTING REPORTS
    accounting_report                   : accountingReportUrl,
    insights_get                        : accountingReportUrl + '/reports/insights',
    asset_liability_report              : accountingReportUrl + '/reports/assliabreport',
    variance_analysist                  : accountingReportUrl + '/reports/varianceanalysist',
    change_in_retain_earning            : accountingReportUrl + '/reports/changeinretainearning',

    journal_report_get                  : accountingReportUrl + '/reports/journal',
    general_ledger_get                  : accountingReportUrl + '/reports/primary/glreport',
    income_statement_get                : accountingReportUrl + '/reports/profitloss',
    balance_sheet_get                   : accountingReportUrl + '/reports/fpReport',

    variance_rule_setting               : accountingReportUrl + '/reports/setting/variancerules',
    variance_analysist_report           : accountingReportUrl + '/reports/varianceanalysist',

    reconcile_rule                      : reconcielRuleUrl,

    //DASHBOARD
    journal_post_back_date              : accountingUrl + '/reports/journals/backdate',
    journal_post_future_date            : accountingUrl + '/reports/journals/futuredate',

    // Financial Setting
    dropdown                            : 'https://myconnect.s3-ap-southeast-1.amazonaws.com/dropdown.json',

    // Account Prefix
    journal_prefix_get                  : prefixUrl + '/type/journal',
    prefix_put                          : prefixUrl + '/update/',

    // // Exchange Rate
    // currency                            : currencyUrl + '/type/fnc',
    // currencies                          : 'https://myconnect.s3-ap-southeast-1.amazonaws.com/currencymap.json',
    // xchange_post                        : xchangeUrl + 'institute/' + instituteId + '/fx',
    // xchange_get                         : xchangeUrl + 'fx/institute/' + instituteId + '/type/',
    // reporting_currency_get              : xchangeUrl + 'fx/institute/' + instituteId + '/xchange/reporting/',//$type[eg.monthly]/$year

    accounting_period_by_type_get       : accPeriodUrl + 'institute/' + instituteId + '/type/',

    // BANKING
    banking                             : bankingUrl,
    bank_accounts                       : bankingUrl + '/bankaccounts',
    bank_account_types                  : accountingUrl + '/bankaccount/types',
    bank_feeds                          : 'https://gist.githubusercontent.com/nicarayz/ba39cea3562c09bbb8215905ecaf929f/raw/fb7da08f4fc81d0d14ab4f9b68d30588210cc8d5/bankfeeds.json',
    financial_institute_types           : accountingUrl + '/financialinstitute/types',
    bank_account_status                 : bankfeedUrl + `/institutes/${instituteId}/banks`,
    external_banks                      : bankfeedUrl + '/banks', // + '/id' for specific bank
    partner_services                    : partnerServiceUrl,
    bank_qr                             : baseUrl +'/qr/',

    // WORKING CAPITAL
    working_capital                     : workingCapitalUrl,

    // WC Setting
    wcap_setting_post                   : wcapSettingUrl + 'institute/' + instituteId + '/add',
    wcap_setting_put                    : wcapSettingUrl + 'institute/' + instituteId + '/add/',
    wcap_setting_get                    : wcapSettingUrl + 'institute/' + instituteId + '/type/',
    wcap_prefix_get                     : prefixUrl + '/type/working_capital',
    finance_prefix_get                  : prefixUrl + '/type/loan_center',

    // FINANCE
    loans                               : financingUrl,

    // SETTINGS
    accounting_transaction_last_number  : accountingUrl + "/journals/lastnumber",

    // Entity Type
    entity_type                         : accountingUrl,

    // Prefix
    prefix_get                          : prefixUrl + '/type/',

    //Tax
    tax_get                             : prefixUrl + '/tax/list',

    // SUPPLIER
    expenses                            : `${baseUrl}/expense-v2/${instituteId}`,

    //warehouse
    warehouse                           : warehouseUrl,
    product                             : products ,
    other                               : other,
    customer                            : customer,
    supplier                            : supplier,
    member                              : member,
    loan                                : loan,
    financing                           : financing,
    setting                             : setting,

    //tax Setting
    tax_setting                         : taxSetting,

    // payroll
    payroll                             : payroll,

    // Billing
    billing                             : billing,
    //quote
    saleQuote                           : saleQuote,
    //Transaction
    transaction                         : transaction,
    //bank payment
    bank                                : bank,

    // Employee
    employee                            : employee,

    //institute
    institute                           : institute,

    //currency
    currency                            : currency,

    //service
    service                             : service,

    //compliance
    compliance                          : compliance,

    //price
    price_promotion                     : price_promotion,

    //Item
    item                                : item,

    //Dashboard
    dashboard                           : dashboard,

    billing_setting                     : billing_setting,

    location                            : location
}
