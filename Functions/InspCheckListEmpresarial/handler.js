
const checkListEmpresarialController = require('./src/controller/CheckListEmpresarialController');
//const middleware = require('./src/middleware/index');
var error500 =  {
    // statusCode: 500,
        exito: false,
        mensaje: 'error',
        data: [],
        errores: [
            {
                codigo: -2,
                mensaje: 'Recurso/acceso no disponible',
            }
        ]
};

async function registrarPaso4(data) {
    try {
        //console.info(" registrarPaso4: " , data);  
        var resultado = await checkListEmpresarialController.paso4Ins(data);
        //console.info(" Paso4: " ,resultado);      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso5(data) {
    try {
        //console.info(" registrarPaso5: " , data);  
        var resultado = await checkListEmpresarialController.paso5Ins(data);
        //console.info(" Paso5: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso6(data,context) {
    try {
        //console.info(" registrarPaso6: " , data);  
        data.codEdificacion = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso6Ins(data);
        //console.info(" Paso6: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso7(data,context) {
    try {
        console.info(" registrarPaso7: " , data);  
        data.codActividad = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso7Ins(data);
        //console.info(" Paso7: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso8(data,context) {
    try {
        //console.info(" registrarPaso8: " , data);  
        data.codAlmacenamiento = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso8Ins(data);
        //console.info(" Paso8: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso9(data,context) {
    try {
        //console.info(" registrarPaso9: " , data);  
        data.codIncendio = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso9Ins(data);
        //console.info(" Paso9: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso10(data,context) {
    try {
        //console.info(" registrarPaso10: " , data);  
        data.codRamos = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso10Ins(data);
        //console.info(" Paso10: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso11(data,context) {
    try {
        //console.info(" registrarPaso11: " , data);  
        data.codRoboAsalto = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso11Ins(data);
        //console.info(" Paso11: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso12(data,context) {
    try {
        //console.info(" registrarPaso12: " , data);  
        data.codSiniestro = context.awsRequestId;
        var resultado = await checkListEmpresarialController.paso12Ins(data);
        //console.info(" Paso12: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso13(data) {
    try {
        //console.info(" registrarPaso13: " , data);  
        var resultado = await checkListEmpresarialController.paso13Ins(data);
        //console.info(" Paso13: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


//**************** update **************

async function updatePaso4(data)  {
    try {
        let insert = await checkListEmpresarialController.paso4Upd(data);
        //console.info("update Paso4: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso5 (data) {
    try {
        let insert = await checkListEmpresarialController.paso5Upd(data);
        //console.info("update Paso5: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso6(data) {
    try {
        let insert = await checkListEmpresarialController.paso6Upd(data);
        //console.info("update Paso6: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso7(data) {
    try {
        let insert = await checkListEmpresarialController.paso7Upd(data);
        //console.info("update Paso7: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso8(data) {
    try {
        let insert = await checkListEmpresarialController.paso8Upd(data);
        //console.info("update Paso8: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso9(data)  {
    try {
        //console.log('**** handler :',data);
        let insert = await checkListEmpresarialController.paso9Upd(data);
        //console.info("update Paso9: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso10(data) {
    try {
        let insert = await checkListEmpresarialController.paso10Upd(data);
        //console.info("update Paso10: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso11 (data) {
    try {
        let insert = await checkListEmpresarialController.paso11Upd(data);
        //console.info("update Paso11: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

async function updatePaso12 (data) {
    try {
        let insert = await checkListEmpresarialController.paso12Upd(data);
        //console.info("update Paso12: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
    
}

async function updatePaso13 (data) {
    try {
        let insert = await checkListEmpresarialController.paso13Upd(data);
        //console.info("update Paso13: " ,insert); 
              
        return insert;   
    } catch (e) {
        return error500;
    }
    
}

//***************** get **********

async function paso4Get(data)  {
    try {
        //console.info("*******get Paso4********: " , data); 
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        //console.info("get Paso4:numtramite " , numtramite); 
        //console.info("get Paso4:email " , email); 
        //console.info("get Paso4:codTipoTramite " , codTipoTramite); 
        var resultado = await checkListEmpresarialController.paso4Get(numtramite,email,codTipoTramite);
        //console.info("get Paso4: " + JSON.stringify(data.path));      
        return resultado;   

    } catch (e) {
        return error500;
    }   
}

async function  paso5Get (data)  {
    try {
        //console.info("********* paso5Get****** " );
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        //console.info("get Paso5 numtramite: " + numtramite);  
        //console.info("get Paso5 email: " + email);  
        //console.info("get Paso5 codTipoTramite: " + codTipoTramite);  

        let rpta = await checkListEmpresarialController.paso5Get(numtramite,email,codTipoTramite);
        //console.info("get Paso5: rpta " , JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }   
}

async function  paso6Get (data)  {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso6Get(numtramite,email,codTipoTramite);
        //console.info("get Paso6: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }   
}

async function  paso7Get(data)  {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso7Get(numtramite,email,codTipoTramite);
        //console.info("get Paso7: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }   
}

async function paso8Get (data) {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso8Get(numtramite,email,codTipoTramite);
        //console.info("get Paso8: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;    
    }
}

async function  paso9Get (data) {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso9Get(numtramite,email,codTipoTramite);
        //console.info("get Paso9: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }
}

async function  paso10Get (data) {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso10Get(numtramite,email,codTipoTramite);
        //console.info("get Paso10: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }
}

async function  paso11Get (data) {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso11Get(numtramite,email,codTipoTramite);
        //console.info("get Paso11: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }
}

async function  paso12Get (data) {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso12Get(numtramite,email,codTipoTramite);
        //console.info("get Paso12: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }
}

async function  paso13Get (data) {
    try {
        var numtramite = data.params.path.claveTramite;
        var email = data.params.path.email;
        var codTipoTramite = data.params.path.codTipoTramite;
        let rpta = await checkListEmpresarialController.paso13Get(numtramite,email,codTipoTramite);
        //console.info("get Paso12: " + JSON.stringify(data.path));      
        return rpta;   
    } catch (e) {
        return error500;
    }
}


module.exports.datos = async (event, context) => {
    
    //console.error('********event*****',event);
    let action = event.action;
    //const ruta = event.data.path;
    var numtramite = '';
    var email = '';
    // const headers = event.header;
    // console.log('headers:', header['fechaTransaccion']);
     //headers.accessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdXZpZ2lsQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidXNyZXNibWFwZnJlIiwiaWF0IjoxNjQ0MzUzMjkyLCJleHAiOjE2NDQzNTY4OTJ9.zlmrb9z_BTiUzlOZndDjq2FGejSXTnxH1EvC4zVSTKg';
     //headers.fechaTransaccion='05/02/2022';
     var error500 = {      
            exito: false,
            mensaje: 'error',
            data: [],
            errores: [
                {
                    codigo: 3,
                    mensaje: 'Error de validación de datos',
                }
            ]     
    };

   /*  if (!headers.fechaTransaccion) {
        return error500;
    }*/

    try {
        if (action === 'insertPaso') {

            if (event.params.path.paso === '4') {
                let contentBody = await registrarPaso4(event.data)
                //console.log('contentBody:',contentBody);
                return contentBody;
            } else if (event.params.path.paso === '5') {
                event.data.codEntrevistado=context.awsRequestId;
                let contentBody = await registrarPaso5(event.data)
                //console.log(`registrarPaso5: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '6') {
                let contentBody = await registrarPaso6(event.data,context)
                //console.log(`registrarPaso6: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '7') {
                let contentBody = await registrarPaso7(event.data,context)
                //console.log(`registrarPaso7: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '8') {
                let contentBody = await registrarPaso8(event.data,context)
                //console.log(`registrarPaso8: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '9') {
                let contentBody = await registrarPaso9(event.data,context)
                //console.log(`registrarPaso9: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '10') {
                let contentBody = await registrarPaso10(event.data,context)
                //console.log(`registrarPaso10: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '11') {
                let contentBody = await registrarPaso11(event.data,context)
                //console.log(`registrarPaso11: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '12') {
                let contentBody = await registrarPaso12(event.data,context)
                //console.log(`registrarPaso12: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '13') {
                let contentBody = await registrarPaso13(event.data)
                //console.log(`registrarPaso12: ${JSON.stringify(contentBody)}`)
                return contentBody;
            }


        } else if (action === 'updatePaso') {
            if (event.params.path.paso === '4') {
                let contentBody = await updatePaso4(event.data)
                //console.log(`updatePaso4: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '5') {
                let contentBody = await updatePaso5(event.data)
                //console.log(`updatePaso5: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } if (event.params.path.paso === '6') {
                let contentBody = await updatePaso6(event.data)
                //console.log(`updatePaso6: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '7') {
                let contentBody = await updatePaso7(event.data)
                //console.log(`updatePaso7: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } if (event.params.path.paso === '8') {
                let contentBody = await updatePaso8(event.data)
                //console.log(`updatePaso8: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '9') {
                let contentBody = await updatePaso9(event.data)
                //console.log(`updatePaso9: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } if (event.params.path.paso === '10') {
                let contentBody = await updatePaso10(event.data)
                //console.log(`updatePaso10: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '11') {
                let contentBody = await updatePaso11(event.data)
                //console.log(`updatePaso11: ${JSON.stringify(contentBody)}`)
                return contentBody;
            }else if (event.params.path.paso === '12') {
                let contentBody = await updatePaso12(event.data)
                //console.log(`updatePaso12: ${JSON.stringify(contentBody)}`)
                return contentBody;
            }else if (event.params.path.paso === '13') {
                let contentBody = await updatePaso13(event.data)
                //console.log(`updatePaso12: ${JSON.stringify(contentBody)}`)
                return contentBody;
            }


        } else if (action === 'getPaso') {
           // console.info("********* paso4Get****** " ,event.path.paso );
            if (event.params.path.paso === '4') {
                //console.info("********* paso4Get****** " ,event.params.path.paso );
                let contentBody = await paso4Get(event)
                //console.log(`getPaso4: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '5') {
                //console.info("********* paso5Get****** " ,event.data.path.paso );
                let contentBody = await paso5Get(event)
                //console.info("********* paso5Get contentBody****** " ,contentBody );
                //console.log(`getPaso5: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '6') {
                let contentBody = await paso6Get(event)
                //console.log(`getPaso6: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '7') {
                let contentBody = await paso7Get(event)
                //console.log(`getPaso7: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '8') {
                let contentBody = await paso8Get(event)
                //console.log(`getPaso8: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '9') {
                let contentBody = await paso9Get(event)
                //console.log(`getPaso9: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '10') {
                let contentBody = await paso10Get(event)
                //console.log(`getPaso10: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '11') {
                let contentBody = await paso11Get(event)
                //console.log(`getPaso11: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '12') {
                let contentBody = await paso12Get(event)
                //console.log(`getPaso12: ${JSON.stringify(contentBody)}`)
                return contentBody;
            }else if (event.params.path.paso === '13') {
                let contentBody = await paso13Get(event)
                //console.log(`getPaso13: ${JSON.stringify(contentBody)}`)
                return contentBody;
            }
        }

    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }


  

    
};