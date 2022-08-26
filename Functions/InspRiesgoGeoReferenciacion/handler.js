//const dbInit = require('./src/db/models');
const geoReferenciacionController = require('./src/controller/GeoReferenciacionController');
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


async function registrar(data) {
    try {
        console.info(" registrar: " , data);  
        var resultado = await geoReferenciacionController.insertInspecciones(data);
        console.info("get Paso1: " + JSON.stringify(resultado));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


//**************** update **************

async function updateGeo(data) {
    try {
        console.info(" updatePaso1: " , data);  
        var resultado = await geoReferenciacionController.updateInspecciones(data);
        console.info("updatePaso1: " + JSON.stringify(data));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

//***************** get **********

async function getInspecciones(event) {
    try {
        console.info("get ***** Paso1: " , event);  
        var numtramite = event.params.path.claveTramite;
        var email = event.params.path.email;
        event.claveTramite=numtramite;
        event.email=email;
        console.info("get Paso1: numtramite " , numtramite); 
        console.info("get Paso1: email " , email); 
        var resultado = await geoReferenciacionController.getInspecciones(event);
        console.info("get Paso1: " + JSON.stringify(resultado));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}


module.exports.informe = async (event, context,callback) => {

    console.error('event.data 1',event);
    let action = event.action;
    console.error('****** action *****',action);
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
 
     console.error('event 2',event);
   /*  if (!headers.fechaTransaccion) {
        return error500;
    }*/

    try {
        //////console.log('action:',action);
        if (action === 'registrar') {
                let contentBody = await registrar(event.data);
                //////console.log('contentBody:',contentBody);
                //////console.log(`registrar: ${JSON.stringify(contentBody)}`)

                if(contentBody.statusCode == 500) {
                    callback(new Error("INTERNAL_ERROR","INTERNAL Error..."));
                }
        
                if(contentBody.statusCode == 401) {
                     callback(new Error("UNAUTHORIZED","Unauthorized Error..."));
                 }
        
                if(contentBody.statusCode == 400) {
                    callback(new Error("BAD_REQUEST","BAD Request..."));
                }
        
                return contentBody;  

        } else if (action === 'actualizar') {         
                let contentBody = await updateGeo(event.data)
                //////console.log(`update: ${JSON.stringify(contentBody)}`)
                if(contentBody.statusCode == 500) {
                    callback(new Error("INTERNAL_ERROR","INTERNAL Error..."));
                }
        
                if(contentBody.statusCode == 401) {
                     callback(new Error("UNAUTHORIZED","Unauthorized Error..."));
                 }
        
                if(contentBody.statusCode == 400) {
                    callback(new Error("BAD_REQUEST","BAD Request..."));
                }
                return contentBody;
        } else if (action === 'listar') {          
                let contentBody = await getInspecciones(event)
                //////console.log(`getPaso: ${JSON.stringify(contentBody)}`)
                if(contentBody.statusCode == 500) {
                    callback(new Error("INTERNAL_ERROR","INTERNAL Error..."));
                }
        
                if(contentBody.statusCode == 401) {
                     callback(new Error("UNAUTHORIZED","Unauthorized Error..."));
                 }
        
                if(contentBody.statusCode == 400) {
                    callback(new Error("BAD_REQUEST","BAD Request..."));
                }
                return contentBody;     
        }
    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }
 
};