const axios 	= require('axios')
const instance = axios.create();
const baseUrl = process.env.VUE_APP_API;
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();
const instituteId = cookie !== undefined ? cookie.instituteId : '';
const inst = instituteId.split('-');
const getToken = async () => {
    let data ={
        email: "banhji@gmail.com",
        password: "Dfa$UZpaG4TT-k%e"
    }
    const result =  await instance.post(`https://api-rupp.camis-info.com/rupp-api/v1/identify`,data); 
    return result.data.token;
}

module.exports.get = async function () {
  try {
    const token = await getToken();
    const result =  await instance.get('https://api-rupp.camis-info.com/rupp-api/v1/list-fee-category',   
        {
            headers: {
                'Authorization': `Bearer ${token} `,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
         
            }
        });
    return result.data.data;
  } catch (error) {
    window.console.error(error)
  }
}
module.exports.getDepartment = async function () {
  try {
    const token = await getToken();
    const result =  await instance.get('https://api-rupp.camis-info.com/rupp-api/v1/list-all-faculty-department',   
        {
            headers: {
                'Authorization': `Bearer ${token} `,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
         
            }
        });
    return result.data.data;
  } catch (error) {
    window.console.error(error)
  }
}

module.exports.add = async function (data) {
    try {
        const result =  await axios.post(`${baseUrl}/v1-srv/educations/${inst[1]}/matches`,data); 
        window.console.log(result);
        return result.data;
    } catch (error) {
      window.console.error(error)
    }
  }

module.exports.getMatch = async () => {
  try {
    const result =  await axios.get(`${baseUrl}/v1-srv/educations/${inst[1]}/matches`); 
      window.console.log(result);
      return result.data;
  } catch (error) {
    window.console.error(error)
  }
}
  