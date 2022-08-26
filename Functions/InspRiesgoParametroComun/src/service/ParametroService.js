const dynamoDbClient = require('../db/config');

const DATAPARAMETRO_TABLE = process.env.DATAPARAMETRO_TABLE;
const PARAMETRO_TABLE = process.env.PARAMETRO_TABLE;

async function listar(group, parameter) {
    //console.log('**** DATAPARAMETRO_TABLE :'+ process.env.DATAPARAMETRO_TABLE);
    if (parameter && group){
        return getDataToList(group, parameter);
    }
    return getDataToList(group);
}

async function listarTodo() {
    //console.log('**** listarTodo');
    var items = await getParametro(PARAMETRO_TABLE, true);
    var x;
    var y;
    var parametro={};
    var dataparametro;
    var output=[];
    try{
        //console.log('***1***');
        if (!items.result){
            return {result: false,errores: {codigo:'2',mensaje:'No se encontraron datos en tabla:'+PARAMETRO_TABLE}};
        }
        var grupo = [];
        var desgrupo = [];
        for (x of items.data) {
            grupo.push(x.cod_catalogo);
            desgrupo.push(x.des_catalogo);
        }
        for (let i = 0; i < grupo.length; i++) {
            parametro = {cod_catalogo:grupo [i], des_catalogo:desgrupo [i]};
            dataparametro = await getParametro(DATAPARAMETRO_TABLE, false ,grupo[i]);
            if (dataparametro.result){
                for (y of dataparametro.data) {
                    deleteParameterList(y);
                }
            }else{
                return {result: false,errores:{codigo:'2',mensaje: 'No se encontraron datos en tabla: '+DATAPARAMETRO_TABLE}};
            }
            delete dataparametro.result;
            parametro = await stringifyParameterGroup(parametro);
            dataparametro = await stringifyParameterList(dataparametro);
            parametro.listaDataParametro = dataparametro.data;
            output.push(parametro);
         }
    }catch (err) {
        return {result: false,errores:{codigo:'-1',mensaje: 'Error:'+err}};
    }
    return {result: true,data:output};
}

async function getDataToList(group, parameter = undefined) {
    var parameterGroup = await  getParametro(PARAMETRO_TABLE, false, group);
    if (!parameterGroup.result){
        return GrupoParametro;
    }
    delete parameterGroup.result;
    parameterGroup = await  prepareParameterGroup(parameterGroup);
    var parameterList = await  getParametro(DATAPARAMETRO_TABLE, false ,group, parameter);
    if (!parameterList.result){
        return parameterList;
    }
    delete parameterList.result;
    parameterList = await  prepareParameterList(parameterList);
    if(parameterGroup.data.length <=0 ){
        return {result: false,errores:{codigo:'2',mensaje: 'Error: grupo no encontrado'}};
    }
    parameterGroup.data[0].listaDataParametro = parameterList.data;
    return {result: true,data:parameterGroup.data[0]};
}

async function prepareParameterList(parameterList) {
    var y;
    parameterList = await stringifyParameterList(parameterList);
    for (y of parameterList.data) {
        deleteParameterList(y);
    }
    return parameterList;
}

async function stringifyParameterList(parameterList) {
    var stringify =JSON.stringify(parameterList);
    stringify = await replaceAll(stringify, 'cod_datacat','codParametro') ;
    stringify = await replaceAll(stringify, 'cod_estado','codEstado');
    stringify = await replaceAll(stringify, 'des_acronimo','desAcronimo');
    stringify = await replaceAll(stringify, 'des_corta','desCorta');
    return JSON.parse(stringify); 
}

async function deleteParameterList(object) {
    delete object.cod_usuregis;
    delete object.fec_inidatcat;
    delete object.num_transaccion;
    delete object.fec_inicat;
    delete object.fec_findatcat;
    delete object.fec_finvigorig;
    delete object.fec_regis;
    delete object.fec_modif;
    delete object.cod_usumodif;
    delete object.cod_catalogo;
    delete object.ind_regactual;
    delete object.des_datacat;
}

async function prepareParameterGroup(parameterGroup) {
    var y;
    parameterGroup = await stringifyParameterGroup(parameterGroup);
    for (y of parameterGroup.data) {
        deleteParameterGroup(y);
    }
    return parameterGroup;
}

async function stringifyParameterGroup(parameterGroup) {
    var stringify =JSON.stringify(parameterGroup);
    stringify = await replaceAll(stringify, 'cod_catalogo','codGrupo') ;
    stringify = await replaceAll(stringify, 'des_catalogo','nombreGrupo');
    return JSON.parse(stringify);
}

async function deleteParameterGroup(object) {
    delete object.fec_inicat;
    delete object.fec_fincat;
    delete object.fec_fincatorig;
    delete object.cod_depen;
    delete object.ind_acceso;
    delete object.cod_estado;
    delete object.cod_usuregis;
    delete object.cod_usumodif;
    delete object.fec_regis;
    delete object.cod_usumodif;
    delete object.fec_modif;
    delete object.num_transaccion;
    delete object.ind_regactual;
    delete object.des_acronimo;
}

async function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}
   
async function getParametro(table, scan = false ,group = undefined, parameter = undefined) {
    var result = null;
    var params_ = await setParams(table, group, parameter);
    try{
        //console.log(params_);
        if(scan) {
            result = await dynamoDbClient.scan(params_).promise();
        }else{
            result = await dynamoDbClient.query(params_).promise();
        }
        //console.log(result);
        return {result: true,data:result['Items']};
    } catch (err) {
        console.log(err);
        return {result: false,errores:{codigo:'-1',mensaje: 'Error:'+err}};
    }
}

async function setParams(table, group = undefined, parameter = undefined) {
    let attribute = null;
    let condition = null;
    var params_ = {
        TableName: table
    };
    if(group!=undefined) {
        attribute = {
            ':cod_catalogo':  group
        };
        condition = 'cod_catalogo =:cod_catalogo';
    }
    if(parameter!=undefined) {
        attribute = {
            ':cod_catalogo': group,
            ':cod_datacat':  parameter
        };
        condition = 'cod_catalogo =:cod_catalogo and cod_datacat = :cod_datacat';
    }
    if(group!=undefined) {
        params_ = {
            TableName: table,
            ExpressionAttributeValues: attribute,
            KeyConditionExpression: condition
        };
    }
    return params_;
}

module.exports = {
    listar,listarTodo
}