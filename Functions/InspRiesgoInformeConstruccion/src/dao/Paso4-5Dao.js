const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

//const { v4: uuidv4 } = require("uuid")    vRv4ASMeHSnnFGtPdz8j
 
const TABLE_INSPECCION = process.env.TABLE_INSPECCION
const TABLE_DETALLE = process.env.TABLE_DETALLE
const TABLE_SINIESTRO = process.env.TABLE_SINIESTRO
const TABLE_ARCHIVO = process.env.TABLE_ARCHIVO
const TABLE_ENLACE = process.env.TABLE_ENLACE

/**
 * Función que inserta la data en la tabla Inspeccion
 * @param {*} data Data que proviene desde el request
 * @returns 
 */
 async function  insertInspeccion (data)  {
    let params = {
        TableName: TABLE_INSPECCION,
        Item: {
            correo_insp: data.email,
            num_tramite: data.claveTramite
        }
    }

    if (data.codTipoTramite) {
        params.Item.cod_tipinforme = data.codTipoTramite
    }

    if (data.fechaRegistro) {
        params.Item.fec_actualizacion = data.fechaRegistro
    }

    return ddb.put(params).promise()
}

/**
 * Función que inserta la data en la tabla Riesgo
 * @param {JSON} data Data que proviene del request
 * @param {boolean} isUpdate Boolean que define si insertar o actualizar
 * @returns 
 */
 async function insertRiesgo  (data, isUpdate)  {

    let idRiesgo = null

    if (isUpdate) {
        idRiesgo = data.codRiesgo
    } else {
        idRiesgo = data.codRiesgo;//uuidv4()
    }

    let params = {
        TableName: TABLE_DETALLE,
        Item: {
            num_tramite: data.claveTramite,
            num_riesgo: idRiesgo,
        }
    }

    if (data.riesgosNaturales && data.riesgosNaturales.descTerremoto) {
        params.Item.des_terremoto = data.riesgosNaturales.descTerremoto
    }

    if (data.riesgosNaturales && data.riesgosNaturales.descInundacion) {
        params.Item.des_inundacion = data.riesgosNaturales.descInundacion
    }

    if (data.riesgosNaturales && data.riesgosNaturales.descLluvia) {
        params.Item.des_lluvia = data.riesgosNaturales.descLluvia
    }

    if (data.riesgosNaturales && data.riesgosNaturales.descMaremoto) {
        params.Item.des_maremoto = data.riesgosNaturales.descMaremoto
    }

    if (data.riesgosTerreno && data.riesgosTerreno.descGeologicos) {
        params.Item.des_geologico = data.riesgosTerreno.descGeologicos
    }

    if (data.riesgosTerreno && data.riesgosTerreno.descGeotecnicos) {
        params.Item.des_geotecnic = data.riesgosTerreno.descGeotecnicos
    }

    if (data.exposicionSituacionEntorno && data.exposicionSituacionEntorno.descExposicion) {
        params.Item.des_exposic = data.exposicionSituacionEntorno.descExposicion
    }

    if (data.incendio && data.incendio.descIncendio) {
        params.Item.des_incendio = data.incendio.descIncendio
    }

    if (data.perdidaBeneficio && data.perdidaBeneficio.descBeneficio) {
        params.Item.des_perd_ben = data.perdidaBeneficio.descBeneficio
    }

    if (data.resposabilidadCivil && data.resposabilidadCivil.descRespCivil) {
        params.Item.des_resp_civil = data.resposabilidadCivil.descRespCivil
    }

    console.log(`params detalle: ${JSON.stringify(params)}`)
    return ddb.put(params).promise()
}

/**
 * Función que busca una inspección
 * @param {JSON} data Data que proviene del request
 * @returns 
 */
 async function getInspeccion (data) {
    let params = {
        TableName: TABLE_INSPECCION,
        Key: {
            correo_insp: data.email,
            num_tramite: data.claveTramite
        }
    }
    return ddb.get(params).promise()
}

/**
 * Función que busca los riesgos asociados a un trámite
 * @param {string} num_tramite codigo del tramite
 * @returns 
 */
 async function getRiesgo (num_tramite) {
    let params = {
        TableName: TABLE_DETALLE,
        KeyConditionExpression: "#num_tramite = :num_tramite",
        ExpressionAttributeNames:{
            "#num_tramite": "num_tramite"
        },
        ExpressionAttributeValues: {
            ":num_tramite": num_tramite
        }
    }
    return ddb.query(params).promise()
}

/**
 * Función que inserta un Siniestro
 * @param {JSON} data Data del siniestro que proviene del request
 * @param {string} num_tramite Codigo del tramite
 * @param {boolean} isUpdate Flag para definir un insert o un update
 * @returns 
 */
 async function insertSiniestro (data, num_tramite, isUpdate)  {

    let numSiniestro = null

    if (isUpdate) {
        numSiniestro = data.codSiniestro
    } else {
        numSiniestro = data.codSiniestro;//uuidv4()
    }

    let params = {
        TableName: TABLE_SINIESTRO,
        Item: {
            num_tramite: num_tramite,
            num_siniestro: numSiniestro,
            fec_siniestro: data.fechaSiniestro,
            des_siniestro: data.descripcion,
            des_tie_paral: data.tiempoParalizacion
        }
    }

    return ddb.put(params).promise()
}

/**
 * Función que inserta un Archivo
 * @param {JSON} data Data del archivo
 * @param {string} num_tramite codigo del tramite
 * @returns 
 */
 async function insertArchivo (data, num_tramite, isUpdate) {
    
    let numArchivo = null

    if (isUpdate) {
        numArchivo = data.codArchivo
    } else {
        numArchivo = data.codArchivo;//uuidv4()
    }

    let params = {
        TableName: TABLE_ARCHIVO,
        Item: {
            num_tramite: num_tramite,
            num_archivo: numArchivo,
            cod_archivo: data.codArchivo,
            tip_archivo: data.tipoArchivo,
            nom_archivo: data.nomArchivo
        }
    }

    return ddb.put(params).promise()
}

/**
 * Función que insreta un Enlace 
 * @param {*} data 
 * @param {*} num_tramite 
 * @returns 
 */
 async function insertEnlace (data, num_tramite, isUpdate) {
    let numEnlace = null

    if (isUpdate) {
        numEnlace = data.codEnlace
    } else {
        numEnlace = data.codEnlace;//uuidv4()
    }

    let params = {
        TableName: TABLE_ENLACE,
        Item: {
            num_tramite: num_tramite,
            num_enlace: numEnlace,
            cod_enlace: data.codEnlace,
            des_enlace: data.nomEnlace,
        }
    }

    return ddb.put(params).promise()
}

async function getSiniestro (num_tramite) {
    let params = {
        TableName: TABLE_SINIESTRO,
        KeyConditionExpression: "#num_tramite = :num_tramite",
        ExpressionAttributeNames:{
            "#num_tramite": "num_tramite"
        },
        ExpressionAttributeValues: {
            ":num_tramite": num_tramite
        }
    }
    return ddb.query(params).promise()
}

async function getArchivo (num_tramite) {
    let params = {
        TableName: TABLE_ARCHIVO,
        KeyConditionExpression: "#num_tramite = :num_tramite",
        ExpressionAttributeNames:{
            "#num_tramite": "num_tramite"
        },
        ExpressionAttributeValues: {
            ":num_tramite": num_tramite
        }
    }
    return ddb.query(params).promise()
}

async function getEnlace (num_tramite) {
    let params = {
        TableName: TABLE_ENLACE,
        KeyConditionExpression: "#num_tramite = :num_tramite",
        ExpressionAttributeNames:{
            "#num_tramite": "num_tramite"
        },
        ExpressionAttributeValues: {
            ":num_tramite": num_tramite
        }
    }
    return ddb.query(params).promise()
}

module.exports = {
    insertInspeccion: insertInspeccion,
    insertRiesgo: insertRiesgo,
    getInspeccion: getInspeccion,
    getRiesgo: getRiesgo,
    insertSiniestro: insertSiniestro,
    insertArchivo: insertArchivo,
    insertEnlace: insertEnlace,
    getSiniestro: getSiniestro,
    getArchivo: getArchivo,
    getEnlace: getEnlace
}