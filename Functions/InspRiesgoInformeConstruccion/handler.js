
const informeConstruccionController = require('./src/controller/InformeConstruccionController');
//const middleware = require('./src/middleware/index');
var error500 =  {
    //statusCode: 500,
        exito: false,
        mensaje: 'Error',
        data: [],
        errores: [
            {
                codigo: -2,
                mensaje: 'Recurso/acceso no disponible',
            }
        ]
};


async function registrarPaso1(data) {
    try {
        //console.info(" registrarPaso: " , data);  
        var resultado = await informeConstruccionController.paso1Ins(data);
        //console.info("get Paso1: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso2(event,context) {
    try {
        //console.info(" registrarPaso2: " , event);  
        event.data.codEntrevistado=context.awsRequestId; 
        //console.info(" registrarPaso2: " , event); 
        var resultado = await informeConstruccionController.paso2Ins(event.data);
        //console.info("get Paso2: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function registrarPaso3(data) {
    try {
        //console.info(" registrarPaso3: " , data);  
        var resultado = await informeConstruccionController.paso3Ins(data);
        //console.info("get Paso3: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


async function registrarPaso4(event,context) {
    try {
        //console.info(" registrarPaso4: " , event); 
        event.data.codRiesgo=context.awsRequestId; 
        //console.info(" handler: " , event.data);
        var resultado = await informeConstruccionController.paso4Ins(event.data);
        //console.info("resultado Paso4: " ,resultado);      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


async function registrarPaso5(event,context) {
    try {
        //console.info(" registrarPaso4: " , event); 
        event.data.codSiniestro=context.awsRequestId; 
        //console.info(" handler: " , event.data);
        var resultado = await informeConstruccionController.paso5Ins(event.data);
        //console.info("resultado Paso4: " ,resultado);      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}
 

//**************** update **************

async function updatePaso1(data) {
    try {
        //console.info(" updatePaso1: " , data);  
        var resultado = await informeConstruccionController.paso1Upd(data);
        //console.info("updatePaso1: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function updatePaso2(data) {
    try {
        //console.info(" updatePaso2: " , data);  
        var resultado = await informeConstruccionController.paso2Upd(data);
        //console.info("updatePaso2: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function updatePaso3(data) {
    try {
        //console.info(" updatePaso3: " , data);  
        var resultado = await informeConstruccionController.paso3Upd(data);
        //console.info("updatePaso3: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function updatePaso4(data) {
    try {
        //console.info(" updatePaso4: " , data);  
        var resultado = await informeConstruccionController.paso4Upd(data);
        //console.info("updatePaso4: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function updatePaso5(data) {
    try {
        //console.info(" updatePaso5: " , data);  
        var resultado = await informeConstruccionController.paso5Upd(data);
        //console.info("updatePaso5: " ,resultado);      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


//***************** get **********


async function paso1Get(event) {
    try {
        //console.info("get ***** Paso1: " , data);  
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        //console.info("get Paso1: numtramite " , numtramite); 
        //console.info("get Paso1: email " , email); 
        var resultado = await informeConstruccionController.paso1Get(numtramite,email);
        //console.info("get Paso1: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso2Get(event) {
    try {
        //console.info("get Paso2: " , event);  
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        //console.info("get Paso2: numtramite " , numtramite); 
        //console.info("get Paso2: email " , email); 
        var resultado = await informeConstruccionController.paso2Get(numtramite,email);
        //console.info("get Paso2: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

async function paso3Get(event) {
    try {
        //console.info("get Paso3: " , event);  
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        var resultado = await informeConstruccionController.paso3Get(numtramite,email);
        //console.info("get Paso3: " + JSON.stringify(data.path));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}



async function paso4Get(event) {
    try {
        //console.info("get Paso4: " , event);  
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        //console.info("get Paso4:numtramite " , numtramite); 
        //console.info("get Paso4:email " , email); 
        var resultado = await informeConstruccionController.paso4Get(numtramite,email);
        //console.info("get Paso4: " ,resultado);      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


async function paso5Get(event) {
    try {
        //console.info(" paso5Get: " , event);  
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        //console.info("get Paso5:numtramite " , numtramite); 
        //console.info("get Paso5:email " , email); 
        var resultado = await informeConstruccionController.paso5Get(numtramite,email);
        //console.info("get Paso5: " ,resultado);      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

module.exports.informe = async (event, context) => {
    //console.error('event.data 1',event.data);
    let action = event.action;
    //console.error('****** action *****',action);
     var error500 = {
       
        exito: false,
        mensaje: 'Error',
        data: [],
        errores: [
            {
                codigo: -2,
                mensaje: 'Recurso/acceso no disponible',
            }
        ]
    };
    // console.log('**** AccessToken :', headers.AccessToken);
     //headers.accessToken=headers.AccessToken;
  
    // console.error('headers.fechaTransaccion',event.data.header.fechaTransaccion);
    // console.error('event.params.path.paso',event.data.path.paso);
     //console.error('event.data',event.data);
    // console.error('event 2',event);
   /*  if (!headers.fechaTransaccion) {
        return error500;
    }*/

    try {
        //console.log('action:',action);
        //console.log('getPaso:',event.params.path.paso);
        if (action === 'insertPaso') {
            if (event.params.path.paso === '4') {
                let contentBody = await registrarPaso4(event,context);
                //console.log("registrarPaso4:",contentBody);
                return contentBody;
            } else if (event.params.path.paso === '5') {
                let contentBody = await registrarPaso5(event,context)
                //console.log(`registrarPaso5: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '1') {
                let contentBody = await registrarPaso1(event.data,context)
                //console.log(`registrarPaso1: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '2') {
                let contentBody = await registrarPaso2(event,context)
                //console.log(`registrarPaso2: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '3') {
                let contentBody = await registrarPaso3(event.data,context)
                //console.log(`registrarPaso3: ${JSON.stringify(contentBody)}`)
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
            } if (event.params.path.paso === '1') {
                //console.log('Paso1',event.params.path.paso);
                let contentBody = await updatePaso1(event.data)
                //console.log(`updatePaso1: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '2') {
                let contentBody = await updatePaso2(event.data)
                //console.log(`updatePaso2: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } if (event.params.path.paso === '3') {
                let contentBody = await updatePaso3(event.data)
                //console.log(`updatePaso3: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } 


        } else if (action === 'getPaso') {
            if (event.params.path.paso === '4') {
                let contentBody = await paso4Get(event)
                //console.log("getPaso4:",contentBody)
                return contentBody;
            } else if (event.params.path.paso === '5') {
                let contentBody = await paso5Get(event)
                //console.log(`getPaso5: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '1') {
                //console.log('getPaso1:',event.params.path.paso);
                let contentBody = await paso1Get(event)
                //console.log(`getPaso1: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '2') {
                let contentBody = await paso2Get(event)
                //console.log(`getPaso2: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } else if (event.params.path.paso === '3') {
                let contentBody = await paso3Get(event)
                //console.log(`getPaso3: ${JSON.stringify(contentBody)}`)
                return contentBody;
            } 
           
        
    }
    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }

  

    
};