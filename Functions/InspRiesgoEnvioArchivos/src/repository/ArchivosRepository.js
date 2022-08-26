const dynamoDbClient = require('../db/config');

const DATOS_ARCHIVO_TABLE = process.env.DATOS_ARCHIVO_TABLE;

async function insertar(req) {
    const params = {
        TableName: DATOS_ARCHIVO_TABLE,
        Item: {
            num_tramite: req.codTramite,
            num_archivo: req.codArchivo,
            nom_archivo: req.nombreArchivo,
            cnt_peso_archivo: req.pesoArchivo,
            des_mime_type: req.extensionArchivo,
            fec_crea: (new Date()).toISOString()
        }
    };
    try {
        await dynamoDbClient.put(params).promise();
        return {result: true, data: params.Item};
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + DATOS_ARCHIVO_TABLE};
    }
}

async function obtener(req) {
    const params = {
        TableName: DATOS_ARCHIVO_TABLE,
         ExpressionAttributeValues: {
            ":num_tramite": req.codTramite,
            ":num_archivo": req.codArchivo,
            ":nom_archivo": req.nombreArchivo
        },
        FilterExpression: 'nom_archivo = :nom_archivo',
        KeyConditionExpression: 'num_tramite =:num_tramite and num_archivo=:num_archivo',
    };
    try {
        const {Items} = await dynamoDbClient.query(params).promise();
        if (Items.length > 0) {
            return {result: true, data: Items[0]};
        } else {
            return {result: false, data: 'Could not find file with provided "codTramite"'};
        }
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not retrieve from ' + DATOS_ARCHIVO_TABLE};
    }
}

async function eliminar(req) {
    const params = {
        TableName: DATOS_ARCHIVO_TABLE,
        Key: {
            "num_archivo": req.codArchivo,
            "num_tramite": req.codTramite,
        }
    };
    try {
        await dynamoDbClient.delete(params).promise();
        return {result: true};
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not delete from ' + DATOS_ARCHIVO_TABLE};
    }
}

module.exports = {
    insertar,
    obtener,
    eliminar
}