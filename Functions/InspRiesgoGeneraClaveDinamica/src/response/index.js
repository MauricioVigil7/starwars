function successResponse(message = "success", data = []) {
    return {
       // statusCode: 200,
       // body: JSON.stringify({
            exito: true,
            mensaje: message,
            data,
            errores: []
        //})
    };
}

function errorResponse(message = "error", errors) {
    return {
       // statusCode: 500,
       // body: JSON.stringify({
            exito: false,
            mensaje: message,
            data: [],
            errores: typeof errors === 'string' ? [errors] : errors
      //  })
    };
}

module.exports = {
    successResponse, errorResponse
}