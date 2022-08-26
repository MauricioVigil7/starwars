const dynamoDbClient = require('../db/config');
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;

async function getInspecciones(req) {
    //console.log('**** correoInspector****** ' +req.email);
    //console.log('**** claveTramite********  ' +req.claveTramite);
    const params = {
        TableName : INSPECCIONES_TABLE,
        ExpressionAttributeValues: {
                   ':correo_insp' :req.email,
                   ':num_tramite' :req.claveTramite
                },
        //        FilterExpression: 'cod_estado = :cod_estado',
        KeyConditionExpression: 'correo_insp =:correo_insp and num_tramite =:num_tramite',
	
    };

    try {
        const {Items} = await dynamoDbClient.query(params).promise();
        if (Items.length > 0) {
            const {num_longitud, num_latitud} = Items[0];
            return {result: true ,status:200, data: {coordX: num_longitud, coordY: num_latitud}};
        } 
        return {result:false,status:401 ,errores:{codigo:'1', mensaje:'Sin resultados al consultar'}};
    } catch (error) {
        console.log(error);
        return {result:false,status:401 ,errores:{codigo:'1', mensaje:'Sin resultados al consultar'}};
    }
}

async function insertInspecciones(req) {
  var valida =  await getInspecciones(req);
  if (!valida.result)
     return {result:valida.result ,errores:{codigo:'1', mensaje:'Inspeccion no encontrada'},status:500};
    
    const params = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            correo_insp:req.email,
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET num_longitud = :coordX, num_latitud = :coordY, cod_inspector =:cod_inspector",
        ExpressionAttributeValues: {
            ":coordX": req.coordX,
            ":coordY": req.coordY,
            ":cod_inspector": req.codInspector,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(params).promise();
        return {result: true,status: 200, data:{codigo:'0', mensaje:'Se registro Correctamente'}};
    } catch (error) {
        console.log(error);
        return {result: false,status: 500, errores:{codigo:'2', mensaje:'Error al registrar  : ' + error}};
    }
}

async function updateInspecciones(req) {
    var valida =  await getInspecciones(req);
    if (!valida.result)
        return {result: valida.result,status: 401, errores:{codigo:'2', mensaje:'Error al registrar  : Inspeccion no encontrada' }};

    const params = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            correo_insp:req.email,
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET num_longitud = :coordX, num_latitud = :coordY, cod_inspector =:cod_inspector",
        ExpressionAttributeValues: {
            ":coordX": req.coordX,
            ":coordY": req.coordY,
            ":cod_inspector": req.codInspector,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(params).promise();
        return {result: true,status: 200, data:{codigo:'0', mensaje:'Se registro Correctamente'}};
    } catch (error) {
        console.log(error);
        return {result: false,status: 500, errores:{codigo:'2', mensaje:'Error al registrar  : ' + error}};
    }
}

module.exports = {
    getInspecciones, insertInspecciones, updateInspecciones
}