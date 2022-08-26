const dynamoDbClient = require('../db/config');

const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const DATAPARAMETRO_TABLE = process.env.DATAPARAMETRO_TABLE;
const IND_REG_ACTUAL = process.env.IND_REG_ACTUAL;
const GRUPO_ESTADO = process.env.GRUPO_ESTADO;
const COD_POR_INSPECCIONAR = process.env.COD_POR_INSPECCIONAR;


async function listar(correoInspector,claveTramite) {    
    if (correoInspector == undefined){
        return {result: false,errores:{codigo:'2',mensaje:'parametros no reconocidos'}};
    }
    var correo_insp=correoInspector;
    var num_tramite=claveTramite;
    var lista = await getListaResult(correo_insp,num_tramite);
    if(claveTramite == '0'){
        lista = await getListaResult(correo_insp);
    }
    return lista;
}

async function getListaResult(correo, tramite = undefined) {
    var params = await setParam(correo);
    const {Items} = await dynamoDbClient.query(params).promise();
    if (Items.length > 0) {
        var data = await setDataToReturn(JSON.stringify(Items));
        var y,cod_estado;
        for (y of data) {
            delete y.num_piso;
            delete y.mto_edificacion;
            delete y.nom_inspector;
            delete y.mto_existencia;
            cod_estado = y.codEstadoTramite;
            delete y.num_latitud;
            delete y.colindantes;
            delete y.correo_insp;
            delete y.mto_maquinaria;
            delete y.descripcion;
            delete y.cod_estructura;
            delete y.riosQuebradas;
            delete y.cod_uso;
            delete y.mto_lucro;
            delete y.actividad_local;
            delete y.mto_total;
            delete y.num_sotano;
            delete y.fec_modif;
            delete y.num_longitud;
            delete y.num_tramite;
            var dataparametro= await getDataParam(cod_estado);
            if(dataparametro.result){
                for (var x of dataparametro.data) {
                    y.nombreEstadoTramite = x.nombreEstadoTramite;
                }
            }
            if (y.fechaSolicitud != null &&  y.fechaSolicitud != "" &&  y.fechaSolicitud != undefined){
                var fecha = y.fechaSolicitud.split(' ');
                y.fechaSolicitud = fecha [0];
            } 
        }
        return {result: true, data: data};
    } else {
        return {result: false, errores:{codigo:'3',mensaje:'consulta sin resultado'}};
    }
} 

async function setParam(correo, tramite = undefined) {
    let attribute = {
        ':correo_insp' :correo,
        ':cod_estado' :COD_POR_INSPECCIONAR
    };
    let condition = 'correo_insp =:correo_insp';
    if(tramite!=undefined) {
        attribute = {
            ':correo_insp' :correo_insp,
            ':num_tramite' :num_tramite,
            ':cod_estado' :COD_POR_INSPECCIONAR
        };
        condition = 'correo_insp =:correo_insp and num_tramite =:num_tramite';
    }
    return {
        TableName: INSPECCIONES_TABLE,
        ExpressionAttributeValues: attribute,
        FilterExpression: 'cod_estado = :cod_estado',
        KeyConditionExpression: condition
    };
}

async function setDataToReturn(data = undefined) {
    if(data!=undefined) {
        data = await replaceAll(data, 'num_tramite','claveTramite') ;
        data = await replaceAll(data, 'cod_estado','codEstadoTramite');
        data = await replaceAll(data, 'nom_razsocial','nombreCliente');
        data = await replaceAll(data, 'cod_inspector','codInspector');
        data = await replaceAll(data, 'fec_solicitud','fechaSolicitud');
        data = await replaceAll(data, 'fec_actualizacion','fechaActualizacion');
        data = await replaceAll(data, 'fec_inspeccion','fechaInspeccion');
        data = await replaceAll(data, 'hor_inspeccion','horaInspeccion');
        data = await replaceAll(data, 'fec_ven_insp','fechaVencimiento');
        data = await replaceAll(data, 'des_direccion','direccion');
        data = await replaceAll(data, 'cod_tipinforme','nombreEstadoTramite');
        return JSON.parse(data);
    }
    return null;
}

async function getDataParam(code) {
    let   params = {
        TableName: DATAPARAMETRO_TABLE,
        ExpressionAttributeValues: {
            ':cod_catalogo': GRUPO_ESTADO,
            ':cod_datacat':  COD_POR_INSPECCIONAR,
            ':ind_regactual':IND_REG_ACTUAL
        },
        FilterExpression: 'ind_regactual = :ind_regactual',
        KeyConditionExpression: 'cod_catalogo =:cod_catalogo and cod_datacat = :cod_datacat'
    };
    const {Items} = await dynamoDbClient.query(params).promise();
    if (Items.length > 0) {
        var stringify =JSON.stringify(Items);
        stringify = await replaceAll(stringify, 'des_datacat','nombreEstadoTramite') ;
        var datos  = JSON.parse(stringify); 
        return {result: true,data:datos};
    }
    return {result: false,errores:{codigo:'2',mensaje: 'Estado inspeccion no encontrado'}};
}

async function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

module.exports = {
    listar,replaceAll,getDataParam
}