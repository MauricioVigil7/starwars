'use strict';

const solicitudController = require('./src/controller/SolicitudController');

module.exports.solicitud = async (event, context) => {
    console.debug(`evento entrada: ${JSON.stringify(event)}`)

    let req = event.data
    console.log(`Data: ${JSON.stringify(req)}`)
    
    return solicitudController.insertSolicitud(req)

};
