function successResponse(message = "Informe Generado", data = []) {
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

function errorResponse(message = "Error Interno", errors, statusCode = 500) {
    return {
        statusCode,
        body: JSON.stringify({
            exito: false,
            mensaje: message,
            data: null,
            errores: typeof errors === 'string' ? [errors] : errors
        })
    };
}

module.exports = {
    successResponse, errorResponse
}