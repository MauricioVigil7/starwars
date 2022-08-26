function successResponse(message = "success", data = [] ) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            exito: true,
            mensaje: message,
            data,
            errores: []
        })
    };
}

function errorResponse(message , errors,fechaConsulta,status) {
    return {
        statusCode: status,
        body: JSON.stringify({
            statusCode: status,
            exito: false,
            mensaje: message,
            fechaConsulta:fechaConsulta,
            data: [],
            errores: typeof errors === 'string' ? [errors] : errors
        })
    };
}

function generateResponse(code, message, statusCode ) {
    return {
        statusCode,
        body: JSON.stringify({
            codigoMensaje: code,
            mensaje: message
        })
    };
}

module.exports = {
    successResponse, errorResponse,generateResponse
}