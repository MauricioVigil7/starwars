const ddb = require('../db/config');

const INSPECCION_TABLE = process.env.INSPECCION_TABLE
const RIESGO_TABLE = process.env.RIESGO_TABLE
const SINIESTRO_TABLE = process.env.SINIESTRO_TABLE
const ENTREVISTADO_TABLE = process.env.ENTREVISTADO_TABLE
const EDIFICACION_TABLE = process.env.EDIFICACION_TABLE
const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE
const ACTIVIDAD_TABLE = process.env.ACTIVIDAD_TABLE
const ALMACENAMIENTO_TABLE = process.env.ALMACENAMIENTO_TABLE
const INCENDIO_TABLE = process.env.INCENDIO_TABLE
const RAMOS_TABLE = process.env.RAMOS_TABLE
const ROBO_TABLE = process.env.ROBO_TABLE
const PERDIDA_TABLE = process.env.PERDIDA_TABLE

/**
 * Función para obtener la data de la Inspeccion
 * @param {Object} data 
 * @returns 
 */
const getInspeccion = (data) => {
    console.debug(`getInspeccion: ${JSON.stringify(data)}`)
    let params = {
        TableName: INSPECCION_TABLE,
        Key: {
            correo_insp: data.email,
            num_tramite: data.claveTramite
        }
    }
    return ddb.get(params).promise()
}

const getParametro = (data) => {
    //NOIMP
}

/**
 * Obtener objetos por la clave de partición
 * @param {String} num_tramite Clave de partición codigo trámite
 * @param {String} TABLE Tabla dónde realizar la consulta
 * @returns 
 */
const getObjectIndex = (num_tramite, TABLE) => {
    console.debug(`getObject Table ${TABLE} con codigo: ${num_tramite}`)

    let params = {
        TableName: TABLE,
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
 * Función para obtener los datos del Riesgo
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getRiesgo = async (num_tramite) => {
    return getObjectIndex(num_tramite, RIESGO_TABLE)
}

/**
 * Función para obtener los datos del Siniestro
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getSiniestro = async (num_tramite) => {
    return getObjectIndex(num_tramite, SINIESTRO_TABLE)
}

/**
 * Función para obtener los datos del Entrevistado
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getEntrevistado = async (num_tramite) => {
    return getObjectIndex(num_tramite, ENTREVISTADO_TABLE)
}

/**
 * Función para obtener los datos de la Edificación
 * @param {String} num_tramite código del trámite 
 * @returns 
 */
const getEdificacion = async (num_tramite) => {
    return getObjectIndex(num_tramite, EDIFICACION_TABLE)
}

/**
 * Función para obtener los datos del Archivo
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getArchivo = async (num_tramite) => {
    return getObjectIndex(num_tramite, ARCHIVO_TABLE)
}

/**
 * Función para obtener los datos de la Actividad
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getActividad = async (num_tramite) => {
    return getObjectIndex(num_tramite, ACTIVIDAD_TABLE)
}

/**
 * Función para obtener los datos del Almacenamiento
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getAlmacenamiento = async (num_tramite) => {
    return getObjectIndex(num_tramite, ALMACENAMIENTO_TABLE)
}

/**
 * Función para obtener los datos del Incendio
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getIncendio = async (num_tramite) => {
    return getObjectIndex(num_tramite, INCENDIO_TABLE)
}

/**
 * Función para obtener los datos del Ramos
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getRamos = async (num_tramite) => {
    return getObjectIndex(num_tramite, RAMOS_TABLE)
}

/**
 * Función para obtener los datos del Robo
 * @param {String} num_tramite código del trámite
 * @returns 
 */
const getRobo = async (num_tramite) => {
    return getObjectIndex(num_tramite, ROBO_TABLE)
}

const getPerdida = async (num_tramite) => {
    return getObjectIndex(num_tramite, PERDIDA_TABLE)
}

module.exports = {
    getInspeccion: getInspeccion,
    getRiesgo: getRiesgo,
    getSiniestro: getSiniestro,
    getEntrevistado: getEntrevistado,
    getEdificacion: getEdificacion,
    getArchivo: getArchivo,
    getActividad: getActividad,
    getAlmacenamiento: getAlmacenamiento,
    getIncendio: getIncendio,
    getRamos: getRamos,
    getRobo: getRobo,
    getPerdida: getPerdida
}