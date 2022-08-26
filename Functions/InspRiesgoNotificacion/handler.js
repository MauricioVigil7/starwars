const controller = require('./src/controller/NotificacionController');
 
var error500 =  {
    statusCode: 500,
    body: {
        exito: false,
        mensaje: 'Acceso no permitido',
        data: [],
        errores: [
            {
                codigo: -2,
                mensaje: 'Recurso/acceso no disponible',
            }
        ]
    }
}

async function requestOperation(data) {
    try {
        return await controller.enviar(JSON.stringify(data));
    } catch (e) {
        console.error(e);
        return error500;
    }   
}

module.exports.excecute = async (event, context,callback) => {
    console.log('**** event :', event);
    //console.log('**** param data :', JSON.stringify(event.data));
    try {
        let contentBody = await requestOperation(event.data);
        console.log(`requestList: ${JSON.stringify(contentBody)}`);
        return contentBody;
    } catch (error) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }
};
