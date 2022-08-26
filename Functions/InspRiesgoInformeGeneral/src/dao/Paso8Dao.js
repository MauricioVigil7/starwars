const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const RAMOS_TABLE = process.env.RAMOS_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;

async  function paso8valida(req) {
	//****** inicio validadacion ************ 
	var fechaConsulta = utiles.fechaHora();

	var valida = null;
    var valoresparam = [
    	req.codTipoTramite,req.claveTramite,req.email,req.fechaRegistro,
    	req.ramos.detalleMaquina.descripcion,
    	req.ramos.serviciosGenerales.aguaDesague,
    	req.ramos.serviciosGenerales.electricidad,
    	req.ramos.serviciosGenerales.airecomprimido,
    	req.ramos.serviciosGenerales.calorVapor,
    	req.ramos.serviciosGenerales.combustibles,
    	req.ramos.serviciosGenerales.pozoTierra,
    	req.ramos.serviciosGenerales.otrosServicios,
    	req.ramos.gestionActivos.planMtto,
    	req.ramos.gestionActivos.repuestos
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email','fechaRegistro',
	'descripcion','electricidad','airecomprimido',
	'calorVapor','combustibles','pozoTierra','otrosServicios','planMtto','repuestos'
	];

	for(var i = 0; i <= 3; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
		}
	}

    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	valida = await utiles.validateDate(req.fechaRegistro);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
	return {result: true};
}

async  function save(params) {
    try {
           var resultado =  await  dynamoDbClient.transactWrite(params).promise();
             ////console.log('**** resultado :',resultado);//{}
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            
            //console.log('**** error.statusCode ****** :',error.statusCode);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}


async  function paso8Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
	var seguir = await paso8valida(req);
    //console.log('**** req.fechaTransaccion :'+ req.fechaTransaccion);
	if (!seguir.result) {
         return seguir;
    }
    
    var valoresparam = [
    	req.codTipoTramite,req.claveTramite,req.email,req.fechaRegistro,
    	req.ramos.detalleMaquina.descripcion,
    	req.ramos.serviciosGenerales.aguaDesague,
    	req.ramos.serviciosGenerales.electricidad,
    	req.ramos.serviciosGenerales.airecomprimido,
    	req.ramos.serviciosGenerales.calorVapor,
    	req.ramos.serviciosGenerales.combustibles,
    	req.ramos.serviciosGenerales.pozoTierra,
    	req.ramos.serviciosGenerales.sistemaFrio,
    	req.ramos.serviciosGenerales.otrosServicios,
    	req.ramos.gestionActivos.planMtto,
    	req.ramos.gestionActivos.repuestos
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email','fechaRegistro',
	'descripcion','electricidad','airecomprimido',
	'calorVapor','combustibles','pozoTierra','otrosServicios','planMtto','repuestos'
	];
     var Item =  {
                    "num_tramite": req.claveTramite,
                    "num_ramos" : context.awsRequestId,
					"des_maquina":req.ramos.detalleMaquina.descripcion,
                    "des_agua_desague" :req.ramos.serviciosGenerales.aguaDesague,
                    "des_electricidad" :req.ramos.serviciosGenerales.electricidad,
                    "des_aire_compri" :req.ramos.serviciosGenerales.airecomprimido,                
                    "des_calor_vapor" :req.ramos.serviciosGenerales.calorVapor,
                    "des_combustible" :req.ramos.serviciosGenerales.combustibles,                  
                    "des_pozo_tierra" :req.ramos.serviciosGenerales.pozoTierra,
                    "des_sistema_frio" :req.ramos.serviciosGenerales.sistemaFrio,
                    "des_otro_servic" :req.ramos.serviciosGenerales.otrosServicios,
                    "des_plan_mant" :req.ramos.gestionActivos.planMtto,
                    "des_repuestos" :req.ramos.gestionActivos.repuestos
                  };
     var stringify1 =JSON.stringify(Item);
         Item = JSON.parse(stringify1);
		 
	 var namescampo = ['des_maquina','des_agua_desague','des_electricidad',
			'des_aire_compri','des_calor_vapor','des_combustible','des_pozo_tierra',
			'des_sistema_frio','des_otro_servic','des_plan_mant','des_repuestos'
			];
	
		for(var j = 0; j <= valoresparam.length -1; j++) {
		 valida = await utiles.validateParametro(valoresparam[j],namesparam[j]);
         if (!valida.result) {
              delete Item[namescampo[j]];
           }
		}
       /* var incendio = await paso9GetIncendio(req.claveTramite,req.codIncendio);
        if (incendio.result){
                return {result: false, errores:{ codigo:'4',mensaje:'codigo de incendio ya existe'},fechaConsulta:fechaConsulta};
		}*/

        var params = {
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
                    ":fec_actualizacion": req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
                
              }
            ]
         };
        
        var result=  await save(params);
	    //console.log('****result*******',result);
        return result;
}


async  function paso8Upd(req) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;

    
    valida = await utiles.validateParametro(req.ramos.codRamos,'codRamos');
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
	}

   var ExpressionAttributeValues =  {
		//"num_tramite": req.claveTramite,
        //"num_ramos" : context.awsRequestId,
		":des_maquina":req.ramos.detalleMaquina.descripcion,
        ":des_agua_desague" :req.ramos.serviciosGenerales.aguaDesague,
        ":des_electricidad" :req.ramos.serviciosGenerales.electricidad,
        ":des_aire_compri" :req.ramos.serviciosGenerales.airecomprimido,                
        ":des_calor_vapor" :req.ramos.serviciosGenerales.calorVapor,
        ":des_combustible" :req.ramos.serviciosGenerales.combustibles,                  
        ":des_pozo_tierra" :req.ramos.serviciosGenerales.pozoTierra,
        ":des_sistema_frio" :req.ramos.serviciosGenerales.sistemaFrio,
        ":des_otro_servic" :req.ramos.serviciosGenerales.otrosServicios,
        ":des_plan_mant" :req.ramos.gestionActivos.planMtto,
        ":des_repuestos" :req.ramos.gestionActivos.repuestos
     };
	var valoresparam = [
	    req.ramos.detalleMaquina.descripcion,
        req.ramos.serviciosGenerales.aguaDesague,
        req.ramos.serviciosGenerales.electricidad,
        req.ramos.serviciosGenerales.airecomprimido,                
        req.ramos.serviciosGenerales.calorVapor,
        req.ramos.serviciosGenerales.combustibles,                  
        req.ramos.serviciosGenerales.pozoTierra,
        req.ramos.serviciosGenerales.sistemaFrio,
        req.ramos.serviciosGenerales.otrosServicios,
        req.ramos.gestionActivos.planMtto,
        req.ramos.gestionActivos.repuestos
	];
	var namesparam = ['descripcion','aguaDesague','electricidad','airecomprimido',
	'calorVapor','combustibles','pozoTierra','sistemaFrio','otrosServicios','planMtto','repuestos'
	];
	var namescampo = [':des_maquina',':des_agua_desague',':des_electricidad',':des_aire_compri',
	':des_calor_vapor',':des_combustible',':des_pozo_tierra',':des_sistema_frio',':des_otro_servic',
	':des_plan_mant',':des_repuestos'
	];
			
	var valida=null;	
	for(var i = 0; i <= valoresparam.length -1; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
				  delete ExpressionAttributeValues[namescampo[i]];
		}else{
			valida = await utiles.validarBoolean(valoresparam[i],namesparam[i]);
			if (valida.result) {
				 ExpressionAttributeValues[namescampo[i]]=valida.data.codigo;
			}
		}
	}
   //console.log('**** ExpressionAttributeValues :', ExpressionAttributeValues);
   var upd="set ";
   var registros = [];
   var namesregistro = [
			'des_maquina =:des_maquina',
			'des_agua_desague =:des_agua_desague',
			'des_electricidad =:des_electricidad',
			'des_aire_compri =:des_aire_compri',
			'des_calor_vapor =:des_calor_vapor',
	        'des_combustible =:des_combustible',
	        'des_pozo_tierra =:des_pozo_tierra',
	        'des_sistema_frio =:des_sistema_frio',
	        'des_otro_servic =:des_otro_servic',
	        'des_plan_mant =:des_plan_mant',
	        'des_repuestos =:des_repuestos'
			];
	//var valida=null;
	for(var i = 0; i <= valoresparam.length -1; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
			   delete ExpressionAttributeValues[namescampo[i]];
		}else{
			valida = await utiles.validarBoolean(valoresparam[i],namesparam[i]);
			if (valida.result) {
			   ExpressionAttributeValues[namescampo[i]]=valida.data.codigo;
		   }
			registros.push(namesregistro[i]);
		}
	}
	for (var k=0; k<registros.length;k++){
		if(k==registros.length-1)
			upd = upd + registros[k] ;
		else upd = upd + registros[k] + "," ;
	}
	var params = {
            "TransactItems": [
             {
                Update: {
                   TableName: RAMOS_TABLE,
				   Key: {
                    num_tramite: req.claveTramite,
                    num_ramos: req.ramos.codRamos
                  },
				  UpdateExpression: upd ,
                  //ConditionExpression: "num_tramite = :num_tramite",
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
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
                    ":fec_actualizacion": req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              }
            ]
         };
        var result=  await save(params);
        ////console.log('**** ExpressionAttributeValues :', ExpressionAttributeValues);
	    //console.log('****result*******',result);
        return result;
}

async function paso8Get(numtramite,email) {
   
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    if (numtramite){
        var ramos = await RamosGet(numtramite) ;
        var detalleMaquina = JSON.parse(JSON.stringify(ramos));
        var serviciosGenerales = JSON.parse(JSON.stringify(ramos));
        var gestionActivos = JSON.parse(JSON.stringify(ramos));
        var y;
        for (y of detalleMaquina.data) {
            delete y.cod_equipo;
            delete y.cod_repuesto;
            delete y.cod_electricidad;
            delete y.cod_registro;
            delete y.cod_grup_electr;
            delete y.cod_sist_frio;
            delete y.cod_mantenimiento;
            delete y.cod_pozo_tierra;
           
            delete y.des_agua_desague;
            delete y.des_electricidad;
            delete y.des_aire_compri;
            delete y.des_calor_vapor;
            delete y.des_combustible;
            delete y.des_pozo_tierra;
            delete y.des_sistema_frio;
            delete y.des_otro_servic;
            delete y.des_plan_mant;
            delete y.des_repuestos;
            
            delete y.num_ramos;
            delete y.num_tramite;
            
            delete y.des_plan_mant;
            delete y.des_repuestos;
         }
         for (y of serviciosGenerales.data) {
            delete y.cod_equipo;
            delete y.cod_repuesto;
            delete y.cod_electricidad;
            delete y.cod_registro;
            delete y.cod_grup_electr;
            delete y.cod_sist_frio;
            delete y.cod_mantenimiento;
            delete y.cod_pozo_tierra;
           
             
            delete y.des_plan_mant;
            delete y.des_repuestos;
            delete y.num_ramos;
            delete y.num_tramite;
         }
         for (y of gestionActivos.data) {
            delete y.cod_equipo;
            delete y.cod_repuesto;
            delete y.cod_electricidad;
            delete y.cod_registro;
            delete y.cod_grup_electr;
            delete y.cod_sist_frio;
            delete y.cod_mantenimiento;
            delete y.cod_pozo_tierra;
           
             
            delete y.des_agua_desague;
            delete y.des_electricidad;
            delete y.des_aire_compri;
            delete y.des_calor_vapor;
            delete y.des_combustible;
            delete y.des_pozo_tierra;
            delete y.des_sistema_frio;
            delete y.des_otro_servic;
            delete y.des_maquina;
            delete y.num_ramos;
            delete y.num_tramite;
         }

         for (y of ramos.data) {
            delete y.cod_equipo;
            delete y.cod_repuesto;
            delete y.cod_electricidad;
            delete y.cod_registro;
            delete y.cod_grup_electr;
            delete y.cod_sist_frio;
            delete y.cod_mantenimiento;
            delete y.cod_pozo_tierra;
           
            delete y.des_maquina;
             
            delete y.des_agua_desague;
            delete y.des_electricidad;
            delete y.des_aire_compri;
            delete y.des_calor_vapor;
            delete y.des_combustible;
            delete y.des_pozo_tierra;
            delete y.des_sistema_frio;
            delete y.des_otro_servic;
            delete y.des_plan_mant;
            delete y.des_repuestos;
            
            delete y.num_tramite;
            
            delete y.des_maquina;
            delete y.des_plan_mant;
            delete y.des_repuestos;
         }
         
        var stringify1 =JSON.stringify(ramos);
        stringify1 = await utiles.replaceAll(stringify1, 'des_maquina','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_agua_desague','aguaDesague') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_electricidad','electricidad');
        stringify1 = await utiles.replaceAll(stringify1, 'des_aire_compri','airecomprimido');
        stringify1 = await utiles.replaceAll(stringify1, 'des_calor_vapor','calorVapor');
        stringify1 = await utiles.replaceAll(stringify1, 'des_combustible','combustibles');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pozo_tierra','pozoTierra');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sistema_frio','sistemaFrio');
        stringify1 = await utiles.replaceAll(stringify1, 'des_otro_servic','otrosServicios');
        stringify1 = await utiles.replaceAll(stringify1, 'des_plan_mant','planMtto');
        stringify1 = await utiles.replaceAll(stringify1, 'des_repuestos','repuestos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_ramos','codRamos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_tramite','claveTramite');
        ramos = JSON.parse(stringify1);
        ramos = ramos.data;
        
        stringify1 =JSON.stringify(detalleMaquina);
        stringify1 = await utiles.replaceAll(stringify1, 'des_maquina','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_agua_desague','aguaDesague') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_electricidad','electricidad');
        stringify1 = await utiles.replaceAll(stringify1, 'des_aire_compri','airecomprimido');
        stringify1 = await utiles.replaceAll(stringify1, 'des_calor_vapor','calorVapor');
        stringify1 = await utiles.replaceAll(stringify1, 'des_combustible','combustibles');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pozo_tierra','pozoTierra');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sistema_frio','sistemaFrio');
        stringify1 = await utiles.replaceAll(stringify1, 'des_otro_servic','otrosServicios');
        stringify1 = await utiles.replaceAll(stringify1, 'des_plan_mant','planMtto');
        stringify1 = await utiles.replaceAll(stringify1, 'des_repuestos','repuestos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_ramos','codRamos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_tramite','claveTramite');
        detalleMaquina = JSON.parse(stringify1);
        
        
        
        stringify1 =JSON.stringify(serviciosGenerales);
        stringify1 = await utiles.replaceAll(stringify1, 'des_maquina','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_agua_desague','aguaDesague') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_electricidad','electricidad');
        stringify1 = await utiles.replaceAll(stringify1, 'des_aire_compri','airecomprimido');
        stringify1 = await utiles.replaceAll(stringify1, 'des_calor_vapor','calorVapor');
        stringify1 = await utiles.replaceAll(stringify1, 'des_combustible','combustibles');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pozo_tierra','pozoTierra');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sistema_frio','sistemaFrio');
        stringify1 = await utiles.replaceAll(stringify1, 'des_otro_servic','otrosServicios');
        stringify1 = await utiles.replaceAll(stringify1, 'des_plan_mant','planMtto');
        stringify1 = await utiles.replaceAll(stringify1, 'des_repuestos','repuestos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_ramos','codRamos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_tramite','claveTramite');
        serviciosGenerales = JSON.parse(stringify1);
        
    
        stringify1 =JSON.stringify(gestionActivos);
        stringify1 = await utiles.replaceAll(stringify1, 'des_maquina','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_agua_desague','aguaDesague') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_electricidad','electricidad');
        stringify1 = await utiles.replaceAll(stringify1, 'des_aire_compri','airecomprimido');
        stringify1 = await utiles.replaceAll(stringify1, 'des_calor_vapor','calorVapor');
        stringify1 = await utiles.replaceAll(stringify1, 'des_combustible','combustibles');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pozo_tierra','pozoTierra');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sistema_frio','sistemaFrio');
        stringify1 = await utiles.replaceAll(stringify1, 'des_otro_servic','otrosServicios');
        stringify1 = await utiles.replaceAll(stringify1, 'des_plan_mant','planMtto');
        stringify1 = await utiles.replaceAll(stringify1, 'des_repuestos','repuestos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_ramos','codRamos');
        stringify1 = await utiles.replaceAll(stringify1, 'num_tramite','claveTramite');
        gestionActivos = JSON.parse(stringify1);
        var resultado=[
             {"claveTramite":numtramite}, 
          //{"codTipoTramite":codTipoTramite}, 
             {"email":email} , 
             {fechaRegistro :fecha},
             {"ramos":{
                  "codigo":ramos,
                 "detalleMaquina":detalleMaquina.data,
                 "serviciosGenerales":serviciosGenerales.data,
                 "gestionActivos":gestionActivos.data
                }
             }];
            return {result: true,data:resultado};
    } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
}

async function paso8GetRamos(numtramite,codRamos) {
    let params;
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
  
         params = {
                TableName: RAMOS_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_ramos':codRamos
                },
                KeyConditionExpression: 'num_tramite =:num_tramite and num_ramos =:num_ramos',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items']};
}

async function RamosGet(numtramite) {
    let params;
    params = {
        TableName: RAMOS_TABLE,
        ExpressionAttributeValues: {
            ':num_tramite': numtramite
        },
        KeyConditionExpression: 'num_tramite =:num_tramite'
    }; 
        
    var result1 = await dynamoDbClient.query(params).promise() ;
    if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos '}};
    }
    return {result: true,data:result1 ['Items']};
}

module.exports = {
    paso8Upd,paso8Get,paso8Ins
}