const informeGeneralService = require("../service/InformeGeneralService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function paso4Ins(params) {
    
    const paso = await informeGeneralService.paso4Ins(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso4upd(params) {
    const paso = await informeGeneralService.paso4upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso4Get(numtramite,email) {
    const paso = await informeGeneralService.paso4Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}



async function paso5Ins(params,context) {
    const paso = await informeGeneralService.paso5Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso5Upd(params) {
    const paso = await informeGeneralService.paso5Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso5Get(numtramite,email) {
    const paso = await informeGeneralService.paso5Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso6Ins(params,context) {
    const paso = await informeGeneralService.paso6Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso6Upd(params) {
    const paso = await informeGeneralService.paso6Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso6Get(numtramite,email) {
    const paso = await informeGeneralService.paso6Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso7Ins(params,context) {
    const paso = await informeGeneralService.paso7Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso7Upd(params) {
    const paso = await informeGeneralService.paso7Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso7Get(numtramite,email) {
    const paso = await informeGeneralService.paso7Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso8Ins(params,context) {
    const paso = await informeGeneralService.paso8Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso8Upd(params) {
    const paso = await informeGeneralService.paso8Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso8Get(numtramite,email) {
    const paso = await informeGeneralService.paso8Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso9Ins(params,context) {
    const paso = await informeGeneralService.paso9Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso9Upd(params) {
    const paso = await informeGeneralService.paso9Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso9Get(numtramite,email) {
    const paso = await informeGeneralService.paso9Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }

}


async function paso10Ins(params,context) {
    const paso = await informeGeneralService.paso10Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso10Upd(params) {
    const paso = await informeGeneralService.paso10Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso10Get(numtramite,email) {
    const paso = await informeGeneralService.paso10Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso11Ins(params,context) {
    const paso = await informeGeneralService.paso11Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso11Upd(params) {
    const paso = await informeGeneralService.paso11Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso11Get(numtramite,email) {
    const paso = await informeGeneralService.paso11Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso12Ins(params,context) {
    const paso = await informeGeneralService.paso12Ins(params,context);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}


async function paso12Upd(params) {
    const paso = await informeGeneralService.paso12Upd(params);
    if (paso.result) {
        return response.generateResponse2(200,true, "Registro exitoso", paso.data, []);
    } else {
        return response.generateResponse2(401,false, "Acceso no permitido", [], paso.errores); 
    }
}

async function paso12Get(numtramite,email) {
    const paso = await informeGeneralService.paso12Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}


module.exports = {
    test, 
    paso12Get,paso12Upd,paso12Ins,
    paso11Get,paso11Upd,paso11Ins,
    paso10Ins,paso10Upd,paso10Get,
    paso9Upd,paso9Get,paso9Ins,paso8Upd,paso8Get,paso8Ins,
    paso7Upd,paso7Get,paso7Ins,
    paso6Upd,paso6Get, paso4Get,paso4Ins,paso4upd,
    paso5Upd,paso5Get,paso5Ins,paso6Ins
}