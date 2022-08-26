const AWS = require("aws-sdk");
const repository = require('../repository/ArchivosRepository');
const utils = require('../utils/utils');
const s3bucket = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME;

async function cargar(params) {
    try {
        const archivoSrc = utils.base64decode(params.archivo);
        let pesoArchivo = archivoSrc.length;
        const paramsS3 = {
            Bucket: BUCKET_NAME,
            Key: `${params.codArchivo}.${params.extensionArchivo}`,
            Body: archivoSrc
        };
        await s3bucket.putObject(paramsS3).promise();
        const insertParams = {
            codTramite: params.codTramite,
            codArchivo: params.codArchivo,
            nombreArchivo: params.nombreArchivo,
            pesoArchivo,
            extensionArchivo: params.extensionArchivo
        };
        const insertArchivo = await repository.insertar(insertParams);
        if (insertArchivo.result) {
            var stringify =JSON.stringify(insertArchivo.data);
            stringify = replaceAll(stringify, 'num_archivo','codArchivo') ;
            stringify = replaceAll(stringify, 'num_tramite','codTramite') ;
            stringify = replaceAll(stringify, 'nom_archivo','nombreArchivo') ;
            stringify = replaceAll(stringify, 'cnt_peso_archivo','pesoArchivo') ;
            stringify = replaceAll(stringify, 'fec_crea','fechaHoraCarga') ;
            stringify = replaceAll(stringify, 'des_mime_type','Extension') ;
            insertArchivo.data  = JSON.parse(stringify);
            return {result: true, data: insertArchivo.data};
        } else {
            return {result: false, data: insertArchivo.data}
        }
    } catch (e) {
        console.log(e)
        return {result: false, data: e}
    }
}

async function obtener(params) {
    try {
        const datosArchivo = await repository.obtener(params);
        if (datosArchivo.result) {
            var stringify =JSON.stringify(datosArchivo.data);
            stringify = replaceAll(stringify, 'num_archivo','codArchivo') ;
            stringify = replaceAll(stringify, 'num_tramite','codTramite') ;
            stringify = replaceAll(stringify, 'nom_archivo','nombreArchivo') ;
            stringify = replaceAll(stringify, 'cnt_peso_archivo','pesoArchivo') ;
            stringify = replaceAll(stringify, 'des_mime_type','Extension') ;
            stringify = replaceAll(stringify, 'fec_crea','fechaHoraCarga') ;
            datosArchivo.data  = JSON.parse(stringify);
            const paramsS3 = {
                Bucket: BUCKET_NAME,
                Key: `${datosArchivo.data.codArchivo}.${datosArchivo.data.Extension}`
            };
            const s3File = await s3bucket.getObject(paramsS3).promise();
            const response = {
                ...datosArchivo.data,
                archivo: utils.base64encode(ab2str(s3File.Body))
            };
            return {result: true, data: response};
        } else {
            return {result: false, data: datosArchivo.data}
        }
    } catch (e) {
        console.log(e)
        return {result: false, data: e}
    }
}

async function eliminar(params) {
    try {
        const datosArchivo = await repository.obtener(params);
        if (datosArchivo.result) {
            const eliminarDatos = await repository.eliminar(params);
            if (eliminarDatos.result) {
                const paramsS3 = {
                    Bucket: BUCKET_NAME,
                    Key: `${datosArchivo.data.num_archivo}.${datosArchivo.data.des_mime_type}`
                };
                await s3bucket.deleteObject(paramsS3).promise();
                return {result: true};
            } else {
                return {result: false, data: eliminarDatos.data}
            }
        } else {
            return {result: false, data: datosArchivo.data}
        }
    } catch (e) {
        console.log(e)
        return {result: false, data: e}
    }
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

module.exports = {
    cargar,
    obtener,
    eliminar
}