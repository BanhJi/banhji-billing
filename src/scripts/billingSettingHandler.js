const axios = require('axios')
const apiUrl = require('../apiUrl.js')


// get
module.exports.getDimension = async function (val) {
    try {
        const response = await axios.get(apiUrl.billing_setting.dimension_get,{
            params: {
                type: val.type
            }
        })
        return response
    } catch (error) {
        window.console.error(error)
    }
}
// save
module.exports.createSubLocation = async (data) => {
    try {
        const response = await axios.post(apiUrl.billing_setting.sub_location_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.createContractLevel = async (data) => {
    try {
        const response = await axios.post(apiUrl.billing_setting.contract_level_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}