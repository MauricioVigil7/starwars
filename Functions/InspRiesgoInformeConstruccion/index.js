
const { ResourceGroupsTaggingAPI } = require("aws-sdk");
const AWS = require("aws-sdk")
const database = require('./database')

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });


/**
 * Función que realiza la operación POST del paso4
 * @param {JSON} data Data que proviene del request
 */
const registrarPaso4 = async (data) => {
    try {
        let insert = await database.insertInspeccion(data)
        console.info("Insert Paso4: " + JSON.stringify(insert))

        let insertDet = ''
        if (data.riesgosNaturales || data.riesgosTerreno || data.exposicionSituacionEntorno || data.incendio || data.perdidaBeneficio || data.resposabilidadCivil) {
            insertDet = await database.insertRiesgo(data, false)
            console.info("Inser Det Paso 4: " + JSON.stringify(insertDet))
        }

        return {
            exito: true,
            mensaje: 'insercion registros'
        }


    } catch (e) {
        console.error("Error registrarPaso4: " + e)
        throw new Error(e)
    }
}

/**
 * Función para actualizar la información de inspección y riesgos asociados
 * @param {JSON} data Data que proviene del request
 * @returns 
 */
const updatePaso4 = async (data) => {
    try {

        let insert = await database.insertInspeccion(data)
        console.info("Update Paso4: " + JSON.stringify(insert))

        if (data.riesgosNaturales || data.riesgosTerreno || data.exposicionSituacionEntorno || data.incendio || data.perdidaBeneficio || data.resposabilidadCivil) {
            let insertDet = await database.insertRiesgo(data, true)
            console.info("Update Det Paso 4: " + JSON.stringify(insertDet))
        }

        return {
            exito: true,
            mensaje: 'update registros'
        }

    } catch (e) {
        console.error("Error updatePaso4: " + e)
        throw new Error(e)
    }
}

/**
 * Función para obtener los datos de la inspección en el paso 4
 * @param {JSON} data Data que proviene del request
 * @returns 
 */
const getPaso4 = async (data) => {
    try {
        let rpta = {}

        //obtener los registros de la tabla maestra
        let paso4 = await database.getInspeccion(data.path)
        console.log(JSON.stringify(paso4))

        rpta.exito = true
        rpta.mensaje = 'lectura de la info'

        let element = paso4.Item

        //paso4.Item.forEach(element => {
        //for (const element of paso4.Item) {

        console.info(`Inspeccion: ${JSON.stringify(element)}`)

        let dataInsp = {}

        dataInsp.email = element.correo_insp
        dataInsp.claveTramite = element.num_tramite

        if (element.cod_tipinforme) {
            dataInsp.codTipoTramite = element.cod_tipinforme
        }

        if (element.fec_actualizacion) {
            dataInsp.fechaRegistro = element.fec_actualizacion
        }

        //obtener los registros de la tabla detalle
        let detalles = await database.getRiesgo(element.num_tramite)
        console.log('detalles: ' + JSON.stringify(detalles))

        dataInsp.riesgos = []

        let dataInspReg = {}

        detalles.Items.forEach(det => {

            dataInspReg.analisisRiesgo = {}
            dataInspReg.analisisRiesgo.codRiesgo = det.num_riesgo

            dataInspReg.analisisRiesgo.riesgosNaturales = {}

            if (det.des_terremoto) {
                dataInspReg.analisisRiesgo.riesgosNaturales.descTerremoto = det.des_terremoto
            }

            if (det.des_inundacion) {
                dataInspReg.analisisRiesgo.riesgosNaturales.descInundacion = det.des_inundacion
            }

            if (det.des_lluvia) {
                dataInspReg.analisisRiesgo.riesgosNaturales.descLluvia = det.des_lluvia
            }

            if (det.des_maremoto) {
                dataInspReg.analisisRiesgo.riesgosNaturales.descMaremoto = det.des_maremoto
            }

            dataInspReg.analisisRiesgo.riesgosTerreno = {}

            if (det.des_geologico) {
                dataInspReg.analisisRiesgo.riesgosTerreno.descGeologicos = det.des_geologico
            }

            if (det.des_geotecnic) {
                dataInspReg.analisisRiesgo.riesgosTerreno.descGeotecnicos = det.des_geotecnic
            }

            dataInspReg.analisisRiesgo.exposicionSituacionEntorno = {}

            if (det.des_exposic) {
                dataInspReg.analisisRiesgo.exposicionSituacionEntorno.descExposicion = det.des_exposic
            }

            dataInspReg.analisisRiesgo.incendio = {}

            if (det.des_incendio) {
                dataInspReg.analisisRiesgo.incendio.descIncendio = det.des_incendio
            }

            dataInspReg.analisisRiesgo.perdidaBeneficio = {}

            if (det.des_perd_ben) {
                dataInspReg.analisisRiesgo.perdidaBeneficio.descBeneficio = det.des_perd_ben
            }

            dataInspReg.analisisRiesgo.resposabilidadCivil = {}

            if (det.des_resp_civil) {
                dataInspReg.analisisRiesgo.resposabilidadCivil.descRespCivil = det.des_resp_civil
            }

            dataInsp.riesgos.push(dataInspReg)
        })

        //} // fin for
        rpta.data = dataInsp

        return rpta

    } catch (e) {
        console.error("Error getPaso4: " + e)
        throw new Error(e)
    }
}

const registrarPaso5 = async (data) => {
    try {

        //obtener la data de la inspeccion
        let inspeccion = await database.insertInspeccion(data)
        console.log(`Insert inspeccion: ${inspeccion}`)

        //insertar Siniestros
        for (const siniestro of data.listaSiniestro) {
            let sinies = await database.insertSiniestro(siniestro, data.claveTramite, false)
            console.log(`Siniestro insertado: ${JSON.stringify(sinies)}`)
        }

        //insertar Archivos
        for (const archivo of data.listArchivo) {
            let arch = await database.insertArchivo(archivo, data.claveTramite, false)
            console.log(`Archivos insertados: ${JSON.stringify(arch)}`)
        }

        //insertar Enlaces
        for (const enlace of data.listEnlace) {
            let enla = await database.insertEnlace(enlace, data.claveTramite, false)
            console.log(`Enlace insertado: ${JSON.stringify(enla)}`)
        }

        return {
            exito: true,
            mensaje: 'insercion registros'
        }


    } catch (e) {
        console.error(`registrarPaso5: ${JSON.stringify(e)}`)
        throw new Error(e)
    }
}

const updatePaso5 = async (data) => {
    try {
        let insert = database.insertInspeccion(data)
        console.log(`insert inspeccion: ${JSON.stringify(insert)}`)

        //update Siniestros
        for (const siniestro of data.listaSiniestro) {
            let sinies = await database.insertSiniestro(siniestro, data.claveTramite, true)
            console.log(`Siniestro update: ${JSON.stringify(sinies)}`)
        }

        //update Archivos
        for (const archivo of data.listArchivo) {
            let arch = await database.insertArchivo(archivo, data.claveTramite, true)
            console.log(`Archivos update: ${JSON.stringify(arch)}`)
        }

        //update Enlaces
        for (const enlace of data.listEnlace) {
            let enla = await database.insertEnlace(enlace, data.claveTramite, true)
            console.log(`Enlace update: ${JSON.stringify(enla)}`)
        }

        return {
            exito: true,
            mensaje: 'update registros'
        }


    } catch (e) {
        console.error("Error updatePaso5: " + e)
        throw new Error(e)
    }
}

const getPaso5 = async (data) => {
    try {

        let rpta = {}

        //obtener los registros de la tabla maestra
        let paso5 = await database.getInspeccion(data.path)
        console.log(JSON.stringify(paso5))

        rpta.exito = true
        rpta.mensaje = 'lectura de la info'

        let element = paso5.Item
        console.info(`Inspeccion: ${JSON.stringify(element)}`)

        let dataInsp = {}

        dataInsp.email = element.correo_insp
        dataInsp.claveTramite = element.num_tramite

        if (element.cod_tipinforme) {
            dataInsp.codTipoTramite = element.cod_tipinforme
        }

        if (element.fec_actualizacion) {
            dataInsp.fechaRegistro = element.fec_actualizacion
        }

        //Lista de Siniestros

        dataInsp.listsSiniestro = []

        let lstSiniestros = await database.getSiniestro(element.num_tramite)

        for (const sin of lstSiniestros.Items) {
            let siniestro = {}
            siniestro.codSiniestro = sin.num_siniestro
            siniestro.fechaSiniestro = sin.fec_siniestro
            siniestro.descripcion = sin.des_siniestro
            siniestro.tiempoParalizacion = sin.des_tie_paral

            dataInsp.listsSiniestro.push(siniestro)
        }

        //Lista Archivos

        dataInsp.listArchivo = []

        let lstArchivos = await database.getArchivo(element.num_tramite)

        for (const arch of lstArchivos.Items) {
            let archivo = {}
            archivo.codArchivo = arch.num_archivo
            archivo.tipoArchivo = arch.tipo_archivo
            archivo.nomArchivo = arch.nom_archivo

            dataInsp.listArchivo.push(archivo)
        }

        //Lista Enlaces
        dataInsp.listEnlace = []

        let lstEnlaces = await database.getEnlace(element.num_tramite)

        for (const enl of lstEnlaces.Items) {
            let enlace = {}
            enlace.codEnlace = enl.cod_enlace
            enlace.nomEnlace = enl.des_enlace

            dataInsp.listEnlace.push(enlace)
        }


        rpta.data = dataInsp

        return rpta


    } catch (e) {
        console.error("Error getPaso5: " + e)
        throw new Error(e)
    }
}

exports.handler = async (event, context, cb) => {
    console.log(event)
    let action = event.action


    try {
        if (action === 'insertPaso') {

            if (event.params.path.paso === '4') {
                let contentBody = await registrarPaso4(event.data)
                console.log(`registrarPaso4: ${JSON.stringify(contentBody)}`)
                cb(null, contentBody)
            } else if (event.params.path.paso === '5') {
                let contentBody = await registrarPaso5(event.data)
                console.log(`registrarPaso5: ${JSON.stringify(contentBody)}`)
                cb(null, contentBody)
            }


        } else if (action === 'updatePaso') {
            if (event.params.path.paso === '4') {
                let contentBody = await updatePaso4(event.data)
                console.log(`updatePaso4: ${JSON.stringify(contentBody)}`)
                cb(null, contentBody)
            } else if (event.params.path.paso === '5') {
                let contentBody = await updatePaso5(event.data)
                console.log(`updatePaso5: ${JSON.stringify(contentBody)}`)
                cb(null, contentBody)
            }


        } else if (action === 'getPaso') {
            if (event.data.path.paso === '4') {
                let contentBody = await getPaso4(event.data)
                console.log(`getPaso4: ${JSON.stringify(contentBody)}`)
                cb(null, contentBody)
            } else if (event.data.path.paso === '5') {
                let contentBody = await getPaso5(event.data)
                console.log(`getPaso5: ${JSON.stringify(contentBody)}`)
                cb(null, contentBody)
            }
        }

    } catch (e) {
        console.error(`Error: ${JSON.stringify(e)}`)
        cb(null, e)
    }
}

