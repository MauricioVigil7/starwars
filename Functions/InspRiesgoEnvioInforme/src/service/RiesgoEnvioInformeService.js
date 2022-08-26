const dao = require("../dao/RiesgoEnvioInformeDao");

async function enviarInforme(params) {
    console.log('****  service 1 ********');
    const paso = await dao.enviarInforme(params);
    console.log('****  service 2 ********');
    return paso;  
}

module.exports = 
  {  enviarInforme } ;
