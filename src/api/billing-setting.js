/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

// const myUrl = require("@/url")
// const baseUrl = myUrl.url
const baseUrl = 'https://sandbox.banhji.com'
const url          = baseUrl  + '/entity-billing-settings/'

module.exports = {
    sub_location_post                   : url + 'sub-location/institute/' + instituteId + '/add',
    dimension_get                       : url + 'dimension/institute/' + instituteId + '/get',
    contract_level_post                 : url + 'contract-level/institute/' + instituteId + '/add',
    contract_level_get                  : url + 'contract-level/institute/' + instituteId + '/get',
}