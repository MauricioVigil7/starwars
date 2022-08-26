
const AWS = require("aws-sdk")
const REGION = process.env.REGION
AWS.config.update({ region: REGION })

const DynamoDB = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const Mustache = require('mustache')

var TABLE_INSPECCION = process.env.TABLE_INSPECCION
var BUCKET_TEMPLATE = process.env.BUCKET_TEMPLATE
var KEY_TEMPLATE = process.env.KEY_TEMPLATE


/**
 * Función que obtiene los datos del trámite
 * @param {String} num_tramite Código del tramite
 * @returns 
 */
const getDataTramite = async (num_tramite) => {
    let params = {
        TableName: TABLE_INSPECCION,
        Key: {
            num_tramite: num_tramite
        }
    }
   
    try{
        let data = await DynamoDB.get(params).promise()
        console.info(`Data tramite: ${JSON.stringify(data)}`)
        return data.Item
    } catch (e) {
        console.error(`Error leer Dynamodb: ${JSON.stringify(e)}`)
        throw new Error(e)
    }

}

/**
 * Función para obtener el contenido de la plantilla
 * @param {String} bucket Nombre del bucket
 * @param {String} key Ruta de la plantilla dentro del bucket
 * @returns 
 */
const getContentTemplate = async (bucket, key) => {
    let params = {
        Bucket: bucket,
        Key: key
    }

    try {
        let content = await s3.getObject(params).promise()
        console.info(`Content: ${JSON.stringify(content.Body.toString())}`)
        return content.Body.toString()
    } catch (e) {
        console.error(`Error getContentTemplate: ${JSON.stringify(e)}`)
        throw new Error(e)
    }

}

/**
 * Función que renderiza el contenido del email con la data de la BD
 * @param {String} num_tramite Código del Trámite
 * @returns 
 */
const renderEmail = async (num_tramite) => {    
    try{
        let data = await getDataTramite(num_tramite)
        let content = await getContentTemplate(BUCKET_TEMPLATE, KEY_TEMPLATE)
        let output = Mustache.render(content, data)
        console.info(`Render: ${JSON.stringify(output)}`)
        return {
            num_tramite,
            output
        }
    }catch (e) {
        console.error(`Error renderEmail: ${JSON.stringify(e)}`)
        throw new Error(e)
    }
}


exports.handler = function async (event, context, cb) {
    console.debug(JSON.stringify(event))

    var num_tramite = event.num_tramite

    return renderEmail(num_tramite)
}