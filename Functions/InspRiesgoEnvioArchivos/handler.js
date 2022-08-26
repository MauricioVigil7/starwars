const controller = require('./src/controller/ArchivosController');
const utils = require('./src/utils/utils');

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

async function putObject(params, context) {
    try {
        params = JSON.parse(params);
        params.codArchivo = context.awsRequestId;
        return await controller.cargar(params);
    } catch (e) {
        console.error(e);
        return error500;
    }   
}

async function getObject(params, parse = true) {
    try {
        if(parse) {
            params = JSON.parse(params);
        }
        return await controller.obtener(params);
    } catch (e) {
        console.error(e);
        return error500;
    }   
}

async function deleteObject(params) {
    try {
        params = JSON.parse(params);
        return await controller.eliminar(params);
    } catch (e) {
        console.error(e);
        return error500;
    }   
}

module.exports.archivos = async (event, context) => {
    try {
        if (event.action == 'cargar') {
            return await putObject(utils.base64decode(event.data, true), context);
        }
        if (event.action == 'obtener') {
             if(event.data == undefined){
                return await getObject(event, false);
             }
            return await getObject(utils.base64decode(event.data));
        }
        if (event.action == 'eliminar') {
            return await deleteObject(utils.base64decode(event.data));
        }
    } catch (error) {
        console.error(`Error: ${JSON.stringify(error)}`)
        return error500;
    }
};
