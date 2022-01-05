/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/bank.srv/v1/'

module.exports = {
    bank_connected_get                                : url + 'institutes/' + instituteId + '/banks',
}