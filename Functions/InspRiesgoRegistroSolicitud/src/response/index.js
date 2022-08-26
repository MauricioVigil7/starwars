function successResponse(message = "success", data = []) {
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

function errorResponse(message = "error", errors = [], statusCode = 500) {
    return {
        statusCode,
        body: JSON.stringify({
            exito: false,
            mensaje: message,
            data: null,
            errors
        })
    };
}

module.exports = {
    successResponse, errorResponse
}