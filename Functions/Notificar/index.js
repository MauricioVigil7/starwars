const AWS = require("aws-sdk")
const REGION = process.env.REGION
AWS.config.update({ region: REGION })

const DynamoDB = new AWS.DynamoDB.DocumentClient()
const ses = new AWS.SES()

const TABLA_NOTIFICACION = process.env.TABLA_NOTIFICACION
const TABLA_INSPECCION = process.env.TABLA_INSPECCION
const ADMINISTRATOR = process.env.ADMINISTRATOR

/**
 * Función que actualiza el estado del trámite según el resultado de la ejecución
 * @param {String} num_tramite Código del trámite
 * @param {String} exito estado de la notificación
 * @returns 
 */
const updateStateInspeccion = async (num_tramite, exito) => {

    var estado = 0

    if (exito) {
        estado = 2
    } else {
        estado = 3
    }

    let params = {
        TableName: TABLA_INSPECCION,
        Key: {
            num_tramite: num_tramite
        },
        UpdateExpression: "set cod_estado = :estado",
        ExpressionAttributeValues: {
            ":estado": estado
        },
        ReturnValues: "UPDATED_NEW"
    }

    try {
        return DynamoDB.update(params).promise()
    } catch (error) {
        console.error(`Error updateStateTramite: ${JSON.stringify(error)}`)
        throw new Error(error)
    }

}

const controlNotificacion = async (num_tramite, exito) => {
    var estado = 0

    if (exito) {
        estado = 2
    } else {
        estado = 3
    }

    let paramsQuery = {
        TableName: TABLA_NOTIFICACION,
        KeyConditionExpression: "#num_tramite = :yyyy",
        ExpressionAttributeNames: {
            "#num_tramite": "num_tramite"
        },
        ExpressionAttributeValues: {
            ":yyyy": num_tramite
        }
    }

    let result = await DynamoDB.query(paramsQuery).promise()
    console.debug(`Cantidad Registros Notificación: ${JSON.stringify(result)}`)

    let cant = result.Items.length

    let paramInsert = {
        TableName: TABLA_NOTIFICACION,
        Item: {
            num_tramite: num_tramite,
            numero_reintentos: cant + 1,
            Motivo: 1,
            estado_notificacion: estado
        },
    }

    return DynamoDB.put(paramInsert).promise()
}

/**
 * Función que permite enviar un email en el caso de errores
 * @param {String} mensaje Cuerpo del mensaje
 * @returns 
 */
const sendEmail = async (mensaje) => {
    var params = {
        Destination: {

            ToAddresses: [
                ADMINISTRATOR,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "HTML_FORMAT_BODY"
                },
                Text: {
                    Charset: "UTF-8",
                    Data: JSON.stringify(mensaje)
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Error Servicio'
            }
        },
        Source: 'raul.talledo@gmail.com',
    }

    return ses.sendEmail(params).promise()
}

exports.handler = async (event, context, cb) => {
    console.debug(event)

    var num_tramite = event.num_tramite
    var exito = event.exito
    var funcion = event.function
    var error = ""

    try {

        if (funcion === 'RegistroSolicitud') {
            let result = await controlNotificacion(num_tramite, exito)
            console.info(`Resultado Control Notificacion: ${JSON.stringify(result)}`)
        } else {
            let resultUpdate = await updateStateInspeccion(num_tramite, exito)
            console.info(`Resultado update inspeccion: ${JSON.stringify(resultUpdate)}`)
        }

        if (!exito) {
            error = event.error

            //llamar al ses
            let send = await sendEmail(error)
            console.info(`Envio email: ${JSON.stringify(send)}`)
        }

        return "OK"

    } catch (err) {
        console.error(`Error Notificar: ${JSON.stringify(err)}`)
        throw new Error(err)
    }




}
