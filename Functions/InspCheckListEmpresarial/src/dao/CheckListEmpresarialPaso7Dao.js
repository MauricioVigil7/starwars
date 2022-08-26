const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const EDIFICACIONES_TABLE = process.env.EDIFICACIONES_TABLE;
const ACTIVIDAD_TABLE = process.env.ACTIVIDAD_TABLE;
const IND_DEL = process.env.IND_DEL;


async  function paso7valida(req) {
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = true;
	valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	
	
	return {result: true};
}

async  function paso7ActividadDesarrollada(req) {

    var params = null;
	var valida = null;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var seguir = await paso7valida(req);

     //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
	
    valida = await utiles.validateParametro(req.codActividad,'codActividad');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    var Item= {
                    "num_tramite": req.claveTramite,
                    "num_actividad" :req.codActividad,
                    "des_actividad" :req.actividadDesarrollada.descripcionActividad,
                    "des_personal" :req.actividadDesarrollada.descripcionPersonal
              };
     var stringify1 =JSON.stringify(Item);

     Item = JSON.parse(stringify1);
     valida = await utiles.validateParametro(req.actividadDesarrollada.descripcionActividad,'descripcionActividad');
     if (!valida.result) {

            delete Item['des_actividad'];
     }
     valida = await utiles.validateParametro(req.actividadDesarrollada.descripcionPersonal,'descripcionPersonal');
     if (!valida.result) {
            delete Item['des_personal']; 
     }
     valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
     if (!valida.result) {
               return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
     }
     valida = await utiles.validateDate(req.fechaRegistro);
     if (!valida.result) {
              return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
     }
    
     params = {
            "TransactItems": [
              {
                "Put": {
                     Item,
                   "TableName": ACTIVIDAD_TABLE
                }
              },
              {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    correo_insp :req.email,
                  },
                 UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion" 
                  ,
                  ExpressionAttributeValues: {
                    
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion":req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              }
            ]
         };
       //params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('**** result :',result);
    return result;
    
}

async  function save(params) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    try {
             await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'},fechaConsulta:fechaConsulta};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error},fechaConsulta:fechaConsulta};
   }
}


async  function paso7ActividadDesarrolladaUpd(req) {

    var params = null;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
     valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
     valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
    valida = await utiles.validateParametro(req.actividadDesarrollada.codActividad,'codActividad');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
   /* var existe = await paso7GetActividad(req.claveTramite,req.actividadDesarrollada.codActividad);
    if (!existe.result) {
          return existe;
    }
    */
    var ExpressionAttributeValues = {
                    ":des_actividad" :req.actividadDesarrollada.descripcionActividad,
                    ":des_personal" :req.actividadDesarrollada.descripcionPersonal
                  };
                  
                  
     var stringify1 =JSON.stringify(ExpressionAttributeValues);
     ExpressionAttributeValues = JSON.parse(stringify1);
     var upd="set ";
     var registros = [];

     valida = await utiles.validateParametro(req.actividadDesarrollada.descripcionActividad,'descripcionActividad');
    if (valida.result) {
         registros.push("des_actividad = :des_actividad");
    }else{
         delete ExpressionAttributeValues['des_actividad'];
    }
    
    valida = await utiles.validateParametro(req.actividadDesarrollada.descripcionPersonal,'descripcionPersonal');
    if (valida.result) {
         registros.push("des_personal = :des_personal");
    }else{
         delete ExpressionAttributeValues['des_personal'];
    }
   
     valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
     if (!valida.result) {
               return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
     }
     valida = await utiles.validateDate(req.fechaRegistro);
     if (!valida.result) {
              return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
     }
     
     for (var i=0; i<registros.length;i++){
        if(i==registros.length-1)
             upd = upd + registros[i] ;
        else upd = upd + registros[i] + "," ;
    }
   
    params = {
            "TransactItems": [
             {
                 Update: {
                  TableName: ACTIVIDAD_TABLE,
                  Key: {
                    num_tramite:req.claveTramite,
                    num_actividad: req.actividadDesarrollada.codActividad
                  },
                 UpdateExpression: upd 
                  ,
                  ExpressionAttributeValues: ExpressionAttributeValues,
              
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              },
              {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    correo_insp :req.email
                  },
                 UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion"  ,
                  ExpressionAttributeValues: {
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion":req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              }
            ]
         };
   
     var result=  await save(params);
	//console.log('**** result :',result);
    return result;
   
    
}

async function paso7ActividadDesarrolladaGet(numtramite,email,codTipoTramite) {
   
    var fechaHora = await utiles.fechaHora();
     var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    if (numtramite){

        var lista = await paso7ActividadGet(numtramite) ;
        var stringify1 =JSON.stringify(lista);

        stringify1 = await utiles.replaceAll(stringify1, 'num_actividad','codActividad') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_personal','descripcionPersonal');
        stringify1 = await utiles.replaceAll(stringify1, 'des_actividad','descripcionActividad');
        lista = JSON.parse(stringify1); 
        var actividadDesarrollada = lista.data;
        var y;
        for (y of actividadDesarrollada) {
             delete y.num_tramite;
        }

        if(lista.result){
            var resultado=[
                {"claveTramite":numtramite}, 
                {"codTipoTramite":codTipoTramite}, 
                {"email":email} , {fechaRegistro :fecha},
                {"actividadDesarrollada":actividadDesarrollada}];
            return {result: true,data:resultado,fechaConsulta:fechaConsulta};
        }
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'},fechaConsulta:fechaConsulta};
}

async function paso7ActividadGet(numtramite) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    let params = {
                TableName: ACTIVIDAD_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+ACTIVIDAD_TABLE},fechaConsulta:fechaConsulta};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
    
   
}

async function paso7GetActividad(numtramite,codActividad) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    let params = {
                TableName: ACTIVIDAD_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_actividad': codActividad
                },
                KeyConditionExpression: 'num_tramite =:num_tramite and num_actividad =:num_actividad',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+ACTIVIDAD_TABLE},fechaConsulta:fechaConsulta};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
    
}




module.exports = {
    paso7ActividadGet,paso7GetActividad,paso7ActividadDesarrollada, paso7ActividadDesarrolladaUpd, paso7ActividadDesarrolladaGet
}