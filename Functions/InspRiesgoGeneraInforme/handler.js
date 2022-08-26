'use strict'

const informeController = require('./src/controller/informeController')

module.exports.generar = (event, context) => {
    console.debug(`Evento: ${JSON.stringify(event)}`)
    return informeController.generarInforme(event)
};
