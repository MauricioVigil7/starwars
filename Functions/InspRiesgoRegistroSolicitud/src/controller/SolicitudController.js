const solicitudService = require('../service/SolicitudService');
const response = require('../response');

async function insertSolicitud(params) {
    const data = await solicitudService.insertSolicitud(params);
    console.log(`InsertSolicitud: ${JSON.stringify(data)}`)

    let dataResponse = []

    if(data.result) {
        
        let valorExito = {
            codigo: 0,
            mensaje: "Solicitud de trámite agregado con éxito"
        }

        dataResponse.push(JSON.stringify(valorExito))
        return response.successResponse("Operación Exitosa", dataResponse);
    } else {

        let valorError = {
            codigo: 1,
            mensaje: "Error de validación de token, u acceso"
        }
        dataResponse.push(JSON.stringify(valorError))

        return response.errorResponse("error", dataResponse);
    }
}

module.exports = {
    insertSolicitud
}