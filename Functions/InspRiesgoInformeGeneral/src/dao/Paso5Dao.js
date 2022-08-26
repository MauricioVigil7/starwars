const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
//const repository = require('../dao/Reposytory');

const ENTREVISTADO_TABLE = process.env.ENTREVISTADO_TABLE;
const PERDIDA_TABLE = process.env.PERDIDA_TABLE;
const MATRIZ_TABLE = process.env.MATRIZ_TABLE;
const RIESGO_TABLE = process.env.RIESGO_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const IND_DEL = process.env.IND_DEL;

async  function paso5Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    let stringify =JSON.stringify(req.listaEntrevistados);

    var lista = JSON.parse(stringify); 
    var	valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
     valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
     valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }

    var trxInsp = await getTransactItemsInspeccion(req);
    var TransactItems = [];
    TransactItems.push(trxInsp);

    var Put = {};
    var Puts="";
    var params=null;
    var Item = {
             "num_tramite" : "",
             "num_entrevistado": "",
             "nom_entrevistado": "",
             "des_cargo":"",
             "des_correo":"",
             "des_telefono":"",
             "ind_del" :""
         };
    
    
    var cont=0;
    for(var x in lista){
        cont++;
        Item.num_entrevistado= context.awsRequestId.concat(cont);
        Item.num_tramite=req.claveTramite;
        Item.nom_entrevistado=lista[x].nombreEntrevistado;
        Item.des_cargo=lista[x].cargo;
        Item.des_correo=lista[x].correo;
        Item.des_telefono=lista[x].telefono;
        Item.ind_del= IND_DEL;
        valida = await utiles.validateParametro(lista[x].nombreEntrevistado,'nombreEntrevistado');
        if (!valida.result) {
             delete Item['nom_entrevistado'];
        }
        valida = await utiles.validateParametro(lista[x].correo,'correo');
        if(!valida.result){
           delete Item['des_correo'];  
        }
        valida = await utiles.validateParametro(lista[x].cargo,'cargo');
        if(!valida.result){
           delete Item['des_cargo'];  
        }
        valida = await utiles.validateParametro(lista[x].telefono,'telefono');
        if(!valida.result){
           delete Item['des_telefono'];  
        }
        Put = {TableName: ENTREVISTADO_TABLE, Item};
        Puts= {Put} ;
        var p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
    }
  //  console.log('**** TransactItems 1 ********',TransactItems);
    
    stringify =JSON.stringify(req.listDeterEscenarioPerdida);
   // stringify = await utiles.replaceAll(stringify, 'id','num_id') ;
   // stringify = await utiles.replaceAll(stringify, 'escenario','des_escenario');
   // stringify = await utiles.replaceAll(stringify, 'afectacion','des_perdida');

    var listDeterEscenarioPerdida = JSON.parse(stringify); 
    //var cont=0;
    for(var x in listDeterEscenarioPerdida){
         Item = {
             "num_tramite" : req.claveTramite,
             "num_perdida": listDeterEscenarioPerdida[x].id,
             "des_escenario": listDeterEscenarioPerdida[x].escenario,
             "des_perdida":listDeterEscenarioPerdida[x].afectacion,
             "ind_del" :IND_DEL
         };

        valida = await utiles.validateParametro(listDeterEscenarioPerdida[x].escenario,'escenario');
        if (!valida.result) {
             delete Item['des_escenario'];
        }
        valida = await utiles.validateParametro(listDeterEscenarioPerdida[x].afectacion,'afectacion');
        if (!valida.result) {
             delete Item['des_perdida'];
        }
        
        Put = {TableName: PERDIDA_TABLE, Item};
        Puts= {Put} ;
        p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
    }
    
   
 //**************MATRIZ***************   
     Item = {
             "num_tramite" : req.claveTramite,
             "num_matriz": context.awsRequestId,
             "cod_cord_matriz": req.evalRiesgoPerdida.coordenadaMatriz,
             "cod_tip_riesgo": req.evalRiesgoPerdida.valorMatriz,
             "ind_del" : IND_DEL
     };
     valida = await utiles.validateParametro(req.evalRiesgoPerdida.coordenadaMatriz,'coordenadaMatriz');
    if (!valida.result) {
             delete Item['cod_cord_matriz'];
     }
     valida = await utiles.validateParametro(req.evalRiesgoPerdida.valorMatriz,'valorMatriz');
    if (!valida.result) {
             delete Item['cod_tip_riesgo'];
     }
    Put = {TableName: MATRIZ_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
    TransactItems.push(p);
//**************MATRIZ***************

//**************RIESGO***************
     Item = {
             "num_tramite" : req.claveTramite,
             "num_riesgo": context.awsRequestId,
             "des_incendio": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.incendio,
             "des_rot_maq": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.roturaMaquina,
             "des_robo": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.robo3D,
             "des_perd_ben": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.perdidaBeneficio,
             "des_huelga_cc": req.riesgoPropPerdidaBeneficio.riesgoPolitico.huelgaCc,
             "ind_del" : IND_DEL
     };
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.incendio,'incendio');
    if (!valida.result) {
             delete Item['des_incendio'];
     }
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.roturaMaquina,'roturaMaquina');
    if (!valida.result) {
             delete Item['des_rot_maq'];
     }
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.robo3D,'des_robo');
    if (!valida.result) {
             delete Item['des_robo'];
     }
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.perdidaBeneficio,'perdidaBeneficio');
    if (!valida.result) {
             delete Item['des_perd_ben'];
     }
      valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPolitico.huelgaCc,'huelgaCc');
    if (!valida.result) {
             delete Item['des_huelga_cc'];
     }
    Put = {TableName: RIESGO_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
    TransactItems.push(p);
    //console.log('**** TransactItems final ********',TransactItems);
//**************RIESGO***************
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('****result*******',result);
    return result;

}

async  function getTransactItemsInspeccion(req) {
	//****** inicio validadacion ************ 
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = null;
	var TransactItems = [];
    var valoresparam = [
        req.codTipoTramite,
        req.fechaRegistro,
    	req.datosGenerales.razonSocial, 
    	req.datosGenerales.actividadLocal,
    	req.informacionSBS.numeroPisos,
    	req.informacionSBS.numeroSotanos,
    	req.informacionSBS.codTipoEstructura,
    	req.informacionSBS.codTipoUso,
    	req.informacionSBS.coordLatitud,
    	req.informacionSBS.coordLongitud,
    	req.valoresDeclarados.montoContenido,
    	req.valoresDeclarados.montoEdificacion,
    	req.valoresDeclarados.montoMaquinaria,
    	req.valoresDeclarados.montoExistencias,
    	req.valoresDeclarados.montoLucroCesante,
    	req.valoresDeclarados.total,
    	req.observacion,
    	req.perdidaMaximaProbable.montoMaximoSujeto.pml,
    	req.perdidaMaximaProbable.montoMaximoSujeto.eml,
    	req.estCunplGarantiaDadaPoliza.garantia,
    	req.estCunplGarantiaDadaPoliza.estatus,
    	req.estCunplGarantiaDadaPoliza.justificacion,
	];
	//console.log('****pml*******',req.perdidaMaximaProbable.montoMaximoSujeto.pml);
	//console.log('****eml*******',req.perdidaMaximaProbable.montoMaximoSujeto.eml);
	//console.log('****garantia*******',req.estCunplGarantiaDadaPoliza.garantia);
	//console.log('****estatus*******',req.estCunplGarantiaDadaPoliza.estatus);
	//console.log('****justificacion*******',req.estCunplGarantiaDadaPoliza.justificacion);
	var namesparam = [
	':codTipoTramite',
	':fechaRegistro',':razonSocial', ':actividadLocal',
	':numeroPisos',':numeroSotanos',':codTipoEstructura',':codTipoUso',':coordLatitud',
	':coordLongitud',':montoContenido',':montoEdificacion',':montoMaquinaria',':montoExistencias',':montoLucroCesante',
	':total',':observacion',
	':pml',':eml',':garantia',':estatus',':justificacion'
	];
	var columnsparam = [
	'cod_tipinforme =:cod_tipinforme',
	'fec_actualizacion =:fec_actualizacion',
	'nom_razsocial =:nom_razsocial', 
	'actividad_local =:actividad_local',
	'num_piso =:num_piso',
	'num_sotano =:num_sotano',
	'cod_estructura =:cod_estructura',
	'cod_uso =:cod_uso',
	'num_latitud =:num_latitud',
	'num_longitud =:num_longitud',
	'mto_contenido =:mto_contenido',
	'mto_edificacion =:mto_edificacion',
	'mto_maquinaria =:mto_maquinaria',
	'mto_existencia =:mto_existencia',
	'mto_lucro =:mto_lucro',
	'mto_total =:mto_total',
	'des_observacion =:des_observacion',
	'porcen_pml =:porcen_pml',
	'porcen_eml =:porcen_eml',
	'des_garantia =:des_garantia',
	'cod_estatus =:cod_estatus',
	'des_justificacion =:des_justificacion'
	];
    var ExpressionAttributeValues=
     {
        ":cod_tipinforme": req.codTipoTramite,
        ":fec_actualizacion": req.fechaRegistro,
        ":nom_razsocial": req.datosGenerales.razonSocial,
        ":actividad_local": req.datosGenerales.actividadLocal,
        ":num_piso": req.informacionSBS.numeroPisos,
        ":num_sotano": req.informacionSBS.numeroSotanos,
        ":cod_estructura": req.informacionSBS.codTipoEstructura,
        ":cod_uso": req.informacionSBS.codTipoUso,
        ":num_latitud": req.informacionSBS.coordLatitud,
        ":num_longitud": req.informacionSBS.coordLongitud,
        ":mto_contenido":req.valoresDeclarados.montoContenido,
        ":mto_edificacion": req.valoresDeclarados.montoEdificacion,
        ":mto_maquinaria": req.valoresDeclarados.montoMaquinaria,
        ":mto_existencia": req.valoresDeclarados.montoExistencias,
        ":mto_lucro": req.valoresDeclarados.montoLucroCesante,
        ":mto_total": req.valoresDeclarados.total,
        ":des_observacion": req.observacion,
        ":porcen_pml": req.perdidaMaximaProbable.montoMaximoSujeto.pml,
        ":porcen_eml": req.perdidaMaximaProbable.montoMaximoSujeto.eml,
        ":des_garantia": req.estCunplGarantiaDadaPoliza.garantia,
        ":cod_estatus": req.estCunplGarantiaDadaPoliza.estatus,
        ":des_justificacion": req.estCunplGarantiaDadaPoliza.justificacion
     };
    var registros = [];
	for(var i = 0; i <= valoresparam.length -1; i++) {
	   valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
    	if (!valida.result) {
    	    	 //console.log('**** delete[i] ********',namesparam[i]);
    	    delete ExpressionAttributeValues[namesparam[i]];
                    //return {result: valida.result, errores:valida.errores};
    	}else{
    		 registros.push(columnsparam[i]);
    		 //console.log('**** columnsparam[i] ********',columnsparam[i]);
    	}
    }
    
    var upd="set ";
	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
         }
         
     var key = { "num_tramite": req.claveTramite,"correo_insp": req.email};
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
     //console.log('**** p ********',p);
	 return p;
    
   //var p = await getRegistroInspeccion(registros,req.email,req.claveTramite,ExpressionAttributeValues);
   //console.log('**** p ********',p);
   //return p;
    
}


async  function getRegistroEntrevistado(req) {
    
    if(req.listaEntrevistados== undefined){
        return undefined;
    }
    let stringify =JSON.stringify(req.listaEntrevistados);
    var lista = JSON.parse(stringify);
    var registros = [];
    var TransactItems = [];
    var ExpressionAttributeValues = {
             ":nom_entrevistado": "",
             ":des_cargo": "",
             ":des_correo": "",
             ":des_telefono": ""
    };
	for(var x in lista){
        registros = [];
        ExpressionAttributeValues = {
             ":nom_entrevistado": lista[x].nombreEntrevistado,
             ":des_cargo": lista[x].cargo,
             ":des_correo": lista[x].correo,
             ":des_telefono": lista[x].telefono
        };
        

        var valida = await utiles.validateParametro(lista[x].nombreEntrevistado,'nombreEntrevistado');
        if (valida.result) {
               registros.push("nom_entrevistado = :nom_entrevistado");
        }else{ delete ExpressionAttributeValues[':nom_entrevistado'];}
        
        valida = await utiles.validateParametro(lista[x].cargo,'cargo');
        if (valida.result) {
               registros.push("des_cargo = :des_cargo");
        }else{ delete ExpressionAttributeValues[':des_cargo'];} 
        
        valida = await utiles.validateParametro(lista[x].telefono,'telefono');
        if (valida.result) {
               registros.push("des_telefono = :des_telefono");
        }else{ delete ExpressionAttributeValues[':des_telefono'];} 
        
        valida = await utiles.validateParametro(lista[x].correo,'correo');
        if (valida.result) {
               registros.push("des_correo = :des_correo");
        }else{ delete ExpressionAttributeValues[':des_correo'];} 
        
     var upd="set ";
	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
         }
         //console.log('**** ExpressionAttributeValues[i] ********',ExpressionAttributeValues);
     var key = { "num_tramite": req.claveTramite,"num_entrevistado": lista[x].codEntrevistado};
     //console.log('**** key[i] ********',key);
     var Update = {
                      TableName: ENTREVISTADO_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
     Update ={Update};
     var p = JSON.stringify(Update);
     p = await JSON.parse(p);
     TransactItems.push(p);
	 
	}
	return TransactItems;
}

async  function getRegistroPerdida(req) {
    
    if(req.listDeterEscenarioPerdida== undefined){
        return undefined;
    }
    var TransactItems = [];
    let stringify =JSON.stringify(req.listDeterEscenarioPerdida);
    var lista = JSON.parse(stringify);
    var registros = [];
    var ExpressionAttributeValues = {
             ":des_escenario": "",
             ":des_perdida": ""
    };
	for(var x in lista){
        registros = [];
        ExpressionAttributeValues = {
             ":des_escenario": lista[x].escenario,
             ":des_perdida": lista[x].afectacion
        };
        var valida = await utiles.validateParametro(lista[x].escenario,'escenario');
        if (valida.result) {
               registros.push("des_escenario = :des_escenario");
        }else{ delete ExpressionAttributeValues[':des_escenario'];}
        
        valida = await utiles.validateParametro(lista[x].afectacion,'afectacion');
        if (valida.result) {
               registros.push("des_perdida = :des_perdida");
        }else{ delete ExpressionAttributeValues[':des_perdida'];} 
      //  TransactItems.push(p);
    
	
     var upd="set ";
	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
         }
         
     var key = { "num_tramite": req.claveTramite,"num_perdida": lista[x].codPerdida};
     var Update = {
                      TableName: PERDIDA_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
     Update ={Update};
     var p = JSON.stringify(Update);
     p = await JSON.parse(p);
     //console.log('**********p*********:',p);
     TransactItems.push(p)
     
	}
	 return TransactItems;
}

async  function PerdidasGet(numtramite) {
    
    let params;
    if (numtramite){
         params = {
                TableName: PERDIDA_TABLE,
                ExpressionAttributeValues: {
                   ':num_tramite' :numtramite,
                   ':ind_del' :IND_DEL,
                },
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
        const {Items} = await dynamoDbClient.query(params).promise();
        if (Items.length > 0) {
            var stringify =JSON.stringify(Items);
            var datos  = JSON.parse(stringify);
            return {result: true,data:datos};
        }
         return {result: false,errores: {codigo:'3',mensaje:'No se encontraron datos'}};
    } 
     return {result: false,errores: {codigo:'2',mensaje:'parametro ingresado no valido'}};
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


async  function paso5Upd(req) {


    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;

    var	valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
     valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
     valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
    valida = await utiles.validateParametro(req.fechaActualizacion,'fechaActualizacion');
    if (!valida.result) {
         return {result: valida.result, errores:valida.errores};
     }
     
     
/*
    let stringify =JSON.stringify(req.listaEntrevistados);
    stringify = await utiles.replaceAll(stringify, 'codEntrevistado','num_entrevistado') ;
    stringify = await utiles.replaceAll(stringify, 'nombreEntrevistado','nom_entrevistado');
    stringify = await utiles.replaceAll(stringify, 'cargo','des_cargo');
    //stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
    
    var lista = JSON.parse(stringify);
    var valida = await utiles.IsJsonString(stringify);
    if (!valida.result) {
          return valida;
    }
*/  
    var TransactItems = [];
    
    var params=null;
	var upd="";
   // var lista = JSON.parse(stringify); 
   // //console.log('lista',lista);
	//TransactItems = await getRegistroEntrevistado(req);
	var listentrevistado = await getRegistroEntrevistado(req);
	
	//console.log('***listentrevistado*****',listentrevistado);
	if( listentrevistado.length > 0){
	    TransactItems = listentrevistado;  
	}
   
    var trxInsp = await getTransactItemsInspeccion(req);
    TransactItems.push(trxInsp);
   	
	var p = await getRegistroPerdida(req);
	//console.log('***getRegistroPerdida*****',p);
	if( p != undefined){
	    TransactItems=TransactItems.concat(p);  
	}
	//console.log('***getRegistroPerdida*****',TransactItems);
	//**************MATRIZ***************   
	var registros = [];
    var ExpressionAttributeValues = {
             ":cod_cord_matriz": req.evalRiesgoPerdida.coordenadaMatriz,
             ":cod_tip_riesgo": req.evalRiesgoPerdida.valorMatriz
    };
        
    var valida = await utiles.validateParametro(req.evalRiesgoPerdida.coordenadaMatriz,'coordenadaMatriz');
    if (!valida.result) {
             delete ExpressionAttributeValues['cod_cord_matriz'];
     }else { registros.push('cod_cord_matriz =:cod_cord_matriz');}
     valida = await utiles.validateParametro(req.evalRiesgoPerdida.valorMatriz,'valorMatriz');
    if (!valida.result) {
             delete ExpressionAttributeValues['cod_tip_riesgo'];
     } else { registros.push('cod_tip_riesgo =:cod_tip_riesgo');}
    var upd="set ";
	for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
    }
     var key = { "num_tramite": req.claveTramite,"num_matriz": req.evalRiesgoPerdida.codMatriz};
     //console.log('***key*****',key);
     //console.log('***ExpressionAttributeValues*****',ExpressionAttributeValues);
     //console.log('***upd*****',upd);
     var Update = {
                      TableName: MATRIZ_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
     Update ={Update};
     var p = JSON.stringify(Update);
     p = await JSON.parse(p);
    TransactItems.push(p);
    
//**************MATRIZ***************

//**************RIESGO***************   
	var registros = [];
    var ExpressionAttributeValues = {
             ":des_incendio": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.incendio,
             ":des_rot_maq": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.roturaMaquina,
             ":des_robo": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.robo3D,
             ":des_perd_ben": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.perdidaBeneficio,
             ":des_huelga_cc": req.riesgoPropPerdidaBeneficio.riesgoPolitico.huelgaCc
    };
        
    var valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.incendio,'incendio');
    if (valida.result) {
         registros.push("des_incendio = :des_incendio");
    }else{ delete ExpressionAttributeValues[':des_incendio'];}
        
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.roturaMaquina,'incendio');
    if (valida.result) {
         registros.push("des_rot_maq = :des_rot_maq");
    }else{ delete ExpressionAttributeValues[':des_rot_maq'];}
      
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.robo3D,'robo3D');
    if (valida.result) {
         registros.push("des_robo = :des_robo");
    }else{ delete ExpressionAttributeValues[':des_robo'];}
     
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPropiedad.perdidaBeneficio,'perdidaBeneficio');
    if (valida.result) {
         registros.push("des_perd_ben = :des_perd_ben");
    }else{ delete ExpressionAttributeValues[':des_perd_ben'];}
     
     valida = await utiles.validateParametro(req.riesgoPropPerdidaBeneficio.riesgoPolitico.des_huelga_cc,'des_huelga_cc');
    if (valida.result) {
         registros.push("des_huelga_cc = :des_huelga_cc");
    }else{ delete ExpressionAttributeValues[':des_huelga_cc'];}
     
    
    var upd="set ";
	for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
    }
     
     var key = { "num_tramite": req.claveTramite,"num_riesgo": req.riesgoPropPerdidaBeneficio.riesgoPropiedad.codRiesgo};
     var Update = {
                      TableName: RIESGO_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
     Update ={Update};
     var p = JSON.stringify(Update);
     p = await JSON.parse(p);
	
    TransactItems.push(p);
    
//**************RIESGO***************	
    
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('****result*******',result);
    return result;

}

async function paso5Get(numtramite,email) {
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    //console.log('****numtramite*******',numtramite);
    //console.log('****email*******',email);
    if (email && numtramite){
    var y,x,observacion,codtipotramite;  //InspeccionGet(numtramite,email) 
    var listainspeccion = await InspeccionGet(numtramite,email) ;
    //console.log('****listainspeccion*******',listainspeccion);
    //des_observacion
    for (y of listainspeccion.data) {
                //delete y.num_piso;
               //delete y.mto_edificacion;
               observacion=y.des_observacion;
               delete y.des_observacion;
               delete y.des_direccion;
               delete y.cod_inspector;
               delete y.nom_inspector;
               delete y.fec_inspeccion;
               delete y.hor_inspeccion;
               //delete y.mto_existencia;
               delete y.cod_estado;
               delete y.num_latitud;
               delete y.colindantes;
               //delete y.correo_insp;
               //delete y.mto_maquinaria;
               delete y.descripcion;
               //delete y.cod_estructura;
               delete y.riosQuebradas;
               //delete y.cod_uso;
               //delete y.mto_lucro;
               //delete y.mto_total;
               //delete y.cod_tipinforme;
               codtipotramite=y.cod_tipinforme;
               //delete y.num_sotano;
               delete y.fec_modif;
               //delete y.num_longitud;
               //delete y.num_tramite;
               delete y.fec_actualizacion;
               //delete y.fec_solicitud;
               //delete y.fec_ven_insp;
               
           }
    //var datosGeneralesIni= null;
    var datosGeneralesIni=JSON.parse(JSON.stringify(listainspeccion));
    var informacionSBSIni=JSON.parse(JSON.stringify(listainspeccion));
    var valoresDeclarados=JSON.parse(JSON.stringify(listainspeccion));
    
    var estCunplGarantiaDadaPoliza= JSON.parse(JSON.stringify(listainspeccion));
    //console.log('*** estCunplGarantiaDadaPoliza *****',estCunplGarantiaDadaPoliza) ;
    //console.log('*** 1 *****') ;
    var perdidaMaximaProbable=listainspeccion;
    for ( y of perdidaMaximaProbable.data) {
           delete y.ind_del;
           delete y.mto_contenido;
           delete y.num_tramite;
           delete y.actividad_local;
           delete y.nom_razsocial;
           delete y.num_latitud;
           delete y.cod_uso;
           delete y.num_sotano;
           delete y.actividad_local;
           delete y.num_longitud;
           delete y.num_piso;
           delete y.mto_maquinaria;
           delete y.mto_edificacion;
           delete y.des_garantia;
           delete y.des_observacion;
           delete y.des_justificacion;
           delete y.mto_existencia;
           delete y.mto_lucro;
           delete y.mto_total;
           delete y.cod_estatus;
           delete y.correo_insp;
           delete y.cod_tipInforme;
           delete y.nom_razsocial;
           delete y.cod_estructura;
           delete y.fec_solicitud;
           delete y.fec_ven_insp;

           delete y.des_sumario;
           delete y.des_estructura;
           delete y.des_nue_inver;
           delete y.des_mant;
           delete y.des_general;
           delete y.des_edif_inst;
           
        }
        
        for ( y of datosGeneralesIni.data) {
           delete y.ind_del;
           delete y.mto_contenido;
           delete y.num_tramite;
           delete y.porcen_eml;
           delete y.porcen_pml;
           delete y.num_latitud;
           delete y.cod_uso;
           delete y.num_sotano;
           delete y.num_longitud;
           delete y.num_piso;
           delete y.mto_maquinaria;
           delete y.mto_edificacion;
           delete y.des_garantia;
           delete y.des_observacion;
           delete y.des_justificacion;
           delete y.mto_existencia;
           delete y.mto_lucro;
           delete y.mto_total;
           delete y.cod_estatus;
           delete y.correo_insp;
           delete y.cod_tipinforme;
           delete y.nom_razsocial;
           delete y.cod_estructura;
           delete y.fec_solicitud;
           delete y.fec_ven_insp;

           delete y.des_sumario;
           delete y.des_estructura;
           delete y.des_nue_inver;
           delete y.des_mant;
           delete y.des_general;
           delete y.des_edif_inst;
        }
    
        
        //console.log('*** 5 *****')  ;
    stringify =JSON.stringify(perdidaMaximaProbable.data);
    stringify = await utiles.replaceAll(stringify, 'porcen_pml','pml') ;
    stringify = await utiles.replaceAll(stringify, 'porcen_eml','eml');
    perdidaMaximaProbable = JSON.parse(stringify);
    
    for ( y of estCunplGarantiaDadaPoliza.data) {
           delete y.mto_contenido;
           delete y.ind_del;
           delete y.num_tramite;
           delete y.actividad_local;
           delete y.nom_razsocial;
           delete y.num_latitud;
           delete y.cod_uso;
           delete y.num_sotano;
           delete y.actividad_local;
           delete y.num_longitud;
           delete y.num_piso;
           delete y.mto_maquinaria;
           delete y.mto_edificacion;
           delete y.porcen_eml;
           delete y.mto_existencia;
           delete y.porcen_pml;
           delete y.mto_lucro;
           delete y.mto_total;
           delete y.cod_estatus;
           delete y.correo_insp;
           delete y.cod_tipinforme;
           delete y.nom_razsocial;
           delete y.cod_estructura;
           delete y.fec_solicitud;
           delete y.fec_ven_insp;

           delete y.des_sumario;
           delete y.des_estructura;
           delete y.des_nue_inver;
           delete y.des_mant;
           delete y.des_general;
           delete y.des_edif_inst;
        }

    //console.log('*** 1 *****') ;
    
    var stringify =JSON.stringify(estCunplGarantiaDadaPoliza.data);
    stringify = await utiles.replaceAll(stringify, 'des_garantia','garantia') ;
    stringify = await utiles.replaceAll(stringify, 'cod_estatus','estatus');
    stringify = await utiles.replaceAll(stringify, 'des_justificacion','justificacion');
    estCunplGarantiaDadaPoliza = JSON.parse(stringify);
    
    
    //console.log('*** 2 *****');
    stringify =JSON.stringify(datosGeneralesIni);
    stringify = await utiles.replaceAll(stringify, 'actividad_local','actividadLocal') ;
    stringify = await utiles.replaceAll(stringify, 'nom_razsocial','razonSocial');
    datosGeneralesIni = JSON.parse(stringify);
    //console.log('*** 3 *****');
    for ( y of informacionSBSIni.data) {
           delete y.ind_del;
           delete y.mto_contenido;
           delete y.num_tramite;
           delete y.actividad_local;
           //delete y.nom_razsocial;
           delete y.mto_existencia;
           delete y.porcen_eml;
           delete y.num_tramite;
           delete y.actividad_local;
           delete y.cod_estatus;
           delete y.mto_edificacion;
           delete y.porcen_eml;
           delete y.porcen_pml;
           delete y.des_garantia;
           delete y.des_observacion;
           delete y.des_justificacion;
           delete y.mto_existencia;
           delete y.mto_lucro;
           delete y.mto_total;
           delete y.cod_estatus;
           delete y.correo_insp;
           delete y.cod_tipinforme;
           delete y.nom_razsocial;
           delete y.mto_contenido;
           delete y.fec_solicitud;
           delete y.fec_ven_insp;
           delete y.correo_insp;
           delete y.cod_estatus;
           delete y.mto_maquinaria;
           //delete y.correo_insp;
           delete y.des_sumario;
           delete y.des_estructura;
           delete y.des_nue_inver;
           delete y.des_mant;
           delete y.des_general;
           delete y.des_edif_inst;
        }
   
    stringify =JSON.stringify(informacionSBSIni);
    stringify = await utiles.replaceAll(stringify, 'num_piso','numeroPisos') ;
    stringify = await utiles.replaceAll(stringify, 'num_latitud','coordLatitud');
    stringify = await utiles.replaceAll(stringify, 'cod_estructura','codTipoEstructura');
    stringify = await utiles.replaceAll(stringify, 'cod_uso','codTipoUso');
    stringify = await utiles.replaceAll(stringify, 'num_longitud','coordLongitud');
    stringify = await utiles.replaceAll(stringify, 'num_sotano','numeroSotanos');
    informacionSBSIni = JSON.parse(stringify);
    //console.log('*** 4 *****')  ;
     for ( y of valoresDeclarados.data) {
           delete y.ind_del;
           delete y.des_sumario;
           delete y.des_estructura;
           delete y.des_nue_inver;
           delete y.des_mant;
           delete y.des_general;
           delete y.des_edif_inst;
           
           //delete y.mto_contenido;
           delete y.num_tramite;
           delete y.actividad_local;
           delete y.nom_razsocial;
           delete y.num_latitud;
           delete y.cod_uso;
           delete y.num_sotano;
           delete y.actividad_local;
           delete y.num_longitud;
           delete y.num_piso;
           delete y.porcen_eml;
           delete y.porcen_pml;
           delete y.des_garantia;
           delete y.des_observacion;
           delete y.des_justificacion;
           //delete y.mto_existencia;
           //delete y.mto_lucro;
           //delete y.mto_total;
           delete y.cod_estatus;
           delete y.correo_insp;
           delete y.cod_tipinforme;
           delete y.nom_razsocial;
           delete y.cod_estructura;
           delete y.fec_solicitud;
           delete y.fec_ven_insp;
    
        }
   
    stringify =JSON.stringify(valoresDeclarados);
    stringify = await utiles.replaceAll(stringify, 'mto_contenido','montoContenido') ;
    stringify = await utiles.replaceAll(stringify, 'mto_edificacion','numeroPisos') ;
    stringify = await utiles.replaceAll(stringify, 'mto_maquinaria','montoMaquinaria');
    stringify = await utiles.replaceAll(stringify, 'mto_existencia','montoExistencias');
    stringify = await utiles.replaceAll(stringify, 'mto_lucro','montoLucroCesante');
    stringify = await utiles.replaceAll(stringify, 'mto_total','total');
    valoresDeclarados = JSON.parse(stringify);
        //console.log('*** 6 *****')  ;
        //console.log('*** numtramite *****', numtramite)  ;
    var evalRiesgoPerdida = await MatrizGet(numtramite) ;
    stringify =JSON.stringify(evalRiesgoPerdida);
    stringify = await utiles.replaceAll(stringify, 'num_matriz','codMatriz') ;
    stringify = await utiles.replaceAll(stringify, 'cod_cord_matriz','coordenadaMatriz');
    stringify = await utiles.replaceAll(stringify, 'cod_tip_riesgo','valorMatriz');
    evalRiesgoPerdida = JSON.parse(stringify);
     for ( y of evalRiesgoPerdida.data) {
           delete y.ind_del;
           delete y.num_tramite;
        }
     var listDeterEscenarioPerdida = await   PerdidasGet(numtramite);
      for ( y of listDeterEscenarioPerdida.data) {
           delete y.ind_del;
           delete y.num_tramite;
        }
    stringify =JSON.stringify(listDeterEscenarioPerdida);
    stringify = await utiles.replaceAll(stringify, 'num_perdida','codPerdida');
    stringify = await utiles.replaceAll(stringify, 'des_escenario','escenario');
    stringify = await utiles.replaceAll(stringify, 'des_perdida','afectacion');
    listDeterEscenarioPerdida = JSON.parse(stringify);
    
    //console.log('*** 7 *****')  ;
    var riesgoPropPerdidaBeneficio = await RiesgoGet(numtramite) ;
    stringify =JSON.stringify(riesgoPropPerdidaBeneficio);
    stringify = await utiles.replaceAll(stringify, 'num_riesgo','codRiesgo') ;
    stringify = await utiles.replaceAll(stringify, 'des_incendio','incendio');
    stringify = await utiles.replaceAll(stringify, 'des_rot_maq','roturaMaquina');
    stringify = await utiles.replaceAll(stringify, 'des_robo','robo3D');
    stringify = await utiles.replaceAll(stringify, 'des_huelga_cc','huelgaCc');
    stringify = await utiles.replaceAll(stringify, 'des_perd_ben','perdidaBeneficio');
    
    var riesgoPropiedad = JSON.parse(stringify);
    var riesgoPolitico = JSON.parse(stringify);
    for ( y of riesgoPropiedad.data) {
           delete y.ind_del;
           delete y.num_tramite;
           delete y.huelgaCc;
           delete y.des_resp_civil;
           delete y.des_exposic;
           delete y.des_lluvia;
           delete y.des_terremoto;
           delete y.des_inundacion;
           delete y.des_geotecnic;
           delete y.des_maremoto;
           delete y.des_geologico;

           
    }
    for ( y of riesgoPolitico.data) {
           delete y.ind_del;
           delete y.num_tramite;
           delete y.codRiesgo;
           delete y.incendio;
           delete y.robo3D;
           delete y.roturaMaquina;
           delete y.perdidaBeneficio;

           delete y.des_resp_civil;
           delete y.des_exposic;
           delete y.des_lluvia;
           delete y.des_terremoto;
           delete y.des_inundacion;
           delete y.des_geotecnic;
           delete y.des_maremoto;
           delete y.des_geologico;
        }
    
    //console.log('*** 8 *****')  ;
    var listaEntrevistados= await entrevistadoGet(numtramite,"-1");
    //console.log('*** listaEntrevistados *****', listaEntrevistados)  ;
    if(listaEntrevistados.result){
     
        for ( y of listaEntrevistados.data) {
           delete y.ind_del;
           delete y.num_tramite;
        }
    
        stringify =JSON.stringify(listaEntrevistados);
        stringify = await utiles.replaceAll(stringify, 'des_cargo','cargo') ;
        stringify = await utiles.replaceAll(stringify, 'nom_entrevistado','nombreEntrevistado');
        stringify = await utiles.replaceAll(stringify, 'num_entrevistado','codEntrevistado');
        stringify = await utiles.replaceAll(stringify, 'des_telefono','telefono');
        stringify = await utiles.replaceAll(stringify, 'des_correo','correo');
        
        listaEntrevistados = JSON.parse(stringify);
   
    }else {listaEntrevistados={};}
    
    var output= {"datosGenerales":datosGeneralesIni.data,
                 "listaEntrevistados":listaEntrevistados.data,
                "informacionSBS":informacionSBSIni.data,
                "valoresDeclarados":valoresDeclarados.data,
                "observacion":observacion,
                "evalRiesgoPerdida":evalRiesgoPerdida.data,
                //"riesgoPropPerdidaBeneficio.riesgoPropiedad":riesgoPropPerdidaBeneficio.riesgoPropiedad.data,
                //riesgoPropPerdidaBeneficio,
                 "riesgoPropPerdidaBeneficio":{
                                "riesgoPropiedad":riesgoPropiedad.data,
                                "riesgoPolitico":riesgoPolitico.data
                 },
                 "listDeterEscenarioPerdida":{"deterEscenarioPerdida":listDeterEscenarioPerdida.data},
                "perdidaMaximaProbable": {"montoMaximoSujeto":perdidaMaximaProbable} ,
                "estCunplGarantiaDadaPoliza":estCunplGarantiaDadaPoliza
    };
    //console.log('*** output *****', output)  ;
    var resultado=[
            {"claveTramite":numtramite}, 
            {"codTipoTramite":codtipotramite}, 
            {"email":email} , 
            {fechaActualizacion :fecha},output];

    //console.log('*** resultado *****', resultado)  ;
    
    return {result: true,
         data:resultado,
         fechaConsulta:fechaConsulta };        

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

async function MatrizGet(numtramite) {
    let params;
    if (numtramite){
         params = {
                TableName: MATRIZ_TABLE,
                ExpressionAttributeValues: {
                   ':num_tramite' :numtramite,
                   ':ind_del' :IND_DEL,
                },
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
        const {Items} = await dynamoDbClient.query(params).promise();
        if (Items.length > 0) {
            var stringify =JSON.stringify(Items);
            var datos  = JSON.parse(stringify);
            return {result: true,data:datos};
        }
         return {result: false,errores: {codigo:'3',mensaje:'No se encontraron datos'}};
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

async  function put(params) {
    try {
             await  dynamoDbClient.put(params).promise();
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
    save,paso5InspeccionGet,paso5Ins,paso5Upd,paso5Get
}