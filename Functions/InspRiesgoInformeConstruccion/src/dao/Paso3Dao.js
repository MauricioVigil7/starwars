const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;


async  function pasovalida(req) {
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = true;
	valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    
    valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    
    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	
	return {result: true};
}

async  function save(params) {
    try {
             await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}


async  function paso3Ins(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    
     var valida = null;
     if( req.fechaActualizacion == undefined){
          req.fechaActualizacion = req.fechaRegistro;
      }
      if( req.fechaRegistro == undefined){
          req.fechaRegistro = req.fechaActualizacion;
      }
     var seguir = await pasovalida(req);

     //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
     }
    
   //****** fin validacion ************ 
    
    var TransactItems = [];
    var params=null;
    var setter="set ";
    var registros = [];
    var ExpressionAttributeValues = {
     ":fec_modif" :fechaHora,
     ":fec_actualizacion":req.fechaRegistro,
    // ":cod_tipinforme":req.codTipoTramite,
     ":des_general" :req.datosGenerales.descripcion,
     ":des_estructura":req.estructurasPrincipales.descripcion,
     ":des_mant":req.mantenimiento.descripcion,
     ":des_edif_inst":req.EdificiosInstalaciones.descripcion

     //EdificiosInstalaciones
     };
      registros.push("fec_modif = :fec_modif");
      registros.push("fec_actualizacion = :fec_actualizacion");
     var valida=null;
     valida = await utiles.validateParametro(req.datosGenerales.descripcion,'datosGenerales.descripcion');
     if (valida.result) {
         registros.push("des_general = :des_general");
     }else{ 
             delete ExpressionAttributeValues[':des_general'];
     }
     valida = await utiles.validateParametro(req.estructurasPrincipales.descripcion,'estructurasPrincipales.descripcion');
     if (valida.result) {
          registros.push("des_estructura = :des_estructura");
      }else{ 
              delete ExpressionAttributeValues[':des_estructura'];
      }
      valida = await utiles.validateParametro(req.mantenimiento.descripcion,'mantenimiento.descripcion');
      if (valida.result) {
           registros.push("des_mant = :des_mant");
     }else{ 
              delete ExpressionAttributeValues[':des_mant'];
     }
     valida = await utiles.validateParametro(req.EdificiosInstalaciones.descripcion,'EdificiosInstalaciones.descripcion');
     if (valida.result) {
          registros.push("des_edif_inst = :des_edif_inst");
    }else{ 
              delete ExpressionAttributeValues[':des_edif_inst'];
    }

     for (var i=0; i<registros.length;i++){
          if(i==registros.length-1)
               setter = setter + registros[i] ;
          else setter = setter + registros[i] + "," ;
      }

    var upd = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                 UpdateExpression: setter ,
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  //ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
     };
     TransactItems.push(upd);
     params = { "TransactItems":TransactItems};
     var result=  await save(params);
	//console.log('****result*******',result);
     return result;
   
}

async  function paso3Upd(req) {
     var fechaHora = await utiles.fechaHora();
     var fechaConsulta = fechaHora;
     
      var valida = null;
      if( req.fechaActualizacion == undefined){
           req.fechaActualizacion = req.fechaRegistro;
       }
       if( req.fechaRegistro == undefined){
           req.fechaRegistro = req.fechaActualizacion;
       }
      var seguir = await pasovalida(req);
 
      //console.log('**** seguir :'+ seguir.result);
      if (!seguir.result) {
          return seguir;
      }
     
    //****** fin validacion ************ 
     
     var TransactItems = [];
     var params=null;
     var setter="set ";
     var registros = [];
     var ExpressionAttributeValues = {
      ":fec_modif" :fechaHora,
      ":fec_actualizacion":req.fechaRegistro,
      //":cod_tipinforme":req.codTipoTramite,
      ":des_general" :req.datosGenerales.descripcion,
      ":des_estructura":req.estructurasPrincipales.descripcion,
      ":des_mant":req.mantenimiento.descripcion,
      ":des_edif_inst":req.EdificiosInstalaciones.descripcion
 
      //EdificiosInstalaciones
      };
      var valida=null;
      registros.push("fec_modif = :fec_modif");
      registros.push("fec_actualizacion = :fec_actualizacion");
      valida = await utiles.validateParametro(req.datosGenerales.descripcion,'datosGenerales.descripcion');
      if (valida.result) {
          registros.push("des_general = :des_general");
      }else{ 
              delete ExpressionAttributeValues[':des_general'];
      }
      valida = await utiles.validateParametro(req.estructurasPrincipales.descripcion,'estructurasPrincipales.descripcion');
      if (valida.result) {
           registros.push("des_estructura = :des_estructura");
       }else{ 
               delete ExpressionAttributeValues[':des_estructura'];
       }
       valida = await utiles.validateParametro(req.mantenimiento.descripcion,'mantenimiento.descripcion');
       if (valida.result) {
            registros.push("des_mant = :des_mant");
      }else{ 
               delete ExpressionAttributeValues[':des_mant'];
      }
      valida = await utiles.validateParametro(req.EdificiosInstalaciones.descripcion,'EdificiosInstalaciones.descripcion');
      if (valida.result) {
           registros.push("des_edif_inst = :des_edif_inst");
     }else{ 
               delete ExpressionAttributeValues[':des_edif_inst'];
     }
 
      for (var i=0; i<registros.length;i++){
           if(i==registros.length-1)
                setter = setter + registros[i] ;
           else setter = setter + registros[i] + "," ;
       }
 
     var upd = {
                 Update: {
                   TableName: INSPECCIONES_TABLE,
                   Key: {
                     correo_insp:req.email,
                     num_tramite: req.claveTramite
                   },
                  UpdateExpression: setter ,
                   ExpressionAttributeValues: ExpressionAttributeValues,
                   //ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                   returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                 },
      };
      TransactItems.push(upd);
      params = { "TransactItems":TransactItems};
      var result=  await save(params);
      //console.log('****result*******',result);
      return result;
    
}


async function paso3Get(numtramite,email) {
   
    //console.log('numtramite****:',numtramite);
    //console.log('email***:',email);
    //console.log('codTipoTramite:'+codTipoTramite);
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
	var stringify1 = null;
    if (numtramite){

     var listainspeccion = await InspeccionGet(numtramite,email) ;
     //console.log('listainspeccion***:',listainspeccion);

     var stringify =JSON.stringify(listainspeccion);
     stringify = await utiles.replaceAll(stringify, 'des_general','datosGenerales') ;
     stringify = await utiles.replaceAll(stringify, 'des_estructura','estructurasPrincipales');
     stringify = await utiles.replaceAll(stringify, 'des_mant','mantenimiento');
     stringify = await utiles.replaceAll(stringify, 'des_edif_inst','EdificiosInstalaciones');
     stringify = await utiles.replaceAll(stringify, 'cod_tipinforme','codTipoTramite');
     stringify = await utiles.replaceAll(stringify, 'fec_actualizacion','fechaActualizacion');
     var fechaActualizacion='';
     var codTipoTramite='';
     var datosGenerales='';
     var estructurasPrincipales='';
     var mantenimiento='';
     var EdificiosInstalaciones='';

     listainspeccion = JSON.parse(stringify); 
     //console.log('listainspeccion:',listainspeccion);
     for (var y of listainspeccion.data) {

            datosGenerales={"descripcion":y.datosGenerales};
            //console.log('datosGenerales:',datosGenerales);
            estructurasPrincipales={"descripcion":y.estructurasPrincipales};//y.des_estructura;
            mantenimiento={"descripcion":y.mantenimiento};
            EdificiosInstalaciones={"descripcion":y.EdificiosInstalaciones};

            delete y.num_piso;
            delete y.fec_ven_insp;
            delete y.mto_edificacion;
            delete y.cod_inspector;
            delete y.mto_existencia;
            delete y.cod_estado;
            delete y.num_latitud;
            delete y.colindantes;
            delete y.correo_insp;
            delete y.mto_maquinaria;
            delete y.descripcion;
            delete y.cod_estructura;
            delete y.riosQuebradas;
            delete y.des_ent_colinda;
            delete y.cod_uso;
            delete y.mto_lucro;
            delete y.actividad_local;
            delete y.nom_razsocial;
            delete y.mto_total;
            codTipoTramite=y.codTipoTramite;
            fechaActualizacion=y.fechaActualizacion;
            delete y.codTipoTramite;
            delete y.fechaActualizacion;
            delete y.num_sotano;
            delete y.fec_modif;
            delete y.num_longitud;
            delete y.num_tramite;
            delete y.fec_solicitud;
        }

       /* datosGenerales=y.des_general;
        estructurasPrincipales=y.des_estructura;
        mantenimiento=y.des_mant;
        EdificiosInstalaciones=y.des_edif_inst;*/
        
        var output = {
                  /*"datosGenerales":{"descripcion":datosGenerales},
                  "estructurasPrincipales":{"descripcion":estructurasPrincipales},
                  "mantenimiento":{"descripcion":mantenimiento},
                  "EdificiosInstalaciones":{"descripcion":EdificiosInstalaciones}*/
          };

        var resultado=[
               {"claveTramite":numtramite}, 
               {"codTipoTramite":codTipoTramite}, 
               {"email":email} , 
               {"fechaActualizacion" :fechaActualizacion},
               {"datosGenerales":datosGenerales},
               {"estructurasPrincipales":estructurasPrincipales},
               {"mantenimiento":mantenimiento},
               {"EdificiosInstalaciones":EdificiosInstalaciones}
               ];

         return {result: true,data:resultado};

    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}

async function InspeccionGet(numtramite,email) {
    
     let params;
     var fechaHora = await utiles.fechaHora();
 
        if (email && numtramite){
          params = {
                 TableName: INSPECCIONES_TABLE,
                 ExpressionAttributeValues: {
                    ':correo_insp' :email,
                    ':num_tramite' :numtramite,
                   // ':cod_tipinforme' :codTipoTramite,
                 },
                // FilterExpression: 'cod_tipinforme = :cod_tipinforme',
                 KeyConditionExpression: 'correo_insp =:correo_insp and num_tramite =:num_tramite',
         };
         
         const {Items} = await dynamoDbClient.query(params).promise();
         if (Items.length > 0) {
             var stringify =JSON.stringify(Items);
             var datos  = JSON.parse(stringify); 
      
             return {result: true,data:datos};
               
         }
         return {result: false,errores: {codigo:'3',mensaje:'No se encontraron datos en Inspeccion'}};
     } 
      return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados'}};
 
 }

module.exports = {
    paso3Ins,paso3Upd,paso3Get
}