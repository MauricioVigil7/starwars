function successResponse(message , data) {
    return {
        exito: true,
        mensaje: message,
        data,
        errores: []
    };
}

function errorResponse(message , errors,fechaConsulta) {
    return {
        exito: false,
        mensaje: message,
        data: null,
        errores: typeof errors === 'string' ? [errors] : errors
    };
}

module.exports = {
    successResponse, errorResponse
}