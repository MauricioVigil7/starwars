const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const RAMOS_TABLE = process.env.RAMOS_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;

async  function paso10valida(req) {
	//****** inicio validadacion ************ 
	req.codEquipo=req.ramosTecnico.roturaMaquinaria.codEquipo;
	req.codMantenimiento=req.ramosTecnico.roturaMaquinaria.codMantenimiento;
	req.codRepuesto=req.ramosTecnico.roturaMaquinaria.codRepuesto;
	req.codRegistro=req.ramosTecnico.roturaMaquinaria.codRegistro;
	req.codElectricidad=req.ramosTecnico.ServGenSuministros.codElectricidad;
	req.codGrupoElectrogeno=req.ramosTecnico.ServGenSuministros.codGrupoElectrogeno;
	req.codSistemaFrio=req.ramosTecnico.ServGenSuministros.codSistemaFrio;
	req.codPozoTierra=req.ramosTecnico.ServGenSuministros.codPozoTierra;
	
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = null;
    var valoresparam = [
	req.codTipoTramite,req.claveTramite,req.email
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email'
	];

	for(var i = 0; i <= valoresparam.length -1; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
		}
	}

    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	valida = await utiles.validateDate(req.fechaRegistro);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
	return {result: true};
}

async  function paso10RamosTecnicos(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var seguir = await paso10valida(req);
    //console.log('**** seguir :'+ seguir);
	if (!seguir) {
         return seguir;
    }
    //****** inicio validadacion ************ 
	var valida = null;
    var Item= {
            "num_tramite": req.claveTramite,
            "num_ramos": req.codRamos,
            "cod_equipo" : req.codEquipo,
            "cod_mantenimiento":req.codMantenimiento,
            "cod_registro" :req.codRegistro,
            "cod_repuesto" :req.codRepuesto,
            "cod_electricidad" :req.codElectricidad,
            "cod_grup_electr" :req.codGrupoElectrogeno,
            "cod_sist_frio" :req.codSistemaFrio,
            "cod_pozo_tierra" :req.codPozoTierra,
          };
		  
	var valoresparam = [
	req.codEquipo,req.codMantenimiento,req.codRegistro,req.codRepuesto,req.codElectricidad,req.codGrupoElectrogeno,req.codSistemaFrio,req.codPozoTierra
	];
	var namesparam = [
	'codEquipo','codMantenimiento','codRegistro','codRepuesto','codElectricidad','codGrupoElectrogeno','codSistemaFrio','codPozoTierra'
	];
	var namescampo = [
	'cod_equipo','cod_mantenimiento','cod_registro','cod_repuesto','cod_electricidad','cod_grup_electr','cod_sist_frio','cod_pozo_tierra'
	];

	for(var i = 0; i <= valoresparam.length -1; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
          delete Item[namescampo[i]];
		}
	}
    
   //****** fin validadacion ************ 

    const params = {
            "TransactItems": [
              {
                "Put": {
                 Item,
                  "TableName": RAMOS_TABLE
                }
              },
              
             {
               Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp :req.email,
                    num_tramite: req.claveTramite
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

async  function paso10RamosTecnicosUpd(req) {


    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var seguir = await paso10valida(req);
    //console.log('**** seguir :'+ seguir);
	if (!seguir) {
         return seguir;
    }
   var valida = null; 

    var  ExpressionAttributeValues= {
                                   // ":num_tramite": req.claveTramite,
                                   // ":correo_insp": req.email,
                                    ":cod_equipo" : req.codEquipo,
                                    ":cod_mantenimiento":req.codMantenimiento,
                                    ":cod_registro" :req.codRegistro,
                                    ":cod_repuesto" :req.codRepuesto,
                                    ":cod_electricidad" :req.codElectricidad,
                                    ":cod_grup_electr" :req.codGrupoElectrogeno,
                                    ":cod_sist_frio" :req.codSistemaFrio,
                                    ":cod_pozo_tierra" :req.codPozoTierra,
                                  };
    
    var upd="set ";
    var registros = [];
    
	var valoresparam = [
	req.codEquipo,req.codMantenimiento,req.codRegistro,req.codRepuesto,req.codElectricidad,req.codGrupoElectrogeno,req.codSistemaFrio,req.codPozoTierra
	];
	var namesparam = [
	'codEquipo','codMantenimiento','codRegistro','codRepuesto','codElectricidad','codGrupoElectrogeno','codSistemaFrio','codPozoTierra'
	];
	var namescampo = [
	':cod_equipo',':cod_mantenimiento',':cod_registro',':cod_repuesto',':cod_electricidad',':cod_grup_electr',':cod_sist_frio',':cod_pozo_tierra'
	];
	var namesregistro = [
	"cod_equipo = :cod_equipo","cod_mantenimiento = :cod_mantenimiento","cod_registro = :cod_registro",
	"cod_repuesto = :cod_repuesto","cod_electricidad = :cod_electricidad","cod_grup_electr = :cod_grup_electr",
	"cod_sist_frio = :cod_sist_frio","cod_pozo_tierra = :cod_pozo_tierra"
	];

	for(var i = 0; i <= valoresparam.length -1; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
          delete ExpressionAttributeValues[namescampo[i]];
		}else{
          registros.push(namesregistro[i]);
		}
	}

    for (var j=0; j<registros.length;j++){
        if(j==registros.length-1)
             upd = upd + registros[j] ;
        else upd = upd + registros[j] + "," ;
    }
    
    const params = {
            "TransactItems": [
              {
                Update: {
                      TableName: RAMOS_TABLE,
                      Key: {
                         num_tramite: req.claveTramite,
                         num_ramos: req.ramosTecnico.codRamos
                      },
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      //ConditionExpression: "num_tramite = :num_tramite",
                      returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                     }
              },
             {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp :req.email,
                    num_tramite: req.claveTramite
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
    
    var result=  await save(params);
	//console.log('**** result :',result);
    return result;
    
}

async function paso10RamosTecnicosGet(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 dao************');
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var fecha = await utiles.fecha();
    
    var y;
    var ramosTecnico = [];
    var codRamos = {};
    var roturaMaquinaria={};
    var ServGenSuministros={};
    //console.log('*******paso10RamosTecnicosGet 1************');
    var listaramos = await paso10GetRamosTecnicos(numtramite,"-1") ;
    if(!listaramos.result){
          return {result: listaramos.result, errores:listaramos.errores,fechaConsulta:fechaConsulta}; 
	}
    //console.log('*******paso10RamosTecnicosGet 2************');
    for (y of listaramos.data) {
        codRamos={codRamos:y.codRamos};
        roturaMaquinaria = {codEquipo:y.codEquipo,codMantenimiento:y.codMantenimiento,codRepuesto:y.codRepuesto,codRegistro:y.codRegistro};
        ServGenSuministros ={codElectricidad:y.codElectricidad,codGrupoElectrogeno:y.codGrupoElectrogeno,codSistemaFrio:y.codSistemaFrio,codPozoTierra:y.codPozoTierra};
        ramosTecnico.push({codRamos,roturaMaquinaria,ServGenSuministros});
    }
    
    
    var resultado=[{"claveTramite":numtramite}, {"codTipoTramite":codTipoTramite}, {"email":email} , {fechaRegistro :fecha},{"ramosTecnico":ramosTecnico}];
    return {result: true,data:resultado,fechaConsulta:fechaConsulta};
    //}
}

async function paso10GetRamosTecnicos(numtramite,codRamos) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    params = {
                TableName: RAMOS_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_ramos' :codRamos
                },
               /* FilterExpression: '#num_tramite = :num_tramite and #num_ramos = :num_ramos',
                ExpressionAttributeNames: {
                    "#num_ramos": "num_ramos",
                    "#num_tramite": "num_tramite"
                },*/
                 KeyConditionExpression: 'num_tramite =:num_tramite and num_ramos = :num_ramos',
            };
            if (codRamos=="-1"){
                params = {
                        TableName: RAMOS_TABLE,
                        ExpressionAttributeValues: {
                            ':num_tramite': numtramite
                        },
                        KeyConditionExpression: 'num_tramite =:num_tramite',
                    }; 
               }
         
            const {Items} = await dynamoDbClient.query(params).promise();
            //console.log('*******Items************');
            //console.log(Items);
            if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_ramos','codRamos') ;
                stringify = await utiles.replaceAll(stringify, 'cod_equipo','codEquipo');
                stringify = await utiles.replaceAll(stringify, 'cod_mantenimiento','codMantenimiento');
                stringify = await utiles.replaceAll(stringify, 'cod_repuesto','codRepuesto');
                stringify = await utiles.replaceAll(stringify, 'cod_registro','codRegistro');
                stringify = await utiles.replaceAll(stringify, 'cod_electricidad','codElectricidad');
                stringify = await utiles.replaceAll(stringify, 'cod_grup_electr','codGrupoElectrogeno');
                stringify = await utiles.replaceAll(stringify, 'cod_sist_frio','codSistemaFrio');
                stringify = await utiles.replaceAll(stringify, 'cod_pozo_tierra','codPozoTierra');
                var datos  = JSON.parse(stringify);
                return {result: true, data: datos,fechaConsulta:fechaConsulta};
            }
            return {result: false, errores:{codigo:'3',mensaje:'consulta sin resultado en '+ RAMOS_TABLE},fechaConsulta:fechaConsulta};
}

module.exports = {
    paso10RamosTecnicosGet,paso10RamosTecnicosUpd,paso10RamosTecnicos,paso10GetRamosTecnicos
}

