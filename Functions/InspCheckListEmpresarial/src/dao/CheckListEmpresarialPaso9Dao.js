const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const INCENDIO_TABLE = process.env.INCENDIO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;

async  function paso9valida(req) {
	//****** inicio validadacion ************ 
	req.ordenLimpieza=req.incendio.medidaPrevencionPoteccionPasiva.ordenLimpieza;
    req.procTrabCaliente=req.incendio.medidaPrevencionPoteccionPasiva.procTrabCaliente;
    req.instElectProtegida=req.incendio.medidaPrevencionPoteccionPasiva.instElectProtegida;
    req.codBrigada=req.incendio.medidaPrevencionPoteccionPasiva.codBrigada;
    
	req.pQS=req.medidasProteccion.extintores.pQS;
    req.noPosee=req.medidasProteccion.extintores.noPosee;
    
    req.pulsadorManual=req.deteccion.sensores.pulsadorManual;
    req.sensorIonico=req.deteccion.sensores.sensorIonico;
    req.sensorTemperatura=req.deteccion.sensores.sensorTemperatura;
    req.photoBeam=req.deteccion.sensores.photoBeam;
    
    req.codMonitoreo=req.monitoreo.codElemento;
    req.codBomba=req.bomba.codElemento;
    req.codGabinetes=req.gabinetes.codElemento;
    req.codRociadores=req.rociadores.codElemento;
    req.codBomberos=req.bomberos.codElemento;

    //console.log('**** req.codMonitoreo :', req.codMonitoreo);
	var fechaConsulta = utiles.fechaHora();
	var valida = null;
	if(req.fechaRegistro==undefined){
    req.fechaRegistro=req.fechaActualizacion;
  }
  if(req.fechaActualizacion==undefined){
    req.fechaActualizacion=req.fechaRegistro;
  }
    var valoresparam = [
	req.codTipoTramite,req.claveTramite,req.email,
	req.codMonitoreo,req.codBomba,req.codGabinetes,
	req.codRociadores,req.codBomberos,req.fechaRegistro,
	req.sensorIonico,req.pulsadorManual,req.photoBeam,
	req.sensorTemperatura
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email',
	'codMonitoreo','codBomba','codGabinetes',
	'codRociadores','codBomberos','fechaRegistro',
	'sensorIonico','pulsadorManual','photoBeam',
	'sensorTemperatura'
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


async  function paso9Incendio(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
	var seguir = await paso9valida(req);
    //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
    }
     var Item =  {
                    "num_tramite": req.claveTramite,
                    "num_incendio" : req.codIncendio,
					"cod_orden":req.ordenLimpieza,
                    "cod_procedimiento" :req.procTrabCaliente,
                    "cod_instalacion" :req.instElectProtegida,
                    "cod_brigada" :req.codBrigada,                
                    "cod_pqs" :req.pQS,
                    "cod_no_posee" :req.noPosee,                  
                    
                    "cod_pulsador" :req.pulsadorManual,
                    "cod_sensor_ion" :req.sensorIonico,
                    "cod_sensor_temp" :req.sensorTemperatura,
                    "cod_photo_beam" :req.photoBeam,
                    "cod_monitoreo" :req.codMonitoreo,
                    "cod_bomba" :req.codBomba,
                    "cod_gabinetes" :req.codGabinetes,
                    "cod_rociadores" :req.codRociadores,
                    "cod_bomberos" :req.codBomberos
                  };
     var stringify1 =JSON.stringify(Item);
         Item = JSON.parse(stringify1);
		 
		 var valoresparam = [req.ordenLimpieza,req.procTrabCaliente,req.instElectProtegida,req.codBrigada,
				req.pQS,req.noPosee,
			req.pulsadorManual,req.sensorIonico,req.sensorTemperatura,req.photoBeam,
			req.codMonitoreo,req.codBomba,req.codGabinetes,req.codRociadores,req.codBomberos
			];
			var namesparam = ['ordenLimpieza','procTrabCaliente','instElectProtegida','codBrigada','pQS','noPosee',
			'pulsadorManual','sensorIonico','sensorTemperatura','photoBeam',
			'codMonitoreo','codBomba','codGabinetes','codRociadores','codBomberos'
			];
			var namescampo = ['cod_orden','cod_procedimiento','cod_instalacion','cod_brigada',
      'cod_pqs','cod_no_posee',
			'cod_pulsador','cod_sensor_ion','cod_sensor_temp','cod_photo_beam',
			'cod_monitoreo','cod_bomba','cod_gabinetes','cod_rociadores','cod_bomberos'
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
	//console.log('**** result :',result);
    return result;
}
async  function paso9ExpressionAtrribute(req) {
	var ExpressionAttributeValues =  {
					":cod_orden":req.ordenLimpieza,
                    ":cod_procedimiento" :req.procTrabCaliente,
                    ":cod_instalacion" :req.instElectProtegida,
                    ":cod_brigada" :req.codBrigada,                
                    ":cod_pqs" :req.pQS,
                    ":cod_no_posee" :req.noPosee,                  
                    ":cod_pulsador":req.pulsadorManual,
                    ":cod_sensor_ion" :req.sensorIonico,
                    ":cod_sensor_temp" :req.sensorTemperatura,
                    ":cod_photo_beam" :req.photoBeam,                
                    ":cod_monitoreo" :req.codMonitoreo,
                    ":cod_bomba" :req.codBomba,
                    ":cod_gabinetes" :req.codGabinetes,
                    ":cod_rociadores" :req.codRociadores,
                    ":cod_bomberos" :req.codBomberos
                  };
    var stringify1 =JSON.stringify(ExpressionAttributeValues);
         ExpressionAttributeValues = JSON.parse(stringify1);
	
   
			var valoresparam = [req.ordenLimpieza,req.procTrabCaliente,req.instElectProtegida,req.codBrigada,
				req.pQS,req.noPosee,
			req.pulsadorManual,req.sensorIonico,req.sensorTemperatura,req.photoBeam,
			req.codMonitoreo,req.codBomba,req.codGabinetes,req.codRociadores,req.codBomberos
			];
			var namesparam = ['ordenLimpieza','procTrabCaliente','instElectProtegida','codBrigada','pQS','noPosee',
			'pulsadorManual','sensorIonico','sensorTemperatura','photoBeam',
			'codMonitoreo','codBomba','codGabinetes','codRociadores','codBomberos'
			];
			var namescampo = [':cod_orden',':cod_procedimiento',':cod_instalacion',':cod_brigada',':cod_pqs',':cod_no_posee',
			':cod_pulsador',':cod_sensor_ion',':cod_sensor_temp',':cod_photo_beam',
			':cod_monitoreo',':cod_bomba',':cod_gabinetes',':cod_rociadores',':cod_bomberos'
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

async  function paso9Upd(req) {
	var ExpressionAttributeValues =  {
					":cod_orden":req.ordenLimpieza,
                    ":cod_procedimiento" :req.procTrabCaliente,
                    ":cod_instalacion" :req.instElectProtegida,
                    ":cod_brigada" :req.codBrigada,                
                    ":cod_pqs" :req.pQS,
					":cod_no_posee" :req.noPosee,
                    
                    ":cod_pulsador":req.pulsadorManual,
                    ":cod_sensor_ion" :req.sensorIonico,
                    ":cod_sensor_temp" :req.sensorTemperatura,
                    ":cod_photo_beam" :req.photoBeam,                
                    ":cod_monitoreo" :req.codMonitoreo,
                    ":cod_bomba" :req.codBomba,
                    ":cod_gabinetes" :req.codGabinetes,
                    ":cod_rociadores" :req.codRociadores,
                    ":cod_bomberos" :req.codBomberos
                  };
    var stringify1 =JSON.stringify(ExpressionAttributeValues);
         ExpressionAttributeValues = JSON.parse(stringify1);
	
   var upd="set ";
   var registros = [];
			var valoresparam = [req.ordenLimpieza,req.procTrabCaliente,req.instElectProtegida,req.codBrigada,
				req.pQS,req.noPosee,
			req.pulsadorManual,req.sensorIonico,req.sensorTemperatura,req.photoBeam,
			req.codMonitoreo,req.codBomba,req.codGabinetes,req.codRociadores,req.codBomberos
			];
			var namesparam = ['ordenLimpieza','procTrabCaliente','instElectProtegida','codBrigada','pQS','noPosee',
			'pulsadorManual','sensorIonico','sensorTemperatura','photoBeam',
			'codMonitoreo','codBomba','codGabinetes','codRociadores','codBomberos'
			];
			var namescampo = ['cod_orden','cod_procedimiento',
      'cod_instalacion','cod_brigada',':cod_pqs','cod_no_posee',
			'cod_pulsador','cod_sensor_ion','cod_sensor_temp','cod_photo_beam',
			'cod_monitoreo','cod_bomba','cod_gabinetes','cod_rociadores','cod_bomberos'
			];
			var namesregistro = [
			"cod_orden = :cod_orden","cod_procedimiento = :cod_procedimiento","cod_instalacion = :cod_instalacion",
			"cod_brigada = :cod_brigada","cod_pqs = :cod_pqs","cod_no_posee = :cod_no_posee",
			"cod_pulsador = :cod_pulsador","cod_sensor_ion = :cod_sensor_ion","cod_sensor_temp = :cod_sensor_temp",
			"cod_photo_beam = :cod_photo_beam",
			"cod_monitoreo = :cod_monitoreo","cod_bomba = :cod_bomba","cod_gabinetes = :cod_gabinetes",
			"cod_rociadores = :cod_rociadores","cod_bomberos = :cod_bomberos"
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
			
	 return upd;
}

async  function paso9IncendioUpd(req) {
    //console.log('**** dao req :',req);
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
    var seguir = await paso9valida(req);
	  //console.log('**** seguir :', seguir.result);
    //console.log('**** req :',req);
	if (!seguir.result) {
         return seguir;
    }
/*	var incendio = await paso9GetIncendio(req.claveTramite,req.codIncendio);
    if (!incendio.result)
        return {result: false, errores:{ codigo:'3',mensaje:'codigo de incendio '+ req.codIncendio + 'no existe'},fechaConsulta:fechaConsulta};
*/
     //   "codIncendio" :"55fff2de-da21-49d1-b7e0-66ef62849342"
    // console.log('**** req.incendio.codIncendio :', req.incendio.codIncendio);
        valida = await utiles.validateParametro(req.incendio.codIncendio,'codIncendio');
        if (!valida.result) {
              return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
        }
        var ExpressionAttributeValues = await paso9ExpressionAtrribute(req);
      //  console.log('**** ExpressionAttributeValues :', ExpressionAttributeValues);
		valida = await utiles.validateDate(req.fechaRegistro);
        if (!valida.result) {
              return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
        }
        var upd = await paso9Upd(req);
        //console.log('**** upd :', upd);
        var params = {
            "TransactItems": [
             {
                Update: {
                   TableName: INCENDIO_TABLE,
				   Key: {
                    num_tramite: req.claveTramite,
                    num_incendio: req.incendio.codIncendio
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
                    ":fec_actualizacion": req.fechaActualizacion,
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

async function paso9IncendioGet(numtramite,email,codTipoTramite) {
   
     var fechaHora = await utiles.fechaHora();
     var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    if (numtramite){
    
        var edi = await paso9ListaGet(numtramite,"-1") ;
        var stringify1 =JSON.stringify(edi);
        stringify1 = await utiles.replaceAll(stringify1, 'cod_brigada','codBrigada') ;
        stringify1 = await utiles.replaceAll(stringify1, 'cod_monitoreo','codMonitoreo');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_pulsador','pulsadorManual');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_pqs','pQS');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_bomberos','codBomberos');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_gabinetes','codGabinetes');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_photo_beam','photoBeam');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_instalacion','instElectProtegida');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_rociadores','codRociadores');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_bomba','codBomba');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_sensor_ion','sensorIonico');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_procedimiento','procTrabCaliente');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_no_posee','noPosee');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_orden','ordenLimpieza');
        stringify1 = await utiles.replaceAll(stringify1, 'num_incendio','codIncendio');
        stringify1 = await utiles.replaceAll(stringify1, 'cod_sensor_temp','sensorTemperatura');
        
        var almacenamiento = JSON.parse(stringify1);
        var y;
         for (y of almacenamiento.data) {
            delete y.num_tramite;
            delete y.des_distr_extin;
            delete y.des_sis_cont_ince_nfpa72;
            delete y.des_detec_ince;
            delete y.des_proc_prop;
            delete y.des_briga_contr;
            delete y.des_sis_cont_ince_nfpa;
          }
          var resultado=[
              {"claveTramite":numtramite}, 
              {"codTipoTramite":codTipoTramite}, 
              {"email":email} , 
              {fechaRegistro :fecha},
              {"incendio":almacenamiento.data}];
            return {result: true,data:resultado,fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'},fechaConsulta:fechaConsulta};
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

async function paso9ListaGet(numtramite,numramos) {
    let params;
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
  
          params = {
                TableName: INCENDIO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_ramos' :numramos
                },
                 KeyConditionExpression: 'num_tramite =:num_tramite and num_ramos = :num_ramos',
            };
          if (numramos=="-1"){
                params = {
                        TableName: INCENDIO_TABLE,
                        ExpressionAttributeValues: {
                            ':num_tramite': numtramite
                        },
                        KeyConditionExpression: 'num_tramite =:num_tramite',
                    }; 
               }
        
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+INCENDIO_TABLE},fechaConsulta:fechaConsulta};
        }
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
 
}

module.exports = {
    paso9IncendioUpd,paso9IncendioGet,paso9ListaGet,
    paso9Incendio,paso9GetIncendio
}