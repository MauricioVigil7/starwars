const service = require('../service/ArchivosService');
const response = require("../response");

async function cargar(params) {
    const carga = await service.cargar(params);
    if (carga.result) {
        return response.successResponse("success", carga.data);
    } else {
        return response.errorResponse("error", carga.errores);
    }
}

async function obtener(params) {
    const datos = await service.obtener(params);
    if (datos.result) {
        return response.successResponse("success", datos.data);
    } else {
        return response.errorResponse("error", datos.errores);
    }
}

async function eliminar(params) {
    const datos = await service.eliminar(params);
    if (datos.result) {
        return response.successResponse("success");
    } else {
        return response.errorResponse("error", datos.errores);
    }
}

module.exports = {
    cargar,
    obtener,
    eliminar
}