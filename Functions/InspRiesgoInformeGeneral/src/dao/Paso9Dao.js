const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const ROBO_TABLE = process.env.ROBO_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;

async  function paso9valida(req) {
	//****** inicio validadacion ************ 
	var fechaConsulta = utiles.fechaHora();

	var valida = null;
    var valoresparam = [
    	req.codTipoTramite,req.claveTramite,req.email,req.fechaRegistro,
    	req.roboAsalto.accesoPrevio.accesos,
    	req.roboAsalto.accesoPrevio.perimetro,
    	req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
    	req.roboAsalto.proteccionContraRobo.alarmasIntrucion,
    	req.roboAsalto.proteccionContraRobo.sistemaCCTV,
    	req.roboAsalto.politicaManejoValores.descripcion
	];
	var namesparam = [
    	'codTipoTramite','claveTramite','email','fechaRegistro',
    	'accesos','perimetro','vigilanciaGuardiania',
    	'alarmasIntrucion','sistemaCCTV','descripcion'
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
             //console.log('**** resultado :',resultado);//{}
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            
            //console.log('**** error.statusCode ****** :',error.statusCode);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}


async  function paso9Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
	var seguir = await paso9valida(req);
    //console.log('**** req.fechaTransaccion :'+ req.fechaTransaccion);
	if (!seguir.result) {
         return seguir;
    }
    
    var valoresparam = [
    	req.claveTramite,req.email,
    	req.roboAsalto.accesoPrevio.accesos,
    	req.roboAsalto.accesoPrevio.perimetro,
    	req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
    	req.roboAsalto.proteccionContraRobo.alarmasIntrucion,
    	req.roboAsalto.proteccionContraRobo.sistemaCCTV,
    	req.roboAsalto.politicaManejoValores.descripcion
	];
	var namesparam = [
    	'claveTramite','email',
    	'accesos','perimetro','vigilanciaGuardiania',
    	'alarmasIntrucion','sistemaCCTV','descripcion'
	];
     var Item =  {
                    "num_tramite": req.claveTramite,
                    "num_robo" : context.awsRequestId,
					"des_accesos":req.roboAsalto.accesoPrevio.accesos,
                    "des_perimetro" :req.roboAsalto.accesoPrevio.perimetro,
                    "des_vig_guard" :req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
                    "des_alar_instrus" :req.roboAsalto.proteccionContraRobo.alarmasIntrucion,                
                    "des_sist_cctv" :req.roboAsalto.proteccionContraRobo.sistemaCCTV,
                    "des_pol_valor" :req.roboAsalto.politicaManejoValores.descripcion
                  };
     var stringify1 =JSON.stringify(Item);
         Item = JSON.parse(stringify1);
		 
	 var namescampo = ['num_tramite','num_robo','des_accesos',
			'des_perimetro','des_vig_guard','des_alar_instrus','des_sist_cctv',
			'des_pol_valor'
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
                "TableName": ROBO_TABLE
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


async  function paso9Upd(req) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;

    
    valida = await utiles.validateParametro(req.roboAsalto.codRoboAsalto,'codRobo');
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
	}
  
   var ExpressionAttributeValues =  {
		":des_accesos":req.roboAsalto.accesoPrevio.accesos,
        ":des_perimetro" :req.roboAsalto.accesoPrevio.perimetro,
        ":des_vig_guard" :req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
        ":des_alar_instrus" :req.roboAsalto.proteccionContraRobo.alarmasIntrucion,                
        ":des_sist_cctv" :req.roboAsalto.proteccionContraRobo.sistemaCCTV,
        ":des_pol_valor" :req.roboAsalto.politicaManejoValores.descripcion
     };
     
	var valoresparam = [
	    req.roboAsalto.accesoPrevio.accesos,
        req.roboAsalto.accesoPrevio.perimetro,
        req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
        req.roboAsalto.proteccionContraRobo.alarmasIntrucion,                
        req.roboAsalto.proteccionContraRobo.sistemaCCTV,
        req.roboAsalto.politicaManejoValores.descripcion
	];
	var namesparam = ['accesos','perimetro','vigilanciaGuardiania','alarmasIntrucion',
	'alarmasIntrucion','sistemaCCTV','descripcion'
	];
	var namescampo = [':des_accesos',':des_perimetro',':des_vig_guard',':des_alar_instrus',
	':des_sist_cctv',':des_pol_valor'
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
			'des_accesos =:des_accesos',
			'des_perimetro =:des_perimetro',
			'des_vig_guard =:des_vig_guard',
			'des_alar_instrus =:des_alar_instrus',
			'des_sist_cctv =:des_sist_cctv',
	        'des_pol_valor =:des_pol_valor'
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
                   TableName: ROBO_TABLE,
				   Key: {
                    num_tramite: req.claveTramite,
                    num_robo: req.roboAsalto.codRoboAsalto
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
        //console.log('**** ExpressionAttributeValues :', ExpressionAttributeValues);
	    //console.log('****result*******',result);
        return result;
}

async function paso9Get(numtramite,email) {
   
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    if (numtramite){
        var roboAsalto = await RoboGet(numtramite) ;
        var accesoPrevio = JSON.parse(JSON.stringify(roboAsalto));
        var proteccionContraRobo = JSON.parse(JSON.stringify(roboAsalto));
        var politicaManejoValores = JSON.parse(JSON.stringify(roboAsalto));
        var y;
        
        for (y of roboAsalto.data) {
            delete y.cod_acceso;
            delete y.des_obje_valor;
            delete y.cod_vigilancia;
            delete y.cod_ubicacion;
            delete y.des_otros;
            delete y.des_accesos;
            delete y.cod_perimetro;
            delete y.cod_mon_cctv;
            delete y.cod_manej_val;
            delete y.des_procedim;
            delete y.cod_sensores;
            
            delete y.des_accesos;
            delete y.des_perimetro;
            delete y.des_vig_guard;
            delete y.des_alar_instrus;
            delete y.des_sist_cctv;
            delete y.des_pol_valor;

            delete y.num_tramite;
            
         }
         for (y of accesoPrevio.data) {
            delete y.cod_acceso;
            delete y.des_obje_valor;
            delete y.cod_vigilancia;
            delete y.cod_ubicacion;
            delete y.des_otros;
            //des_perimetro
            //delete y.des_accesos;
            delete y.cod_perimetro;
            delete y.cod_mon_cctv;
            delete y.cod_manej_val;
            delete y.des_procedim;
            delete y.cod_sensores;
             
            delete y.num_robo;
            delete y.des_vig_guard;
            delete y.des_alar_instrus;
            delete y.des_sist_cctv;
            delete y.des_pol_valor;
            delete y.num_tramite;
         }
         for (y of proteccionContraRobo.data) {
            delete y.cod_acceso;
            delete y.des_obje_valor;
            delete y.cod_vigilancia;
            delete y.cod_ubicacion;
            delete y.des_otros;
            delete y.des_accesos;
            delete y.cod_perimetro;
            delete y.cod_mon_cctv;
            delete y.cod_manej_val;
            delete y.des_procedim;
            delete y.cod_sensores;
            
            delete y.num_robo;
            delete y.des_accesos;
            delete y.des_perimetro;
            //delete y.des_pol_valor;
            delete y.num_tramite;
         }

         for (y of politicaManejoValores.data) {
            delete y.cod_acceso;
            delete y.des_obje_valor;
            delete y.cod_vigilancia;
            delete y.cod_ubicacion;
            delete y.des_otros;
            delete y.des_accesos;
            delete y.cod_perimetro;
            delete y.cod_mon_cctv;
            delete y.cod_manej_val;
            delete y.des_procedim;
            delete y.cod_sensores;
             
            delete y.num_robo;
            delete y.des_accesos;
            delete y.des_perimetro;
            delete y.des_vig_guard;
            delete y.des_alar_instrus;
            delete y.des_sist_cctv;
            //delete y.des_pol_valor;
            delete y.num_tramite;
           
         }
         
        var stringify1 =JSON.stringify(accesoPrevio);
        stringify1 = await utiles.replaceAll(stringify1, 'num_robo','codRoboAsalto') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_accesos','accesos') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_perimetro','perimetro');
        stringify1 = await utiles.replaceAll(stringify1, 'des_vig_guard','vigilanciaGuardiania');
        stringify1 = await utiles.replaceAll(stringify1, 'des_alar_instrus','alarmasIntrucion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sist_cctv','sistemaCCTV');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pol_valor','descripcion');
        accesoPrevio = JSON.parse(stringify1);
        //roboAsalto = roboAsalto.data;
        
        var stringify1 =JSON.stringify(roboAsalto);
        stringify1 = await utiles.replaceAll(stringify1, 'num_robo','codRoboAsalto') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_accesos','accesos') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_perimetro','perimetro');
        stringify1 = await utiles.replaceAll(stringify1, 'des_vig_guard','vigilanciaGuardiania');
        stringify1 = await utiles.replaceAll(stringify1, 'des_alar_instrus','alarmasIntrucion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sist_cctv','sistemaCCTV');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pol_valor','descripcion');
        roboAsalto = JSON.parse(stringify1);
        
        stringify1 =JSON.stringify(proteccionContraRobo);
        stringify1 = await utiles.replaceAll(stringify1, 'num_robo','codRoboAsalto') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_accesos','accesos') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_perimetro','perimetro');
        stringify1 = await utiles.replaceAll(stringify1, 'des_vig_guard','vigilanciaGuardiania');
        stringify1 = await utiles.replaceAll(stringify1, 'des_alar_instrus','alarmasIntrucion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sist_cctv','sistemaCCTV');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pol_valor','descripcion');
        proteccionContraRobo = JSON.parse(stringify1);
        
        stringify1 =JSON.stringify(politicaManejoValores);
        stringify1 = await utiles.replaceAll(stringify1, 'num_robo','codRoboAsalto') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_accesos','accesos') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_perimetro','perimetro');
        stringify1 = await utiles.replaceAll(stringify1, 'des_vig_guard','vigilanciaGuardiania');
        stringify1 = await utiles.replaceAll(stringify1, 'des_alar_instrus','alarmasIntrucion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_sist_cctv','sistemaCCTV');
        stringify1 = await utiles.replaceAll(stringify1, 'des_pol_valor','descripcion');
        politicaManejoValores = JSON.parse(stringify1);
        
        var resultado=[
             {"claveTramite":numtramite}, 
          //{"codTipoTramite":codTipoTramite}, 
             {"email":email} , 
             {fechaRegistro :fecha},
             {"ramos":{
                  "codigo":roboAsalto.data,
                 "accesoPrevio":accesoPrevio.data,
                 "proteccionContraRobo":proteccionContraRobo.data,
                 "politicaManejoValores":politicaManejoValores.data
                }
             }];
            return {result: true,data:resultado};
    } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
}

async function paso9GetRobo(numtramite,codRobo) {
    let params;
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
  
         params = {
                TableName: ROBO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_robo':codRobo
                },
                KeyConditionExpression: 'num_tramite =:num_tramite and num_robo =:num_robo',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items']};
}

async function RoboGet(numtramite) {
    let params;
    params = {
        TableName: ROBO_TABLE,
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
    paso9Upd,paso9Get,paso9Ins
}