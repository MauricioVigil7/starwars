const checkListEmpresarialService = require("../service/CheckListEmpresarialService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}

async function paso4Ins(params) {
    const paso = await checkListEmpresarialService.paso4Ins(params);
    //console.log('****codigo***',paso.data.codigo); 
    //console.log('****mensaje***',paso.data.mensaje); 
    if(paso.result) {
        var repta = response.successResponse("success", 
            { 
                codigo: paso.data.codigo, 
                mensaje: paso.data.mensaje
            }
            );
            //console.log('****pas4Ins***',repta); 
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
    const paso = await checkListEmpresarialService.paso4Upd(params);

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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso4Get(claveTramite,email,codTipoTramite) {
    const paso4get = await checkListEmpresarialService.paso4Get(claveTramite,email,codTipoTramite);
    if (paso4get.result) {
        return response.successResponse2("success", paso4get.data);
    } else {
        return response.errorResponse("error", paso4get.errores);
    }
}



async function paso5Ins(params) {
    const paso = await checkListEmpresarialService.paso5Ins(params);

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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}


async function paso5Upd(params) {
    const paso = await checkListEmpresarialService.paso5Upd(params);

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
        var rpta =  response.errorResponse("error", {
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
        //console.log('**** paso5 resultado',rpta);
        return rpta;
    }
}

async function paso5Get(numtramite,email,codTipoTramite) {
    const paso5 = await checkListEmpresarialService.paso5Get(numtramite,email,codTipoTramite);
    //console.log('**** paso5InformacionGeneralGet resultado',paso5.data);
    
    if (paso5.result) {
        return response.successResponse2("success", paso5.data);
    } else {
        return response.errorResponse("error", paso5.errores,paso5.fechaConsulta);
    }
}




async function paso6Ins(params) {
    const paso = await checkListEmpresarialService.paso6Ins(params);

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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso6Upd(params) {
    const paso = await checkListEmpresarialService.paso6Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso6Get(numtramite,email,codTipoTramite) {
    const paso6 = await checkListEmpresarialService.paso6Get(numtramite,email,codTipoTramite);
    if (paso6.result) {
        return response.successResponse2("success", paso6.data);
    } else {
        return response.errorResponse("error", paso6.errores,paso6.fechaConsulta);
    }
}

async function paso7Ins(params) {
    const paso = await checkListEmpresarialService.paso7Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso7Upd(params) {
    const paso = await checkListEmpresarialService.paso7Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso7Get(numtramite,email,codTipoTramite) {
    const paso7 = await checkListEmpresarialService.paso7Get(numtramite,email,codTipoTramite);
    if (paso7.result) {
        return response.successResponse2("success", paso7.data);
    } else {
        return response.errorResponse("error", paso7.errores,paso7.fechaConsulta);
    }
}

async function paso8Ins(params) {
    const paso = await checkListEmpresarialService.paso8Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso8Upd(params) {
    const paso = await checkListEmpresarialService.paso8Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso8Get(numtramite,email,codTipoTramite) {
    const paso8 = await checkListEmpresarialService.paso8Get(numtramite,email,codTipoTramite);
    if (paso8.result) {
        return response.successResponse2("success", paso8.data);
    } else {
        return response.errorResponse("error", paso8.errores,paso8.fechaConsulta);
    }
}

async function paso9Ins(params) {
    const paso = await checkListEmpresarialService.paso9Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso9Upd(params) {
    const paso = await checkListEmpresarialService.paso9Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso9Get(numtramite,email,codTipoTramite) {
    const paso9 = await checkListEmpresarialService.paso9Get(numtramite,email,codTipoTramite);
    if (paso9.result) {
        return response.successResponse2("success", paso9.data);
    } else {
        return response.errorResponse("error", paso9.errores,paso9.fechaConsulta);
    }
}

async function paso10Ins(params) {
    const paso = await checkListEmpresarialService.paso10Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso10Upd(params) {
    const paso = await checkListEmpresarialService.paso10Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso10Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 contoller************');
    const paso10 = await checkListEmpresarialService.paso10Get(numtramite,email,codTipoTramite);
    if (paso10.result) {
        return response.successResponse2("success", paso10.data);
    } else {
        return response.errorResponse("error", paso10.errores,paso10.fechaConsulta);
    }
}

async function paso11Ins(params) {
    const paso = await checkListEmpresarialService.paso11Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso11Upd(params) {
    const paso = await checkListEmpresarialService.paso11Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso11Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso11Robo 1 contoller************');
    const paso10 = await checkListEmpresarialService.paso11Get(numtramite,email,codTipoTramite);
    if (paso10.result) {
        return response.successResponse2("success", paso10.data);
    } else {
        return response.errorResponse("error", paso10.errores,paso10.fechaConsulta);
    }
}

async function paso12Ins(params) {
    const paso = await checkListEmpresarialService.paso12Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }

}

async function paso12Upd(params) {
    const paso = await checkListEmpresarialService.paso12Upd(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso12Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso11Robo 1 contoller************');
    const paso12 = await checkListEmpresarialService.paso12Get(numtramite,email,codTipoTramite);
    if (paso12.result) {
        return response.successResponse2("success", paso12.data,paso12.fechaConsulta);
    } else {
        return response.errorResponse("error", paso12.errores,paso12.fechaConsulta);
    }
}

async function paso13Ins(params) {
    const paso = await checkListEmpresarialService.paso13Ins(params);
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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}

async function paso13Upd(params) {
    const paso = await checkListEmpresarialService.paso13Upd(params);
    //console.log('*******paso13************',paso);

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
            codigo: paso.errores.codigo, 
            mensaje: paso.errores.mensaje
        });
    }
}
async function paso13Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso11Robo 1 contoller************');
    const paso12 = await checkListEmpresarialService.paso13Get(numtramite,email,codTipoTramite);
    if (paso12.result) {
        return response.successResponse2("success", paso12.data,paso12.fechaConsulta);
    } else {
        return response.errorResponse("error", paso12.errores,paso12.fechaConsulta);
    }
}
  

module.exports = {
    test, 
    paso13Upd,paso13Get,paso13Ins,
    paso12Get,paso12Upd,paso12Ins,
    paso11Get,paso11Upd,paso11Ins,
    paso10Ins,paso10Upd,paso10Get,
    paso9Upd,paso9Get,paso9Ins,
    paso8Upd,paso8Get,paso8Ins,
    paso7Upd,paso7Get,paso7Ins,
    paso6Upd,paso6Get, paso6Ins,
    paso4Ins,paso4Upd, paso4Get,
    paso5Upd,paso5Get,paso5Ins
}