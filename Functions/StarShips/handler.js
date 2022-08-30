
const StarWarsController = require('./src/controller/StarWarsController');

var error500 =  {
        statusCode: 500,
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


async function procesarIns(event,context) {
    try {
        
         event.data.id=context.awsRequestId;
         console.info(" procesarIns handler: " , event.data); 
        var resultado = await StarWarsController.procesarIns(event.data);
           
        return resultado;   
    } catch (e) {
        return error500;
    }   
}




async function procesarGet(event) {
    try {
      
        console.info(" procesarGet handler: " , event); 
        event.data.id = event.params.path.id;
        event.data.nombre = event.params.path.nombre;
        event.data.modelo = event.params.path.modelo;
        console.info(" procesarGet handler: " , event); 
        var resultado =  StarWarsController.procesarGet(event.data);   
        return resultado;   
    } catch (e) {
        return error500;
    }   
}



module.exports.procesar = async (event, context) => {
    //console.error('event.data 1',event.data);
    let action = event.action;
    console.error('****** event *****',event);
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
    

    try {
        var rpta = error500;
        if (action === 'insertPaso') {   
                rpta = await procesarIns(event,context);                 
        } else if (action === 'getPaso') {
                rpta = await procesarGet(event)
        }    
            return rpta;
        
    
    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }

  

    
};
