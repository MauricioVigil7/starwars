const tokenService = require('../service/tokenService');
const response = require("../response");

module.exports.validateAuthToken = async headers => {
    try {
        if(headers.Authorization) {
            const token = headers.Authorization.split('Bearer ')[1];
            const tokenResult = await tokenService.validateToken(token);

            if (!tokenResult.exito) {
                console.log('[RESPUESTA SERVICIO TOKEN]: ', tokenResult);
                return {result: false, data: response.generateResponse(2, `Token inválido`, 401)};
            } else {
                return {result: true, data: []};
            }
        } else {
            return {result: false, data: response.generateResponse(2, `Token inválido`, 401)};
        }
    } catch (e) {
        return {result: false, data: response.generateResponse(2, `Token inválido: ${e}`, 401)};
    }
};