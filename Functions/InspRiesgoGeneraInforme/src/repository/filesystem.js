const AWS = require('aws-sdk')
const REGION = process.env.REGION;
AWS.config.update({ region: REGION });

//const s3 = new AWS.S3()
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });


/**
 * Función para obtener el template
 * @param {Object} params 
 * @returns 
 */
const getObject = (params) => {

    if (!params.bucket) {
        throw new Error('No existe el Bucket')
    }

    if(!params.key) {
        throw new Error('No existe el nombre del Objeto')
    }

    let getParams = {
        Bucket: params.bucket,
        Key: params.key
    }
    return s3.getObject(getParams).promise()
}

/**
 * Función para guardar un Objecto
 * @param {Object} params 
 * @returns 
 */
const putObjet = (params) => {
    let putParams = {
        Bucket: params.bucket,
        Key: params.key,
        Body: params.file
    }
    return s3.putObject(putParams).promise()
}

module.exports = {
    getObject: getObject,
    putObjet: putObjet
}