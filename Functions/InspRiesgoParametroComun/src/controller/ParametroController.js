const parametroService = require("../service/ParametroService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function listar(group, parameter) {
    if (!group){
        return response.errorResponse("error", [{
            codigo:'1',
            mensaje:'Parametros no Reconocidos!'
        }]);
    }
    const Parametro = await parametroService.listar(group, parameter);
    if (Parametro.result) {
        //console.log('xxxxxxxxx');
        //console.log(Parametro.data);
        //console.log('xxxxxxxxx');
        return response.successResponse("success", Parametro.data);
    } else {
        return response.errorResponse("error", Parametro.errores);
    }
}

async function listarTodo() {
    //console.log('**** parametro controller ****');
    const ParametroAll = await parametroService.listarTodo();
    if (ParametroAll.result) {
        return response.successResponse("success", ParametroAll.data);
    } else {
        return response.errorResponse("error", ParametroAll.errores);
    }
}

module.exports = {
    test, listar, listarTodo
}