const controller = require('./src/controller/ParametroController');

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

async function requestList(group, parameter) {
    try {
        return await controller.listar(group, parameter);
    } catch (e) {
        console.error(e);
        return error500;
    }   
}

async function requestAllList() {
    try {
        return await controller.listarTodo();
    } catch (e) {
        console.error(e);
        return error500;
    }   
}

module.exports.excecute = async (event, context) => {
    const path = event.params.path;
    //console.log('**** param group :' + path.grupo);
    //console.log('**** param parameter :' + path.parametro);
    try {
        if (event.action == 'listar') {
            let contentBody = await requestList(path.grupo, path.parametro);
            //console.log(`requestList: ${JSON.stringify(contentBody)}`);
            return contentBody;
        }
        if (event.action == 'listar-todo') {
            let contentBody = await requestAllList();
            //console.log(`requestList: ${JSON.stringify(contentBody)}`);
            return contentBody;
        }
    } catch (error) {
        console.error(`Error: ${JSON.stringify(e)}`)
        return error500;
    }
};
