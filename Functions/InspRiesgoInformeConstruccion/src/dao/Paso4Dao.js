const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
//const repository = require('../dao/Reposytory');

const RIESGO_TABLE = process.env.TABLE_DETALLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;

async  function paso4Ins(req) {

    console.info(" paso4Ins(req): " , req);
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
	if(req.fechaRegistro==undefined){
		req.fechaRegistro=req.fechaActualizacion;
	}
	if(req.fechaActualizacion==undefined){
		req.fechaActualizacion=req.fechaRegistro;
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

    var TransactItems = [];
//**************RIESGO***************
     var Item = {
    	"num_tramite" : req.claveTramite,
		"num_riesgo": req.codRiesgo,
		"des_terremoto":req.riesgosNaturales.descTerremoto,
    	"des_inundacion":req.riesgosNaturales.descInundacion,
    	"des_lluvia":req.riesgosNaturales.descLluvia,
    	"des_maremoto":req.riesgosNaturales.descMaremoto,
    	"des_geologico":req.riesgosTerreno.descGeologicos,
    	"des_geotecnic":req.riesgosTerreno.descGeotecnicos,
    	"des_exposic":req.exposicionSituacionEntorno.descExposicion,
    	"des_incendio":req.incendio.descIncendio,
    	"des_perd_ben":req.perdidaBeneficio.descBeneficio,
    	"des_resp_civil":req.resposabilidadCivil.descRespCivil,
        "ind_del" : IND_DEL		
     };
	
     valida = await utiles.validateParametro(req.riesgosNaturales.descTerremoto,'descTerremoto');
    if (!valida.result) {
             delete Item['des_terremoto'];
     }
     valida = await utiles.validateParametro(req.riesgosNaturales.descInundacion,'descInundacion');
    if (!valida.result) {
             delete Item['des_inundacion'];
     }
     valida = await utiles.validateParametro(req.riesgosNaturales.descLluvia,'descLluvia');
    if (!valida.result) {
             delete Item['des_lluvia'];
     }
     valida = await utiles.validateParametro(req.riesgosNaturales.descMaremoto,'descMaremoto');
    if (!valida.result) {
             delete Item['des_maremoto'];
     }
      valida = await utiles.validateParametro(req.riesgosTerreno.descGeologicos,'descGeologicos');
    if (!valida.result) {
             delete Item['des_geologico'];
     }
	 valida = await utiles.validateParametro(req.riesgosTerreno.descGeotecnicos,'descGeotecnicos');
    if (!valida.result) {
             delete Item['des_geotecnic'];
     }
	 valida = await utiles.validateParametro(req.exposicionSituacionEntorno.descExposicion,'descExposicion');
    if (!valida.result) {
             delete Item['des_exposic'];
     }
	 valida = await utiles.validateParametro(req.incendio.descIncendio,'descIncendio');
     if (!valida.result) {
             delete Item['des_incendio'];
     }
	 valida = await utiles.validateParametro(req.perdidaBeneficio.descBeneficio,'descBeneficio');
     if (!valida.result) {
             delete Item['des_perd_ben'];
     }
	 valida = await utiles.validateParametro(req.resposabilidadCivil.descRespCivil,'descRespCivil');
    if (!valida.result) {
             delete Item['des_resp_civil'];
     }
    Put = {TableName: RIESGO_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
	console.info(" paso4Ins paso p: " , p);
	//var obj = JSON.parse(Item);
    //var length = Object.keys(obj).length;
    //console.log('**** length final ********',length);
	//if(length > 3){
		TransactItems.push(p);
	//}
    //console.log('**** TransactItems final ********',TransactItems);
//**************RIESGO***************

//**************INSPECCION****************
    var  ExpressionAttributeValues= {
        ":fec_modif": fechaHora,
        //":cod_tipinforme":req.codTipoTramite,
        ":fec_actualizacion":req.fechaRegistro
    };
    var setter="set ";
    var registros = [];
    registros.push("fec_modif = :fec_modif");
    registros.push("fec_actualizacion = :fec_actualizacion");
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
            UpdateExpression: setter,
            ExpressionAttributeValues: ExpressionAttributeValues,
            //ConditionExpression: "cod_tipinforme = :cod_tipinforme",
            returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
        },
    };
    //console.log('*****upd*******',upd);
    TransactItems.push(upd);
    //console.log('****TransactItems*******',TransactItems);
//**************INSPECCION****************
    var params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('****result*******',result);
    return result;

}


async  function getRegistroInspeccion(registros,numtramite,email,ExpressionAttributeValues) {
	
     var upd="set ";
	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
         }
         
     var key = { "num_tramite": numtramite,"correo_insp": email};
     var Update = {
                      TableName: INSPECCIONES_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
     Update ={Update};
     var p = JSON.stringify(Update);
     p = await JSON.parse(p);
	 return p;
}


async  function paso4Upd(req) {

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
	if(req.fechaRegistro==undefined){
		req.fechaRegistro=req.fechaActualizacion;
	}
	if(req.fechaActualizacion==undefined){
		req.fechaActualizacion=req.fechaRegistro;
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

//**************RIESGO***************
     var registros = [];
     var TransactItems = [];
     var params=null;
     var ExpressionAttributeRiesgo = {
		":des_terremoto":req.riesgosNaturales.descTerremoto,
    	":des_inundacion":req.riesgosNaturales.descInundacion,
    	":des_lluvia":req.riesgosNaturales.descLluvia,
    	":des_maremoto":req.riesgosNaturales.descMaremoto,
    	":des_geologico":req.riesgosTerreno.descGeologicos,
    	":des_geotecnic":req.riesgosTerreno.descGeotecnicos,
    	":des_exposic":req.exposicionSituacionEntorno.descExposicion,
    	":des_incendio":req.incendio.descIncendio,
    	":des_perd_ben":req.perdidaBeneficio.descBeneficio,
    	":des_resp_civil":req.resposabilidadCivil.descRespCivil
     };
	 
     valida = await utiles.validateParametro(req.riesgosNaturales.descTerremoto,'descTerremoto');
     if (valida.result) {
             registros.push("des_terremoto = :des_terremoto");
     }else{ delete ExpressionAttributeRiesgo[':des_terremoto'];}
	 
     valida = await utiles.validateParametro(req.riesgosNaturales.descInundacion,'descInundacion');
     if (valida.result) {
			 registros.push("des_inundacion = :des_inundacion");
     }else{ delete ExpressionAttributeRiesgo[':des_inundacion'];}
	 
    valida = await utiles.validateParametro(req.riesgosNaturales.descLluvia,'descLluvia');
    if (valida.result) {
		     registros.push("des_lluvia = :des_lluvia");
    }else{ delete ExpressionAttributeRiesgo[':des_lluvia'];}
	 
    valida = await utiles.validateParametro(req.riesgosNaturales.descMaremoto,'descMaremoto');
    if (valida.result) {
		     registros.push("des_maremoto = :des_maremoto");
    }else{ delete ExpressionAttributeRiesgo[':des_maremoto'];}
	 
    valida = await utiles.validateParametro(req.riesgosTerreno.descGeologicos,'descGeologicos');
    if (valida.result) {
		     registros.push("des_geologico = :des_geologico");
    }else{ delete ExpressionAttributeRiesgo[':des_geologico'];}
	
	valida = await utiles.validateParametro(req.riesgosTerreno.descGeotecnicos,'descGeotecnicos');
     if (valida.result) {
		     registros.push("des_geotecnic = :des_geotecnic");
     }else{ delete ExpressionAttributeRiesgo[':des_geotecnic'];}
	 
	 valida = await utiles.validateParametro(req.exposicionSituacionEntorno.descExposicion,'descExposicion');
     if (valida.result) {
		     registros.push("des_exposic = :des_exposic");
     }else{ delete ExpressionAttributeRiesgo[':des_exposic'];}
	 
	 valida = await utiles.validateParametro(req.incendio.descIncendio,'descIncendio');
     if (valida.result) {
		     registros.push("des_incendio = :des_incendio");
     }else{ delete ExpressionAttributeRiesgo[':des_incendio'];}
	 
	 valida = await utiles.validateParametro(req.perdidaBeneficio.descBeneficio,'descBeneficio');
     if (valida.result) {
		     registros.push("des_perd_ben = :des_perd_ben");
     }else{ delete ExpressionAttributeRiesgo[':des_perd_ben'];}
	 
	valida = await utiles.validateParametro(req.resposabilidadCivil.descRespCivil,'descRespCivil');
    if (valida.result) {
		     registros.push("des_resp_civil = :des_resp_civil");
    }else{ delete ExpressionAttributeRiesgo[':des_resp_civil'];}
	 
	var upd="set ";
	for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
    }
	var key = { "num_tramite": req.claveTramite,"num_riesgo": req.codRiesgo};
	var Update = {
            TableName: RIESGO_TABLE,
            Key: key,
            UpdateExpression: upd,
            ExpressionAttributeValues: ExpressionAttributeRiesgo,
            // ConditionExpression: "num_tramite = :num_tramite",
            returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
    };
    Update ={Update};
    var p = JSON.stringify(Update);
    p = await JSON.parse(p);
	//var obj = JSON.parse(ExpressionAttributeRiesgo);
    //var length = Object.keys(obj).length;
	//if(length > 1){
		TransactItems.push(p);
	//}
    //console.log('**** TransactItems final ********',TransactItems);
//**************RIESGO***************

//**************INSPECCION****************
    var  ExpressionAttributeValues= {
        ":fec_modif": fechaHora,
        //":cod_tipinforme":req.codTipoTramite,
        ":fec_actualizacion":req.fechaRegistro
    };
    var setter="set ";
    var registros = [];
    registros.push("fec_modif = :fec_modif");
    registros.push("fec_actualizacion = :fec_actualizacion");
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
            UpdateExpression: setter,
            ExpressionAttributeValues: ExpressionAttributeValues,
           // ConditionExpression: "cod_tipinforme = :cod_tipinforme",
            returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
        },
    };
    //console.log('*****upd*******',upd);
    TransactItems.push(upd);

//**************INSPECCION****************
    params = { "TransactItems":TransactItems};
    //console.log('**** TransactItems final ********',TransactItems);
    var result =  await save(params);
	//console.log('****result*******',result);
    return result;

}

async function RiesgoGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    if (numtramite){
         params = {
                TableName: TABLE_DETALLE,
                ExpressionAttributeValues: {
                    ':num_tramite':  numtramite,
                    ':ind_del': vigente,
                },
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
        };  
        var result = await dynamoDbClient.query(params).promise() ;
        if (result ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        return {result: true,data:result['Items']};
    } 
    return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}


async function paso4Get(numtramite,email) {
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    //console.log('****numtramite*******',numtramite);
    //console.log('****email*******',email);
    if (email && numtramite){
    var y,codtipotramite,fechaRegistro;  //InspeccionGet(numtramite,email) 
    var listainspeccion = await InspeccionGet(numtramite,email) ;
    //console.log('****listainspeccion*******',listainspeccion);
    //des_observacion
    for (y of listainspeccion.data) {
               delete y.des_observacion;
               delete y.mto_edificacion;
               //observacion=y.des_observacion;
               delete y.des_observacion;
               delete y.des_direccion;
               delete y.cod_inspector;
               delete y.nom_inspector;
               delete y.fec_inspeccion;
               delete y.hor_inspeccion;
               delete y.mto_existencia;
               delete y.cod_estado;
               delete y.num_latitud;
               delete y.colindantes;
               delete y.correo_insp;
               delete y.mto_maquinaria;
               delete y.descripcion;
               delete y.cod_estructura;
               delete y.riosQuebradas;
               delete y.cod_uso;
               delete y.mto_lucro;
               delete y.mto_total;
               codtipotramite=y.cod_tipinforme;
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_actualizacion;
               fechaRegistro = y.fec_solicitud;
               delete y.fec_ven_insp;
               
           }
    
    //console.log('*** 7 *****')  ;
    var riesgo = await RiesgoGet(numtramite);
    //console.log('*** riesgo *****',riesgo)  ;
	for ( y of riesgo.data) {
           delete y.ind_del;
           delete y.num_tramite;
    }
    stringify =JSON.stringify(riesgo);
	stringify = await utiles.replaceAll(stringify, 'num_riesgo','codRiesgo');
    stringify = await utiles.replaceAll(stringify, 'des_terremoto','descTerremoto') ;
    stringify = await utiles.replaceAll(stringify, 'des_inundacion','descInundacion');
    stringify = await utiles.replaceAll(stringify, 'des_lluvia','descLluvia');
    stringify = await utiles.replaceAll(stringify, 'des_maremoto','descMaremoto');
    stringify = await utiles.replaceAll(stringify, 'des_geologico','descGeologicos');
    stringify = await utiles.replaceAll(stringify, 'des_geotecnic','descGeotecnicos');
	stringify = await utiles.replaceAll(stringify, 'des_exposic','descExposicion');
	stringify = await utiles.replaceAll(stringify, 'des_incendio','descIncendio');
	stringify = await utiles.replaceAll(stringify, 'des_perd_ben','descBeneficio');
    stringify = await utiles.replaceAll(stringify, 'des_resp_civil','descRespCivil');
    
 
    var riesgo1 = JSON.parse(stringify);
    //console.log('*** riesgo1  *****',riesgo1);
    var riesgo2 = JSON.parse(stringify);
    var riesgo3 = JSON.parse(stringify);
    var riesgo4 = JSON.parse(stringify);
    var riesgo5 = JSON.parse(stringify);
    var riesgo6 = JSON.parse(stringify);
    var riesgo7 = JSON.parse(stringify);
    
    var y;
    for (y of riesgo1.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.descTerremoto;
        delete y.descInundacion;
        delete y.descLluvia;
        delete y.descMaremoto;
        delete y.descGeologicos;
        delete y.descGeotecnicos;
        delete y.descExposicion;
        delete y.descIncendio;
        delete y.descBeneficio;
        delete y.descRespCivil;
    }
    

    for (y of riesgo2.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.codRiesgo;
        //delete y.descTerremoto;
        //delete y.descInundacion;
        //delete y.descLluvia;
        //delete y.descMaremoto;
        delete y.descGeologicos;
        delete y.descGeotecnicos;
        delete y.descExposicion;
        delete y.descIncendio;
        delete y.descBeneficio;
        delete y.descRespCivil;
    }

    for (y of riesgo3.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.codRiesgo;
        delete y.descTerremoto;
        delete y.descInundacion;
        delete y.descLluvia;
        delete y.descMaremoto;
        //delete y.descGeologicos;
        //delete y.descGeotecnicos;
        delete y.descExposicion;
        delete y.descIncendio;
        delete y.descBeneficio;
        delete y.descRespCivil;
    }

    for (y of riesgo4.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.codRiesgo;
        delete y.descTerremoto;
        delete y.descInundacion;
        delete y.descLluvia;
        delete y.descMaremoto;
        delete y.descGeologicos;
        delete y.descGeotecnicos;
        //delete y.descExposicion;
        delete y.descIncendio;
        delete y.descBeneficio;
        delete y.descRespCivil;
    }

    for (y of riesgo5.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.codRiesgo;
        delete y.descTerremoto;
        delete y.descInundacion;
        delete y.descLluvia;
        delete y.descMaremoto;
        delete y.descGeologicos;
        delete y.descGeotecnicos;
        delete y.descExposicion;
        //delete y.descIncendio;
        delete y.descBeneficio;
        delete y.descRespCivil;
    }

    for (y of riesgo6.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.codRiesgo;
        delete y.descTerremoto;
        delete y.descInundacion;
        delete y.descLluvia;
        delete y.descMaremoto;
        delete y.descGeologicos;
        delete y.descGeotecnicos;
        delete y.descExposicion;
        delete y.descIncendio;
        //delete y.descBeneficio;
        delete y.descRespCivil;
    }

    for (y of riesgo7.data) {
        delete y.des_huelga_cc;
        delete y.des_robo;
        delete y.des_rot_maq;

        delete y.codRiesgo;
        delete y.descTerremoto;
        delete y.descInundacion;
        delete y.descLluvia;
        delete y.descMaremoto;
        delete y.descGeologicos;
        delete y.descGeotecnicos;
        delete y.descExposicion;
        delete y.descIncendio;
        delete y.descBeneficio;
        //delete y.descRespCivil;
    }

    
    var codRiesgo = riesgo1.data;
    var riesgosNaturales = riesgo2.data;
    var riesgosTerreno = riesgo3.data;
    var exposicionSituacionEntorno = riesgo4.data;
    var incendio = riesgo5.data;
    var perdidaBeneficio = riesgo6.data;
    var resposabilidadCivil = riesgo7.data;

    var analisisRiesgo = {
        "analisisRiesgo":{
            codRiesgo,riesgosNaturales,riesgosTerreno,
            exposicionSituacionEntorno,incendio,
            perdidaBeneficio,resposabilidadCivil
        }
    }

    var resultado=[
        {"claveTramite":numtramite}, 
        {"codTipoTramite":codtipotramite}, 
        {"email":email} , 
        {"fechaRegistro" :fechaRegistro},
        analisisRiesgo
        ];

        //console.log('*** resultado *****',resultado)  ;
  return {result: true,data:resultado};


}
 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Inspeccion'},fechaConsulta:fechaConsulta};
}

async function InspeccionGet(numtramite,email) {
    
    let params;
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
     return {result: false,errores: {codigo:'2',mensaje:'parametro ingresado no valido'}};
}



async function RiesgoGet(numtramite) {
    let params;
    if (numtramite){
         params = {
                TableName: RIESGO_TABLE,
                ExpressionAttributeValues: {
                   ':num_tramite' :numtramite,
                   ':ind_del' :IND_DEL,
                },
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
        const {Items} = await dynamoDbClient.query(params).promise();
        //console.log('****Items***',Items);
        if (Items.length > 0) {
            var stringify =JSON.stringify(Items);
            var datos  = JSON.parse(stringify);
            return {result: true,data:datos};
        }
        
         return {result: false,errores: {codigo:'3',mensaje:'No se encontraron datos'}};
    } 
     return {result: false,errores: {codigo:'2',mensaje:'parametro ingresado no valido'}};
}



async function paso5InspeccionGet(numtramite,email,codTipoTramite) {
    
    let params;
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
     //****** inicio validadacion ************ 
    var valida = await utiles.validateParametro(numtramite);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(email);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validarEmail(email);
    if (!valida.result) {
          return valida;
    }
    
    valida = await utiles.validateParametro(codTipoTramite);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
   //****** fin validadacion ************
    
    if (email && numtramite&&codTipoTramite){
         params = {
                TableName: INSPECCIONES_TABLE,
                ExpressionAttributeValues: {
                   ':correo_insp' :email,
                   ':num_tramite' :numtramite,
                   ':cod_tipinforme' :codTipoTramite,
                },
                FilterExpression: 'cod_tipinforme = :cod_tipinforme',
                KeyConditionExpression: 'correo_insp =:correo_insp and num_tramite =:num_tramite',
                
            };
        const {Items} = await dynamoDbClient.query(params).promise();
        if (Items.length > 0) {
            var stringify =JSON.stringify(Items);
            var datos  = JSON.parse(stringify);
            return {result: true,data:datos};
        }
         return {result: false,errores: {codigo:'3',mensaje:'No se encontraron datos en Inspeccion'},fechaConsulta:fechaConsulta};
        
    } 
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados Paso 5 '},fechaConsulta:fechaConsulta};

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




async function entrevistadoGet(numtramite,numentrevistado) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    var keycondicion = 'num_tramite =:num_tramite and num_entrevistado =:num_entrevistado';
    var ExpressionAttributeValues= {
                    ':num_tramite': numtramite,
                    ':num_entrevistado': numentrevistado,
                    ':ind_del': vigente,
                 };
    
    if (numentrevistado=="-1"){
         delete ExpressionAttributeValues[':num_entrevistado'] ;
         keycondicion = 'num_tramite =:num_tramite';
    }   
     params = {
                TableName: ENTREVISTADO_TABLE,
                ExpressionAttributeValues: ExpressionAttributeValues,
                //ConditionExpression: "ind_del = '0'",
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: keycondicion,
            };
    
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'},fechaConsulta:fechaConsulta};
        }
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
     
   
}

module.exports = {
    save,paso5InspeccionGet,paso4Ins,paso4Upd,paso4Get
}