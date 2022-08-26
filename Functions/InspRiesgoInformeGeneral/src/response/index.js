function successResponse(message , data ,fechaConsulta) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            exito: true,
            mensaje: message,
            fechaConsulta:fechaConsulta,
            data,
            errores: []
        })
    };
}

function errorResponse(message , errors,fechaConsulta) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            exito: false,
            mensaje: message,
            fechaConsulta:fechaConsulta,
            data: null,
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
function generateResponse2(statusCode,exito, message, data,errors ) {
    return {
        body: JSON.stringify({
            statusCode:statusCode,
            exito: exito,
            mensaje: message,
            data: data,
            errores: typeof errors === 'string' ? [errors] : errors
        })
    };
}

function successResponse2(message = "success", data = [] ) {
    return {
            exito: true,
            mensaje: message,
            data,
            errores: []   
    };
}


module.exports = {
    successResponse, errorResponse,generateResponse,generateResponse2,successResponse2
}