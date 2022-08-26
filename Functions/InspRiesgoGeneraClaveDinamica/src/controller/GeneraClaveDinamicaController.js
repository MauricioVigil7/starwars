const generaClaveDinamicaService = require("../service/GeneraClaveDinamicaService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function generarClave(params) {
    let generaClaveDinamica = await generaClaveDinamicaService.generarClave(params);
    //console.log('******* generaClaveDinamica****:' );
    console.log(generaClaveDinamica );
    //console.log('******* generaClaveDinamica****:' );
    if (generaClaveDinamica.result) {
        return response.successResponse("success", generaClaveDinamica.data);
    } else {
        return response.errorResponse("error", generaClaveDinamica.errores);
    }
}

async function verificarClave(params) {
    let vericaClaveDinamica = await generaClaveDinamicaService.verificarClave(params);

    if (vericaClaveDinamica.result) {
        return response.successResponse("success", vericaClaveDinamica.data);
    } else {
        return response.errorResponse("error", vericaClaveDinamica.errores);
    }
}


module.exports = {
    test, verificarClave, generarClave
}