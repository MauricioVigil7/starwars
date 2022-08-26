const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');


const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const IND_DEL = process.env.IND_DEL;
const COD_TIPO_TRAMITE = process.env.COD_TIPO_TRAMITE;
const COD_ESTADO = process.env.COD_ESTADO;

async  function paso12valida(req) {
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
   /* if (req.codTipoTramite != COD_TIPO_TRAMITE) {
          return {result: false, errores:{codigo:'4',mensaje:'Tipo de tramite no valido'}};
    }*/

    valida = await utiles.validateParametro(req.codEstadoTramite,'codEstadoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
    if (req.codEstadoTramite != COD_ESTADO) {
          return {result: false, errores:{codigo:'4',mensaje:'codigo Estado no valido'}};
    }
    
    valida = await utiles.validateDate(req.fechaRegistro);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateParametro(req.email,'email');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
     valida = await utiles.validarEmail(req.email);
    if (valida.result==false) {
          return valida;
    }
    
	return valida;
}

async  function paso12Ins(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var seguir = await paso12valida(req);
	if (!seguir.result) {
         return seguir;
    }
    
    var TransactItems = [];
    var params=null;
 
    var  ExpressionAttributeValues= {
         ":fec_modif": fechaHora,
         ":cod_estado": req.codEstadoTramite,
         ":des_garantia": req.propuestasGarantia,
         ":cod_tipinforme": req.codTipoTramite,
         ":fec_actualizacion":req.fechaRegistro
      };
      
    var valida = await utiles.validateParametro(req.propuestasGarantia,'propuestasGarantia');
    var updateexpression="set fec_actualizacion =:fec_actualizacion," +
        "fec_modif = :fec_modif,cod_estado = :cod_estado,des_garantia = :des_garantia";
    if (valida.result==false) {
        
        delete  ExpressionAttributeValues[":des_garantia"];
        updateexpression="set fec_actualizacion =:fec_actualizacion,fec_modif = :fec_modif,cod_estado = :cod_estado";
        //console.log('ExpressionAttributeValues',ExpressionAttributeValues);
        
    }
    var upd = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: updateexpression,
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
    };
    TransactItems.push(upd);
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
    return result;
}
async  function save(params) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    try {
             await  dynamoDbClient.transactWrite(params).promise();
        return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}

async  function paso12Upd(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var seguir = await paso12valida(req);
	if (!seguir.result) {
         return seguir;
    }
    
    var TransactItems = [];
    var params=null;
 
    var  ExpressionAttributeValues= {
         ":fec_modif": fechaHora,
         ":cod_estado": req.codEstadoTramite,
         ":des_garantia": req.propuestasGarantia,
         ":cod_tipinforme": req.codTipoTramite,
         ":fec_actualizacion":req.fechaRegistro
      };
    var valida = await utiles.validateParametro(req.propuestasGarantia,'propuestasGarantia');
    var updateexpression="set fec_actualizacion =:fec_actualizacion," +
        "fec_modif = :fec_modif,cod_estado = :cod_estado,des_garantia = :des_garantia";
    if (valida.result==false) {
        delete  ExpressionAttributeValues[':des_garantia'];
        updateexpression="set fec_actualizacion =:fec_actualizacion,fec_modif = :fec_modif,cod_estado = :cod_estado";
    }
    var upd = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: updateexpression,
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
    };
           TransactItems.push(upd);
           params = { "TransactItems":TransactItems};
           // console.log(TransactItems);
           var result=  await save(params);
           return result;
}


async function paso12Get(numtramite,email) {
    
     //****** inicio validadacion ************ 
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    var valida = await utiles.validateParametro(numtramite);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }
    
    valida = await utiles.validateParametro(email);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores};
    }

    valida = await utiles.validarEmail(email);
    if (valida.result==false) {
          return valida;
    }
    
  
   //****** fin validadacion ************
    
    if (email && numtramite){
        
       var listainspeccion = await InspeccionGet(numtramite,email) ;
       
       
       var stringify =JSON.stringify(listainspeccion);
        stringify = await utiles.replaceAll(stringify, 'des_garantia','propuestasGarantia') ;
        stringify = await utiles.replaceAll(stringify, 'cod_estado','codEstadoTramite') ;
        stringify = await utiles.replaceAll(stringify, 'fec_actualizacion','fechaActualizacion');
        stringify = await utiles.replaceAll(stringify, 'cod_tipinforme','codTipoTramite');
        var fechaActualizacion='';
        var codTipoTramite='';
        var codEstadoTramite='';
        var propuestasGarantia='';
        listainspeccion = JSON.parse(stringify); 
        var fechaActualizacion='';
        var codTipoTramite='';
        var y;
        delete listainspeccion.result;
        for (y of listainspeccion.data) {
              codEstadoTramite= y.codEstadoTramite;
              propuestasGarantia= y.propuestasGarantia;
              
               delete y.codEstadoTramite;
               delete y.propuestasGarantia;
               delete y.cod_estado;
               delete y.cod_estatus;
               delete y.porcen_eml;
               delete y.nom_inspector;
               delete y.des_direccion;
               delete y.des_observacion;
               delete y.fec_inspeccion;
               
               delete y.des_justificacion;
               delete y.hor_inspeccion;
               delete y.cod_tipinforme;
               delete y.porcen_pml;
               
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
        var resultado=[
            {"claveTramite":numtramite}, 
            {"codTipoTramite":codTipoTramite}, 
            {"email":email} , 
            {"fechaRegistro" :fechaActualizacion},
            {"codEstadoTramite":codEstadoTramite},
            {"propuestasGarantia":propuestasGarantia}
            ];
        return {result: true,data:resultado};
    } 
    // return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados'}};
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
  paso12Ins, paso12Upd,paso12Get
}

