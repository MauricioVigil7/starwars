const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
//const repository = require('../dao/Reposytory');

const ENTREVISTADO_TABLE = process.env.ENTREVISTADO_TABLE;
const PERDIDA_TABLE = process.env.PERDIDA_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;

async  function paso2Ins(req) {

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

    //valida = await utiles.validateParametro(req.listaEntrevistados,'listaEntrevistados');
  //  if (valida.result) {        
        var Put = {};
        var Puts="";
        var params=null;
        var cont=0;
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
            Item.num_entrevistado= req.codEntrevistado.concat(cont);
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
        
    //}

   
  //  console.log('**** TransactItems 1 ********',TransactItems);
 // valida = await utiles.validateParametro(req.listaEstimacionPerdidaPML,'escenario');
  //if (req.listaEstimacionPerdidaPML != undefined) {  
      stringify =JSON.stringify(req.listaEstimacionPerdidaPML);
      var lista = JSON.parse(stringify); 
    // stringify = await utiles.replaceAll(stringify, 'id','num_id') ;
    // stringify = await utiles.replaceAll(stringify, 'escenario','des_escenario');
    // stringify = await utiles.replaceAll(stringify, 'afectacion','des_perdida');
      var cont=0;
            for(var x in lista){
                cont++;
                Item = {
                    "num_tramite" : req.claveTramite,
                    "num_perdida": req.codEntrevistado.concat(cont),
                    "des_escenario": lista[x].escenario,
                    "des_perdida":lista[x].descripcion,
                    "ind_del" :IND_DEL
                };
            valida = await utiles.validateParametro(lista[x].escenario,'escenario');
            if (!valida.result) {
                    delete Item['des_escenario'];
            }
            valida = await utiles.validateParametro(lista[x].descripcion,'descripcion');
            if (!valida.result) {
                    delete Item['des_perdida'];
            }          
            Put = {TableName: PERDIDA_TABLE, Item};
            Puts= {Put} ;
            p =JSON.stringify(Puts);
            p = await JSON.parse(p);
            TransactItems.push(p);
            //console.log('****p*******',p);
        }
 // }

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
	//var TransactItems = [];
	if( req.fechaActualizacion == undefined){
        req.fechaActualizacion = req.fechaRegistro;
    }
    if( req.fechaRegistro == undefined){
        req.fechaRegistro = req.fechaActualizacion;
    }
    req.fechaHora=fechaHora;
    var valoresparam = [
        //req.codTipoTramite,
      //  req.fechaHora,
      //  req.fechaRegistro,
    	req.datosGenerales.razonSocial, 
    	req.nuevasInversiones.descripcion,
    	req.sumarioResumen.sumario
	];
	
	var namesparam = [
	//':codTipoTramite',
//	'fec_modif',
//	':fechaRegistro',
	':razonSocial', ':descripcion',
	':sumario'
	];
	var columnsparam = [
	//'cod_tipinforme =:cod_tipinforme',
   // 'fec_modif =:fec_modif',
   // 'fec_actualizacion =:fec_actualizacion',
	'nom_razsocial =:nom_razsocial', 
	'des_nue_inver =:des_nue_inver',
	'des_sumario =:des_sumario'
	];
    var ExpressionAttributeValues=
     {
       // ":cod_tipinforme": req.codTipoTramite,
        ":fec_modif": req.fechaHora,
        ":fec_actualizacion": req.fechaRegistro,
        ":nom_razsocial": req.datosGenerales.razonSocial,
        ":des_nue_inver": req.nuevasInversiones.descripcion,
        ":des_sumario": req.sumarioResumen.sumario
     };
    var registros = [];
	for(var i = 0; i <= valoresparam.length -1; i++) {
	   valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
    	if (!valida.result) {
    	    delete ExpressionAttributeValues[namesparam[i]];
    	}else{
    		 registros.push(columnsparam[i]);
    	}
    }
    registros.push('fec_modif =:fec_modif');
    registros.push('fec_actualizacion =:fec_actualizacion');
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
    
    /*if(req.listaEntrevistados== undefined){
        return undefined;
    }*/
    let stringify =JSON.stringify(req.listaEntrevistados);
    var lista = JSON.parse(stringify);
    var registros = [];
    var TransactItems = [];
    var ExpressionAttributeValues = {
             ":nom_entrevistado": "",
             ":des_cargo": "",
             ":des_correo": "",
             ":des_telefono": "",
             ":ind_del": ""
    };
	for(var x in lista){
        registros = [];
        ExpressionAttributeValues = {
             ":nom_entrevistado": lista[x].nombreEntrevistado,
             ":des_cargo": lista[x].cargo,
             ":des_correo": lista[x].correo,
             ":des_telefono": lista[x].telefono,                
             ":ind_del": lista[x].eliminado
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

        valida = await utiles.validateParametro(lista[x].eliminado,'eliminado');
        if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].eliminado,'eliminado');
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues[':ind_del']=valida.data.codigo;
                //console.log('*****valida.data.codigo*******'+valida.data.codigo);              
        }else{ 
				delete ExpressionAttributeValues[':ind_del'];
		}
        
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

async  function getRegistroEscenario(req) {
    
   /* if(req.listaEstimacionPerdidaPML== undefined){
        return undefined;
    }*/
    let stringify =JSON.stringify(req.listaEstimacionPerdidaPML);
    var lista = JSON.parse(stringify);
    var registros = [];
    var TransactItems = [];
    var ExpressionAttributeValues = {
             ":des_escenario": "",
             ":des_perdida": "",
             ":ind_del": ""
    };
	for(var x in lista){
        registros = [];
        ExpressionAttributeValues = {
             ":des_escenario": lista[x].escenario,
             ":des_perdida": lista[x].descripcion,
             ":ind_del": lista[x].eliminadoo
        };

        var valida = await utiles.validateParametro(lista[x].escenario,'escenario');
        if (valida.result) {
               registros.push("des_escenario = :des_escenario");
        }else{ delete ExpressionAttributeValues[':des_escenario'];}
        
        valida = await utiles.validateParametro(lista[x].descripcion,'descripcion');
        if (valida.result) {
               registros.push("des_perdida = :des_perdida");
        }else{ delete ExpressionAttributeValues[':des_perdida'];} 
         
        
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].eliminado,'eliminado');
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues[':ind_del']=valida.data.codigo;
                //console.log('*****valida.data.codigo*******'+valida.data.codigo);              
        }else{ 
				delete ExpressionAttributeValues[':ind_del'];
		}
        
     var upd="set ";
	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
    }
    //console.log('**** ExpressionAttributeValues[i] ********',ExpressionAttributeValues);
     var key = { "num_tramite": req.claveTramite,"num_perdida": lista[x].codPerdida};
     //console.log('**** key[i] ********',key);
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
     TransactItems.push(p);
	 
	}
	return TransactItems;
}


async  function paso2Upd(req) {
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

    var TransactItems = [];
    var params=null;
	var upd="";

	var listentrevistado = await getRegistroEntrevistado(req);
	//console.log('***listentrevistado*****',listentrevistado);
    /*if(req.listaEntrevistados != undefined){
        TransactItems = listentrevistado; 
    }*/

    var escenario = await getRegistroEscenario(req);
    /*if(req.listaEstimacionPerdidaPML != undefined){
        TransactItems = TransactItems.concat(escenario);
    }*/
	
    var trxInsp = await getTransactItemsInspeccion(req);
    TransactItems.push(trxInsp);
   	
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('****result*******',result);
    return result;

}

async function paso2Get(numtramite,email) {
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    console.info("get Paso2: numtramite " , numtramite); 
        console.info("get Paso2: email " , email); 
    if (email && numtramite){
        console.info("*********** " ); 
    var y,x,razonSocial,descripcion,sumario,codtipotramite;  //InspeccionGet(numtramite,email) 
    var listainspeccion = await InspeccionGet(numtramite,email) ;
    //console.log('****listainspeccion*******',listainspeccion);
    //des_observacion
    for (y of listainspeccion.data) {
              delete y.num_piso;
              delete y.mto_edificacion;
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
               //delete y.correo_insp;
               delete y.mto_maquinaria;
               delete y.descripcion;
               delete y.cod_estructura;
               delete y.riosQuebradas;
               delete y.cod_uso;
               delete y.mto_lucro;
               delete y.mto_total;
               delete y.cod_tipinforme;
               codtipotramite=y.cod_tipinforme;
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_actualizacion;
               delete y.fec_solicitud;
               delete y.fec_ven_insp;
               razonSocial = y.nom_razsocial;
               descripcion= y.des_nue_inver;
               sumario =y.des_sumario;

           }
    
    var listaEntrevistados= await EntrevistadoGet(numtramite);
    
    if(listaEntrevistados.result){  
        //console.log('****listaEntrevistados.result*******',listaEntrevistados.result);
        for ( y of listaEntrevistados.data) {
           delete y.ind_del;
           delete y.num_tramite;
        }
        var stringify =JSON.stringify(listaEntrevistados);
        stringify = await utiles.replaceAll(stringify, 'des_cargo','cargo') ;
        stringify = await utiles.replaceAll(stringify, 'nom_entrevistado','nombreEntrevistado');
        stringify = await utiles.replaceAll(stringify, 'num_entrevistado','codEntrevistado');
        stringify = await utiles.replaceAll(stringify, 'des_telefono','telefono');
        stringify = await utiles.replaceAll(stringify, 'des_correo','correo');
        listaEntrevistados = JSON.parse(stringify);
        //console.log('****listaEntrevistados*******',listaEntrevistados);
    }else {listaEntrevistados={};}

    var listaEstimacionPerdidaPML= await PerdidaGet(numtramite);
   // //console.log('****listaEstimacionPerdidaPML*******',listaEstimacionPerdidaPML);
   //console.log('****listaEstimacionPerdidaPML.result*******',listaEstimacionPerdidaPML.result);
    if(listaEstimacionPerdidaPML.result){  
        
        for ( y of listaEstimacionPerdidaPML.data) {
           delete y.ind_del;
           delete y.num_tramite;
        }
        var stringify =JSON.stringify(listaEstimacionPerdidaPML);
        stringify = await utiles.replaceAll(stringify, 'num_perdida','codPerdida') ;
        stringify = await utiles.replaceAll(stringify, 'des_escenario','escenario');
        stringify = await utiles.replaceAll(stringify, 'des_perdida','descripcion');
        stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
        listaEstimacionPerdidaPML = JSON.parse(stringify);
        //console.log('****listaEstimacionPerdidaPML*******',listaEstimacionPerdidaPML);
    }else {listaEstimacionPerdidaPML={};}
    
    //console.log('****razonSocial*******');
    var resultado={
            "claveTramite":numtramite, 
            "codTipoTramite":codtipotramite, 
            "email":email, 
            "fechaActualizacion" :fecha,
            "datosGenerales":{"razonSocial":razonSocial},
            "listaEntrevistados":listaEntrevistados.data,
            "nuevasInversiones":{"descripcion":descripcion},
            "listaEstimacionPerdidaPML":{"escenario":listaEstimacionPerdidaPML.data},
            "sumarioResumen":{"sumario":sumario}
    }
    //console.log('****resultado*******',resultado);
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

async function PerdidaGet(numtramite) {
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

async  function save(params) {
    try {
             await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}

async function EntrevistadoGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    var keycondicion = 'num_tramite =:num_tramite';
    var ExpressionAttributeValues= {
        ':num_tramite': numtramite,
       // ':num_entrevistado': numentrevistado,
        ':ind_del': vigente,
    };
    
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
    paso2Ins,paso2Upd,paso2Get
}