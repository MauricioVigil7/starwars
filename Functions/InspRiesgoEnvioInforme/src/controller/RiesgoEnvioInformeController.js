const servicio = require("../service/RiesgoEnvioInformeService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function enviarInforme(params) {
    const paso = await servicio.enviarInforme(params);
    if (paso.result) {
        return response.successResponse("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

module.exports = 
{    test, 
    enviarInforme};
