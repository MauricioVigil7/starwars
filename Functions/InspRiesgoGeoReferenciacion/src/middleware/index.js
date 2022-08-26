const tokenService = require('../service/tokenService');
const response = require("../response");

module.exports.validateAuthToken = async (params) => {
    console.log('validateAuthToken********:',params);
    const tokenResult = await tokenService.validateToken(params.accessToken);
    console.log('tokenResult********:',tokenResult);
    if (!tokenResult.exito) {
        console.log('[RESPUESTA SERVICIO TOKEN]: ', tokenResult);
        return {result: false, data: response.generateResponse(tokenResult.errores.codigo, tokenResult.errores.mensaje, tokenResult.errores.status)};
    } else {
        return {result: true, data: []};
    }
};