
const informeGeneralController = require('./src/controller/InformeGeneralController');
//const middleware = require('./src/middleware/index');
var error500 =  {
    statusCode: 500,
    body: JSON.stringify({
        exito: false,
        mensaje: 'Acceso no permitido',
        data: [],
        errores: [
            {
                codigo: -2,
                mensaje: 'Recurso/acceso no disponible',
            }
        ]
    })
};


async function registrarPaso4(data) {
    try {
        console.info(" registrarPaso4: " , data);  
        var resultado = await informeGeneralController.paso4Ins(data);
        console.info("get Paso4: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


const registrarPaso5 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso5Ins(data,context);
        console.info("Insert Paso5: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}
 
const registrarPaso6 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso6Ins(data,context);
        console.info("Insert Paso6: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const registrarPaso7 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso7Ins(data,context);
        console.info("Insert Paso7: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}
const registrarPaso8 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso8Ins(data,context);
        console.info("Insert Paso8: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const registrarPaso9 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso9Ins(data,context);
        console.info("Insert Paso9: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const registrarPaso10 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso10Ins(data,context);
        console.info("Insert Paso10: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const registrarPaso11 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso11Ins(data,context);
        console.info("Insert Paso11: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const registrarPaso12 = async (data,context) => {
    try {
        let insert = await informeGeneralController.paso12Ins(data,context);
        console.info("Insert Paso12: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

//**************** update **************


async function updatePaso4(data) {
    try {
        console.info(" updatePaso4: " , data);  
        var resultado = await informeGeneralController.paso4upd(data);
        console.info("updatePaso4: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


const updatePaso5 = async (data) => {
    try {
        let insert = await informeGeneralController.paso5Upd(data);
        console.info("update Paso5: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso6 = async (data) => {
    try {
        let insert = await informeGeneralController.paso6Upd(data);
        console.info("update Paso6: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso7 = async (data) => {
    try {
        let insert = await informeGeneralController.paso7Upd(data);
        console.info("update Paso7: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso8 = async (data) => {
    try {
        let insert = await informeGeneralController.paso8Upd(data);
        console.info("update Paso8: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso9 = async (data) => {
    try {
        let insert = await informeGeneralController.paso9Upd(data);
        console.info("update Paso9: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso10 = async (data) => {
    try {
        let insert = await informeGeneralController.paso10Upd(data);
        console.info("update Paso10: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso11 = async (data) => {
    try {
        let insert = await informeGeneralController.paso11Upd(data);
        console.info("update Paso11: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
}

const updatePaso12 = async (data) => {
    try {
        let insert = await informeGeneralController.paso12Upd(data);
        console.info("update Paso12: " + JSON.stringify(insert));      
        return insert;   
    } catch (e) {
        return error500;
    }
    
}

//***************** get **********

async function paso4Get(event) {
    try {
        console.info("get Paso4: " , event);  
        //let rpta = {};       
        //var path = data.path.split('/');
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso4:numtramite " , numtramite); 
        console.info("get Paso4:email " , email); 
        var resultado = await informeGeneralController.paso4Get(numtramite,email);
        //console.info("get Paso4: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


async function paso5Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso5:numtramite " , numtramite); 
        console.info("get Paso5:email " , email); 
        var resultado = await informeGeneralController.paso5Get(numtramite,email);
        //console.info("get Paso5: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso6Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso6:numtramite " , numtramite); 
        console.info("get Paso6:email " , email); 
        var resultado = await informeGeneralController.paso6Get(numtramite,email);
        //console.info("get Paso6: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


async function paso7Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso7:numtramite " , numtramite); 
        console.info("get Paso7:email " , email); 
        var resultado = await informeGeneralController.paso7Get(numtramite,email);
        //console.info("get Paso7: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}



async function paso8Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso8:numtramite " , numtramite); 
        console.info("get Paso8:email " , email); 
        var resultado = await informeGeneralController.paso8Get(numtramite,email);
        //console.info("get Paso8: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso9Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso9:numtramite " , numtramite); 
        console.info("get Paso9:email " , email); 
        var resultado = await informeGeneralController.paso9Get(numtramite,email);
        //console.info("get Paso9: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso10Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso10:numtramite " , numtramite); 
        console.info("get Paso10:email " , email); 
        var resultado = await informeGeneralController.paso10Get(numtramite,email);
        //console.info("get Paso10: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso11Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso11:numtramite " , numtramite); 
        console.info("get Paso11:email " , email); 
        var resultado = await informeGeneralController.paso11Get(numtramite,email);
        //console.info("get Paso11: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso12Get(event) {
    try {
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        console.info("get Paso12:numtramite " , numtramite); 
        console.info("get Paso12:email " , email); 
        var resultado = await informeGeneralController.paso12Get(numtramite,email);
        //console.info("get Paso12: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}



module.exports.informe = async (event, context) => {
    //const currentMethod = event.httpMethod;
    ////console.log(event)
    //console.error('event.data',event.data);
    let action = event.action;
    const ruta = event.data.path;
    var numtramite = '';
    var email = '';
     const headers = event.header;
    // //console.log('headers:', header['fechaTransaccion']);
     //headers.accessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdXZpZ2lsQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidXNyZXNibWFwZnJlIiwiaWF0IjoxNjQ0MzUzMjkyLCJleHAiOjE2NDQzNTY4OTJ9.zlmrb9z_BTiUzlOZndDjq2FGejSXTnxH1EvC4zVSTKg';
     //headers.fechaTransaccion='05/02/2022';
     var error500 = {
        statusCode: 500,
        body: JSON.stringify({
            exito: false,
            mensaje: 'Acceso no permitido',
            data: [],
            errores: [
                {
                    codigo: 3,
                    mensaje: 'Error de validación de datos',
                }
            ]
        })
    };
    // //console.log('**** AccessToken :', headers.AccessToken);
     //headers.accessToken=headers.AccessToken;
     //const authToken = await middleware.validateAuthToken(headers);
     ////console.log('authToken:', authToken);
     //if(authToken.result) {
       // return authToken.data;
     //}
    // console.error('headers.fechaTransaccion',event.data.header.fechaTransaccion);
    // console.error('event.params.path.paso',event.data.path.paso);
     //console.error('event.data',event.data);
     console.error('event',event);
   /*  if (!headers.fechaTransaccion) {
        return error500;
    }*/

    try {
        if (action === 'insertPaso') {

            if (event.params.path.paso === '4') {
                let contentBody = await registrarPaso4(event.data)
                //console.log(`registrarPaso4: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '5') {
                let contentBody = await registrarPaso5(event.data,context)
                //console.log(`registrarPaso5: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '6') {
                let contentBody = await registrarPaso6(event.data,context)
                ////console.log(`registrarPaso6: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '7') {
                let contentBody = await registrarPaso7(event.data,context)
                ////console.log(`registrarPaso7: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '8') {
                let contentBody = await registrarPaso8(event.data,context)
                ////console.log(`registrarPaso8: ${JSON.stringify(contentBody)}`)
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
            }


        } else if (action === 'getPaso') {
            if (event.params.path.paso === '4') {
                let contentBody = await paso4Get(event)
                //console.log(`getPaso4: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '5') {
                let contentBody = await paso5Get(event)
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
            }
        }

    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }

  

    
};