const inspeccionesService = require("../service/InspeccionesService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function listar(correoInspector,claveTramite) {
    const inspecciones = await inspeccionesService.listar(correoInspector,claveTramite);
    if (inspecciones.result) {
        return response.successResponse("success", inspecciones.data);
    } else {
        return response.errorResponse("error", inspecciones.errores);
    }
}

module.exports = {
    test, listar
}