//const dbInit = require('./src/db/models');
const envioInformeController = require('./src/controller/RiesgoEnvioInformeController');
var error500 =  {
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


async function enviar(event) {
    try {
        event.email = event.correo;
        console.error('event.do',event.do); 
        var resultado = await envioInformeController.enviarInforme(event);
        //console.info("get Paso1: " + JSON.stringify(resultado));      
        return resultado;   
    } catch (e) {
        return error500;
    }   
}

module.exports.enviar = async (event, context,callback) => {
    // console.error('event 2',event);
   /*  if (!headers.fechaTransaccion) {
        return error500;
    }*/
    try {
                event.do = "obtener";
                let contentBody = await enviar(event);
                return contentBody;  
    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }
 
};