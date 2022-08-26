function successResponse(message , data ,fechaConsulta) {
    return {
        //statusCode: 200,
        exito: true,
        mensaje: message,
        data,
        errores: []    
    };
}

function errorResponse(message , errors,fechaConsulta) {
    return {
        //statusCode: 500,
       // {
            exito: false,
            mensaje: message,
      //      fechaConsulta:fechaConsulta,
            data: [],
            errores: typeof errors === 'string' ? [errors] : errors
       // }
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