const solicitudRepository = require('../repository/SolicitudRepository');

async function insertSolicitud(params) {
    const insertResult = await solicitudRepository.insertSolicitud(params);
    console.log(`Service InsertSolicitud: ${JSON.stringify(insertResult)}`)
    
    if (insertResult.result) {
        return {result: true};
    } else {
        return {result: false, data: insertResult.data};
    }
}

module.exports = {
    insertSolicitud
}