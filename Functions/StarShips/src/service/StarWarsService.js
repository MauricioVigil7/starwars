const starshipsDao = require("../dao/Starships");



async function procesarIns(params) {
    console.log("procesarIns service:",params);
    return await starshipsDao.procesarIns(params);
}


async function procesarGet (params) {
    console.log("procesarGet service:",params);
    return await  starshipsDao.procesarGet(params);
}

module.exports = {
     
    procesarIns,procesarGet
   
}