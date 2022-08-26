const informeConstruccionService = require("../service/InformeConstruccionService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function paso4Ins(params,context) {
    const paso = await informeConstruccionService.paso4Ins(params,context);
    // console.log('****paso4Ins***',paso);
     if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso4Upd(params) {
    const paso = await informeConstruccionService.paso4Upd(params);
     //console.log('****paso4Upd***',paso);
     if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            //errores: paso.errores,
            statusCode:paso.status,
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
            
        });
    }  
}

async function paso4Get(numtramite,email) {
    const paso = await informeConstruccionService.paso4Get(numtramite,email);
    
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso5Ins(params,context) {
    const paso = await informeConstruccionService.paso5Ins(params,context);
      //console.log('****paso5Ins***',paso); 
      if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            //statusCode:paso.status,
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }  
}

async function paso5Upd(params) {
    const paso = await informeConstruccionService.paso5Upd(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso5Get(numtramite,email) {
    const paso = await informeConstruccionService.paso5Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}



async function paso1Ins(params) {
    const paso = await informeConstruccionService.paso1Ins(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso2Ins(params) {
    const paso = await informeConstruccionService.paso2Ins(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso3Ins(params) {
    const paso = await informeConstruccionService.paso3Ins(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso1Upd(params) {
    const paso = await informeConstruccionService.paso1Upd(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso2Upd(params) {
    const paso = await informeConstruccionService.paso2Upd(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso3Upd(params) {
    const paso = await informeConstruccionService.paso3Upd(params);
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            return repta;
    } 
    if(!paso.result) {
        return response.errorResponse("error", {
            errores: paso.errores,
            statusCode:paso.status
        });
    }  
}

async function paso1Get(numtramite,email) {
    //console.log('**** paso1Get controllernumtramite ********',numtramite);
    //console.log('**** paso1Get controller email ********',email);
    const paso = await informeConstruccionService.paso1Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso2Get(numtramite,email) {
    const paso = await informeConstruccionService.paso2Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}

async function paso3Get(numtramite,email) {
    const paso = await informeConstruccionService.paso3Get(numtramite,email);
    if (paso.result) {
        return response.successResponse2("success", paso.data);
    } else {
        return response.errorResponse("error", paso.errores);
    }
}


module.exports = {
    test, 
    paso1Get,paso1Upd,paso1Ins,
    paso2Get,paso2Upd,paso2Ins,
    paso3Ins,paso3Upd,paso3Get,
    paso4Upd,paso4Get,paso4Ins,
    paso5Upd,paso5Get,paso5Ins
}