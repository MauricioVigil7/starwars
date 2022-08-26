const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const INCENDIO_TABLE = process.env.INCENDIO_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;

async  function paso7valida(req) {
	//****** inicio validadacion ************ 
	var fechaConsulta = utiles.fechaHora();

	var valida = null;
    var valoresparam = [
	req.codTipoTramite,req.claveTramite,req.email,req.fechaRegistro,
	req.incendio.medidasIncendio.procPropioPlanSeg,
	req.incendio.medidasIncendio.brigadaIncendio,
	req.incendio.medidasIncendio.distribucionExtintores,
	req.incendio.medidasIncendio.codBombero,
	req.incendio.deteccionIncendio.descripcion,
	req.incendio.sistemaContraIndendioNFPA72.descripcion,
	req.incendio.sistemaContraIndendioNFPA.descripcion
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email','fechaRegistro',
	'procPropioPlanSeg','brigadaIncendio','distribucionExtintores',
	'codBombero','descripcion','descripcion',
	'descripcion'
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
             await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}


async  function paso7Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
	var seguir = await paso7valida(req);
    //console.log('**** seguir :'+ seguir);
	if (!seguir.result) {
         return seguir;
    }
     var Item =  {
                    "num_tramite": req.claveTramite,
                    "num_incendio" : context.awsRequestId,
					"des_proc_prop":req.incendio.medidasIncendio.procPropioPlanSeg,
                    "des_briga_contr" :req.incendio.medidasIncendio.brigadaIncendio,
                    "des_distr_extin" :req.incendio.medidasIncendio.distribucionExtintores,
                    "cod_bomberos" :req.incendio.medidasIncendio.codBombero,                
                    "des_detec_ince" :req.incendio.deteccionIncendio.descripcion,
                    "des_sis_cont_ince_nfpa72" :req.incendio.sistemaContraIndendioNFPA72.descripcion,                  
                    "des_sis_cont_ince_nfpa" :req.incendio.sistemaContraIndendioNFPA.descripcion
                  };
     var stringify1 =JSON.stringify(Item);
         Item = JSON.parse(stringify1);
		 
		 var valoresparam = [
		     req.incendio.medidasIncendio.procPropioPlanSeg,
		     req.incendio.medidasIncendio.brigadaIncendio,
		     req.incendio.medidasIncendio.distribucionExtintores,
		     req.incendio.medidasIncendio.codBombero,
			 req.incendio.deteccionIncendio.descripcion,
			 req.incendio.sistemaContraIndendioNFPA72.descripcion,
			 req.incendio.sistemaContraIndendioNFPA.descripcion
			];
			var namesparam = ['des_proc_prop','des_briga_contr','des_distr_extin',
			'codBombero','cod_bomberos','des_detec_ince','des_sis_cont_ince_nfpa72',
			'des_sis_cont_ince_nfpa'
			];
			var namescampo = ['des_proc_prop','des_briga_contr','des_distr_extin',
			'codBombero','cod_bomberos','des_detec_ince','des_sis_cont_ince_nfpa72',
			'des_sis_cont_ince_nfpa'
			];

		for(var i = 0; i <= valoresparam.length -1; i++) {
			 valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
			 if (!valida.result) {
				  delete Item[namescampo[i]];
			 }else{
				 valida = await utiles.validarBoolean(valoresparam[i],namesparam[i]);
				 if (valida.result) {
					  Item[namescampo[i]]=valida.data.codigo;
				 }				
			 }
		}

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
                "TableName": INCENDIO_TABLE
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

async  function paso9ExpressionAtrributeIncendio(req) {
	var ExpressionAttributeValues =  {
		//"num_tramite": req.claveTramite,
        //"num_incendio" : context.awsRequestId,
		":des_proc_prop":req.incendio.medidasIncendio.procPropioPlanSeg,
        ":des_briga_contr" :req.incendio.medidasIncendio.brigadaIncendio,
        ":des_distr_extin" :req.incendio.medidasIncendio.distribucionExtintores,
        ":cod_bomberos" :req.incendio.medidasIncendio.codBombero,                
        ":des_detec_ince" :req.incendio.deteccionIncendio.descripcion,
        ":des_sis_cont_ince_nfpa72" :req.incendio.sistemaContraIndendioNFPA72.descripcion,                  
        ":des_sis_cont_ince_nfpa" :req.incendio.sistemaContraIndendioNFPA.descripcion
     };
    var stringify1 =JSON.stringify(ExpressionAttributeValues);
    ExpressionAttributeValues = JSON.parse(stringify1);
	var valoresparam = [
	    req.incendio.medidasIncendio.procPropioPlanSeg,
	    req.incendio.medidasIncendio.brigadaIncendio,
	    req.incendio.medidasIncendio.distribucionExtintores,
	    req.incendio.medidasIncendio.codBombero,
	    req.incendio.deteccionIncendio.descripcion,
	    req.incendio.sistemaContraIndendioNFPA72.descripcion,
	    req.incendio.sistemaContraIndendioNFPA.descripcion
	];
	var namesparam = ['procPropioPlanSeg','brigadaIncendio','distribucionExtintores','codBombero',
	'descripcion','descripcion','descripcion'
	];
	var namescampo = [':des_proc_prop',':des_briga_contr',':des_distr_extin',':cod_bomberos',
	':des_detec_ince',':des_sis_cont_ince_nfpa72',':des_sis_cont_ince_nfpa'
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
	 return ExpressionAttributeValues;	
}

async  function paso7Upd(req) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;

    
    valida = await utiles.validateParametro(req.incendio.medidasIncendio.codIncendio,'codIncendio');
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
	}

  // var ExpressionAttributeValues =  paso9ExpressionAtrributeIncendio(req);
   var ExpressionAttributeValues =  {
		//"num_tramite": req.claveTramite,
        //"num_incendio" : context.awsRequestId,
		":des_proc_prop":req.incendio.medidasIncendio.procPropioPlanSeg,
        ":des_briga_contr" :req.incendio.medidasIncendio.brigadaIncendio,
        ":des_distr_extin" :req.incendio.medidasIncendio.distribucionExtintores,
        ":cod_bomberos" :req.incendio.medidasIncendio.codBombero,                
        ":des_detec_ince" :req.incendio.deteccionIncendio.descripcion,
        ":des_sis_cont_ince_nfpa72" :req.incendio.sistemaContraIndendioNFPA72.descripcion,                  
        ":des_sis_cont_ince_nfpa" :req.incendio.sistemaContraIndendioNFPA.descripcion
     };
    //var stringify1 =JSON.stringify(ExpressionAttributeValues);
   // ExpressionAttributeValues = JSON.parse(stringify1);
	var valoresparam = [
	    req.incendio.medidasIncendio.procPropioPlanSeg,
	    req.incendio.medidasIncendio.brigadaIncendio,
	    req.incendio.medidasIncendio.distribucionExtintores,
	    req.incendio.medidasIncendio.codBombero,
	    req.incendio.deteccionIncendio.descripcion,
	    req.incendio.sistemaContraIndendioNFPA72.descripcion,
	    req.incendio.sistemaContraIndendioNFPA.descripcion
	];
	var namesparam = ['procPropioPlanSeg','brigadaIncendio','distribucionExtintores','codBombero',
	'descripcion','descripcion','descripcion'
	];
	var namescampo = [':des_proc_prop',':des_briga_contr',':des_distr_extin',':cod_bomberos',
	':des_detec_ince',':des_sis_cont_ince_nfpa72',':des_sis_cont_ince_nfpa'
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
  // var stringify1 =JSON.stringify(ExpressionAttributeValues);
  // ExpressionAttributeValues = JSON.parse(stringify1);
	
   var upd="set ";
   var registros = [];
   var valoresparam = [
	    req.incendio.medidasIncendio.procPropioPlanSeg,
	    req.incendio.medidasIncendio.brigadaIncendio,
	    req.incendio.medidasIncendio.distribucionExtintores,
	    req.incendio.medidasIncendio.codBombero,
	    req.incendio.deteccionIncendio.descripcion,
	    req.incendio.sistemaContraIndendioNFPA72.descripcion,
	    req.incendio.sistemaContraIndendioNFPA.descripcion
	];
	var namesparam = ['procPropioPlanSeg','brigadaIncendio','distribucionExtintores','codBombero',
	'descripcion','descripcion','descripcion'
	];
	var namescampo = ['des_proc_prop','des_briga_contr','des_distr_extin','codBombero',
	'des_detec_ince','des_sis_cont_ince_nfpa72','des_sis_cont_ince_nfpa'
	];
   //codIncendio
	var namesregistro = [
			'des_proc_prop =:des_proc_prop',
			'des_briga_contr =:des_briga_contr',
			'des_distr_extin =:des_distr_extin',
			'cod_bomberos =:cod_bomberos',
	        'des_detec_ince =:des_detec_ince',
	        'des_sis_cont_ince_nfpa72 =:des_sis_cont_ince_nfpa72',
	        'des_sis_cont_ince_nfpa =:des_sis_cont_ince_nfpa'
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
                   TableName: INCENDIO_TABLE,
				   Key: {
                    num_tramite: req.claveTramite,
                    num_incendio: req.incendio.medidasIncendio.codIncendio
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
	    //console.log('****result*******',result);
        return result;
    
}
/*
async  function paso9IncendioUpd(req) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
    var seguir = await paso7valida(req);
	    console.log('**** seguir :'+ seguir);
	if (!seguir.result) {
         return seguir;
    }
	var incendio = await paso9GetIncendio(req.claveTramite,req.codIncendio);
    if (!incendio.result)
        return {result: false, errores:{ codigo:'3',mensaje:'codigo de incendio '+ req.codIncendio + 'no existe'},fechaConsulta:fechaConsulta};

    
    var ExpressionAttributeValues = await paso9ExpressionAtrribute(req);
			
		 valida = await utiles.validateDate(req.fechaRegistro);
         if (!valida.result) {
              return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
         }
        var upd = await paso7Upd(req);
        var params = {
            "TransactItems": [
             {
                Update: {
                   TableName: INCENDIO_TABLE,
				   Key: {
                    num_tramite: req.claveTramite,
                    num_incendio: req.codIncendio
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
    try {
         await  dynamoDbClient.transactWrite(params).promise();
         return {result: true,data:{codigo:'1',mensaje:'Paso 9 Incendio se realizo correctamente'},fechaConsulta:fechaConsulta};
    } catch (error) {
        console.log(error);
        return {result: false, errores:{ codigo:'2',mensaje:'Could not insert Paso 9 Incendio :'+error},fechaConsulta:fechaConsulta};
    }
}
*/

async function paso7Get(numtramite,email) {
   
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    if (numtramite){
        var incendio = await IncendioGet(numtramite) ;
        var stringify1 =JSON.stringify(incendio);
        
        var medidasIncendio = JSON.parse(JSON.stringify(incendio));
        var deteccionIncendio = JSON.parse(JSON.stringify(incendio));
        var sistemaContraIndendioNFPA72 = JSON.parse(JSON.stringify(incendio));
        var sistemaContraIndendioNFPA = JSON.parse(JSON.stringify(incendio));
        var y;
        for (y of medidasIncendio.data) {
            //delete y.cod_brigada;
            delete y.cod_monitoreo;
            delete y.cod_pulsador;
            delete y.cod_pqs;
            delete y.cod_gabinetes;
            delete y.cod_instalacion;
            delete y.cod_photo_beam;
            delete y.cod_rociadores;
            delete y.cod_bomba;
            delete y.cod_sensor_ion;
            delete y.cod_sensor_temp;
            delete y.cod_procedimiento;
            delete y.cod_no_posee;
            delete y.cod_orden;
           // delete y.cod_no_posee;
            delete y.des_detec_ince;
            delete y.des_sis_cont_ince_nfpa72;
            delete y.des_sis_cont_ince_nfpa;
            delete y.num_incendio;
            delete y.num_tramite;
         }
         for (y of deteccionIncendio.data) {
          delete y.cod_brigada;
          delete y.cod_monitoreo;
          delete y.cod_pulsador;
          delete y.cod_pqs;
          delete y.cod_gabinetes;
          delete y.cod_instalacion;
          delete y.cod_photo_beam;
          delete y.cod_rociadores;
          delete y.cod_bomba;
          delete y.cod_sensor_ion;
          delete y.cod_sensor_temp;
          delete y.cod_procedimiento;
          delete y.cod_no_posee;
          delete y.cod_orden;

            delete y.des_proc_prop;
            delete y.des_briga_contr;
            delete y.des_distr_extin;
            delete y.cod_bomberos;
            delete y.des_sis_cont_ince_nfpa72;
            delete y.des_sis_cont_ince_nfpa;
            delete y.num_incendio;
            delete y.num_tramite;
         }
         for (y of sistemaContraIndendioNFPA72.data) {
          delete y.cod_brigada;
          delete y.cod_monitoreo;
          delete y.cod_pulsador;
          delete y.cod_pqs;
          delete y.cod_gabinetes;
          delete y.cod_instalacion;
          delete y.cod_photo_beam;
          delete y.cod_rociadores;
          delete y.cod_bomba;
          delete y.cod_sensor_ion;
          delete y.cod_sensor_temp;
          delete y.cod_procedimiento;
          delete y.cod_no_posee;
          delete y.cod_orden;

            delete y.des_proc_prop;
            delete y.des_briga_contr;
            delete y.des_distr_extin;
            delete y.cod_bomberos;
            delete y.des_detec_ince;
            delete y.des_sis_cont_ince_nfpa;
            delete y.num_incendio;
            delete y.num_tramite;
         }
         for (y of sistemaContraIndendioNFPA.data) {
          delete y.cod_brigada;
          delete y.cod_monitoreo;
          delete y.cod_pulsador;
          delete y.cod_pqs;
          delete y.cod_gabinetes;
          delete y.cod_instalacion;
          delete y.cod_photo_beam;
          delete y.cod_rociadores;
          delete y.cod_bomba;
          delete y.cod_sensor_ion;
          delete y.cod_sensor_temp;
          delete y.cod_procedimiento;
          delete y.cod_no_posee;
          delete y.cod_orden;

            delete y.des_proc_prop;
            delete y.des_briga_contr;
            delete y.des_distr_extin;
            delete y.cod_bomberos;
            delete y.des_detec_ince;
            delete y.des_sis_cont_ince_nfpa72;
            delete y.num_incendio;
            delete y.num_tramite;
         }
         
         
        stringify1 =JSON.stringify(medidasIncendio);
        stringify1 = await utiles.replaceAll(stringify1, 'des_proc_prop','procPropioPlanSeg') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_briga_contr','brigadaIncendio');
        stringify1 = await utiles.replaceAll(stringify1, 'des_distr_extin','distribucionExtintores');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_bomberos','codBomberos');
        stringify1 = await utiles.replaceAll(stringify1, 'des_detec_ince','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa72','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'num_incendio','codIncendio');
        medidasIncendio = JSON.parse(stringify1);
        
        stringify1 =JSON.stringify(deteccionIncendio);
        stringify1 = await utiles.replaceAll(stringify1, 'des_proc_prop','procPropioPlanSeg') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_briga_contr','codMonitoreo');
        stringify1 = await utiles.replaceAll(stringify1, 'des_distr_extin','pulsadorManual');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_bomberos','codBomberos');
        stringify1 = await utiles.replaceAll(stringify1, 'des_detec_ince','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa72','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'num_incendio','codIncendio');
        deteccionIncendio = JSON.parse(stringify1);
    
        stringify1 =JSON.stringify(sistemaContraIndendioNFPA72);
        stringify1 = await utiles.replaceAll(stringify1, 'des_proc_prop','procPropioPlanSeg') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_briga_contr','codMonitoreo');
        stringify1 = await utiles.replaceAll(stringify1, 'des_distr_extin','pulsadorManual');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_bomberos','codBomberos');
        stringify1 = await utiles.replaceAll(stringify1, 'des_detec_ince','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa72','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'num_incendio','codIncendio');
        sistemaContraIndendioNFPA72 = JSON.parse(stringify1);
    
       stringify1 =JSON.stringify(sistemaContraIndendioNFPA);
        stringify1 = await utiles.replaceAll(stringify1, 'des_proc_prop','procPropioPlanSeg') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_briga_contr','codMonitoreo');
        stringify1 = await utiles.replaceAll(stringify1, 'des_distr_extin','pulsadorManual');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_bomberos','codBomberos');
        stringify1 = await utiles.replaceAll(stringify1, 'des_detec_ince','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa72','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sis_cont_ince_nfpa','descripcion');
        stringify1 = await utiles.replaceAll(stringify1, 'num_incendio','codIncendio');
        sistemaContraIndendioNFPA = JSON.parse(stringify1);
    
    
          var resultado=[
             {"claveTramite":numtramite}, 
          //{"codTipoTramite":codTipoTramite}, 
             {"email":email} , 
             {fechaRegistro :fecha},
             {"incendio":{
                 "medidasIncendio":medidasIncendio.data,
                 "deteccionIncendio":deteccionIncendio.data,
                 "sistemaContraIndendioNFPA72":sistemaContraIndendioNFPA72.data,
                 "sistemaContraIndendioNFPA":sistemaContraIndendioNFPA.data
                }
             }];
            return {result: true,data:resultado};
    } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
}

async function paso9GetIncendio(numtramite,codIncendio) {
    let params;
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
  
         params = {
                TableName: INCENDIO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_incendio':codIncendio
                },
                /* ExpressionAttributeNames: {
                    "#num_tramite": "num_tramite",
                    "#num_incendio": "num_incendio"
                },*/
                //FilterExpression: '#num_tramite =:num_tramite and #num_incendio =:num_incendio',
                KeyConditionExpression: 'num_tramite =:num_tramite and num_incendio =:num_incendio',
                
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+INCENDIO_TABLE},fechaConsulta:fechaConsulta};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
 
}

async function IncendioGet(numtramite) {
    let params;
    params = {
        TableName: INCENDIO_TABLE,
        ExpressionAttributeValues: {
            ':num_tramite': numtramite
        },
        KeyConditionExpression: 'num_tramite =:num_tramite'
    }; 
        
    var result1 = await dynamoDbClient.query(params).promise() ;
    if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+INCENDIO_TABLE}};
    }
    return {result: true,data:result1 ['Items']};
}

module.exports = {
    paso7Upd,paso7Get,paso7Ins
}