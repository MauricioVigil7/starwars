const dynamoDbClient = require('../db/config');

const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const MENSAJEMAIL_TABLE = process.env.MENSAJEMAIL_TABLE;
const CORREOELECTRONICO_TABLE = process.env.CORREOELECTRONICO_TABLE;

async function getInspecciones(req) {
    const params = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.codTramite,
            correo_insp: req.para
        },
    };
    try {
        const { Item } = await dynamoDbClient.get(params).promise();
        if (Item) {
            const { num_tramite, nom_razsocial, des_direccion, fec_inspeccion, hor_inspeccion, cod_inspector } = Item;
            return {
                result: true, data: {
                    numtramite: num_tramite, nomrazsocial: nom_razsocial,
                    desdireccion: des_direccion, fecinspeccion: fec_inspeccion,
                    horinspeccion: hor_inspeccion, codinspector: cod_inspector
                }
            };
        } else {
            return { result: false, errores: { codigo: '1', mensaje: 'no se encontro data ' + INSPECCIONES_TABLE } };
        }
    } catch (error) {
        console.log(error);
        return { result: false, errores: { codigo: '-1', mensaje: 'Error:' + error } };
    }
}

async function getMensajeMail(req) {
    const params = {
        TableName: MENSAJEMAIL_TABLE,
        Key: {
            cod_mens: req.codmens,
            cod_tip_proceso: req.codtipoproceso
        },
    };
    try {
        const { Item } = await dynamoDbClient.get(params).promise();
        if (Item) {
            const { cod_mens, cod_tip_proceso, des_corta, des_larga, des_abrev, ind_asunto, des_cuerpo, ind_del, cod_usucrea,
                dir_ipusucrea, fec_crea, cod_usumodif, dir_ipusumodif } = Item;
            return {
                result: true, data: {
                    codmens: cod_mens, codtipoproceso: cod_tip_proceso, descorta: des_corta,
                    deslarga: des_larga, desabrev: des_abrev, indasunto: ind_asunto, descuerpo: des_cuerpo, inddel: ind_del,
                    codusucrea: cod_usucrea, dir_ipusucrea, feccrea: fec_crea, codusumodif: cod_usumodif, diripusumodif: dir_ipusumodif
                }
            };
        } else {
            return { result: false, errores: { codigo: '1', mensaje: 'no se encontro data ' + MENSAJEMAIL_TABLE } };
        }
    } catch (error) {
        console.log(error);
        return { result: false, errores: { codigo: '-1', mensaje: 'Error:' + error } };
    }
}

async function inserCorreoElectronico(req) {
    console.log('******3.2******:');
    const params = {
        TableName: CORREOELECTRONICO_TABLE,
        Item: {
            num_tramite: req.codTramite,
            correo_electr: req.correoelectr,
            ind_envio: req.indenvio,
            estado_correo: req.estadocorreo,
            fec_envio: req.fecenvio,
            ind_del: req.inddel,
            cod_usucrea: req.codusucrea,
            dir_ipusucrea: req.diripusucrea,
            fec_crea: req.feccrea
        },
    };

    try {
        await dynamoDbClient.put(params).promise();
        console.log('******3.3******:');
        return { result: true };
    } catch (error) {
        console.log('******3.4******:');
        console.log(error);
        return { result: false, errores: { codigo: '1', mensaje: 'no se encontro data ' + CORREOELECTRONICO_TABLE + ':' + error } };
    }
}

async function updateCorreoElectronico(req) {
    const params = {
        TableName: CORREOELECTRONICO_TABLE,
        Key: {
            num_tramite: req.codTramite,
            correo_electr: req.correoelectr
        },
        UpdateExpression: "SET estado_correo = :estadocorreo, fec_envio = :fec_envio, ind_del = :ind_del, cod_usumodif = :cod_usumodif, dir_ipusumodif = :dir_ipusumodif",
        ExpressionAttributeValues: {
            ":estadocorreo": req.estadocorreo,
            ":fec_envio": req.fecenvio,
            ":ind_del": req.inddel,
            ":cod_usumodif": req.codusumodif,
            ":dir_ipusumodif": req.diripusumodif
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const { Item } = await dynamoDbClient.update(params).promise();
        return { result: true, data: Item };
    } catch (error) {
        console.log(error);
        return { result: false, errores: { codigo: '1', mensaje: 'no se encontro data ' + CORREOELECTRONICO_TABLE } };
    }
}

module.exports = {
    getInspecciones,
    getMensajeMail,
    inserCorreoElectronico,
    updateCorreoElectronico
}