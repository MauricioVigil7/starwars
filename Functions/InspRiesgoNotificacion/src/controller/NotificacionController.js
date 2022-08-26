const notificacionService = require("../service/NotificacionService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function enviar(params) {
    let notificacion = await notificacionService.enviar(JSON.parse(params));
    if (notificacion.result) {
        return response.successResponse("success", notificacion.data);
    } else {
        return response.errorResponse("error", notificacion.errores);
    }
}

module.exports = {
    test, enviar
}