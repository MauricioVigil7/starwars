const starWarsService = require("../service/StarWarsService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function procesarIns(params) {

    const paso = await starWarsService.procesarIns(params);
     if(paso.result) {
        return response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}


async function procesarGet(params) {
    const paso = await starWarsService.procesarGet(params);  
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}




module.exports = {
    test, 
    procesarGet,procesarIns
}