const inspeccionController = require('./src/controller/InspeccionController');

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

async function requestList(email, passwordProcedure) {
    try {
        return await inspeccionController.listar(email, passwordProcedure);
    } catch (e) {
        console.error(e);
        return error500;
    }   
}
module.exports.listar = async (event, context) => {
    const path = event.params.path;
    console.log('**** parametro1 :' + path.clave);
    console.log('**** parametro2 :' + path.correo);
    try {
        let contentBody = await requestList(path.correo, path.clave)
        console.log(`requestList: ${JSON.stringify(contentBody)}`)
        return contentBody;
    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }
};