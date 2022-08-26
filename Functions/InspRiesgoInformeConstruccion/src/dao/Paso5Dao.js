const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
//const repository = require('../dao/Reposytory');

const ARCHIVO_TABLE = process.env.TABLE_ARCHIVO;
const ENLACE_TABLE = process.env.TABLE_ENLACE
const SINIESTRO_TABLE = process.env.TABLE_SINIESTRO
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
    if (req.fechaRegistro==undefined){
        req.fechaRegistro=req.fechaActualizacion;
    }
    if (req.fechaActualizacion==undefined){
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
	
	return {result: true};
}

async  function paso5Ins(req) {

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
//**************ARCHIVO***************
//console.log('**** paso1dao********',req);
    
var fechaHora = await utiles.fechaHora();
var fechaConsulta = fechaHora;
 //****** inicio validadacion ************ 
var valida = null;
req.trx='POST';
var seguir = await pasovalida(req);
//console.log('**** seguir :', seguir);
if (!seguir.result) {
    return seguir;
}

/*var validalista = await validaListaArchivo(req);
console.log('**** validalista :'+ validalista.result);
if (!validalista.result) {
     return validalista;
}*/

//****** fin validacion ************ 

var TransactItems = [];
var Put = {};
var Puts="";
var params=null;
//**************SINIESTRO****************
//valida = await utiles.IsJsonString(req.listaSiniestro);
//console.info(" valida listaSiniestro: " , valida);
//if (req.listaSiniestro != undefined) {
    //console.log('**** req.listaSiniestro :',req.listaSiniestro);
    var stringify1 =JSON.stringify(req.listaSiniestro);
    stringify1 = await utiles.replaceAll(stringify1, 'fechaSiniestro','fec_siniestro') ;
    stringify1 = await utiles.replaceAll(stringify1, 'descripcion','des_siniestro');
    stringify1 = await utiles.replaceAll(stringify1, 'tiempoParalizacion','des_tie_paral');
    stringify1 = await utiles.replaceAll(stringify1, 'eliminado','ind_del');  
    var listaSiniestro = JSON.parse(stringify1); 
    //console.log('**** listaSiniestro :', listaSiniestro);
    var Item = {
        "num_siniestro": "",
        "num_tramite" : "",
        "des_siniestro":"",
        "fec_siniestro" :"",
        "ind_del" :""
    };
    var cont=0;
    //var codSiniestro=0;
    for(var x in listaSiniestro){ 
        Item = {
            "num_siniestro": "",
            "num_tramite" : "",
            "des_siniestro":"",
            "fec_siniestro" :"",
            "ind_del" :""
        };
        cont++;  
        //console.log('**** cont :',cont);
        //console.log('**** req.codSiniestro :',req.codSiniestro);
        codSiniestro = req.codSiniestro.concat(cont); 
        //console.log('**** codSiniestro :',codSiniestro);
        valida = await  utiles.validateParametro(codSiniestro,'codSiniestro');
        if (!valida.result) {
            return {result: valida.result, errores:valida.errores};
        }
        Item.num_siniestro=codSiniestro;
        codSiniestro = req.codSiniestro.concat(cont);
        valida = await utiles.validateParametro(listaSiniestro[x].fec_siniestro,'fec_siniestro');
        if (valida.result) {
            Item.fec_siniestro=listaSiniestro[x].fec_siniestro;
        }else{ 
            delete Item['fec_siniestro'];
        }
        valida = await utiles.validateParametro(listaSiniestro[x].des_siniestro,'des_siniestro');
        if (valida.result) {
            Item.des_siniestro=listaSiniestro[x].des_siniestro;
        }else{ 
            delete Item['des_siniestro'];
        }
        //Item.num_archivo=listaArchivo[x].num_archivo;
        Item.num_tramite=req.claveTramite;
        Item.ind_del= IND_DEL;
        //Item.tip_archivo=lista[x].tip_archivo;
        Put = {TableName: SINIESTRO_TABLE, Item};
        Puts= {Put} ;
        var p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
        //console.log('***** Item *******',Item);
    }  
//}
console.info(" TransactItems: " , TransactItems);
//**************SINIESTRO****************

//**************ENLACE****************
//valida = await utiles.IsJsonString(req.listEnlace);
//console.info(" valida listEnlace: " , valida);
//if (req.listEnlace != undefined) {
    var stringify1 =JSON.stringify(req.listEnlace);
    //console.log('**** req.listEnlace :',req.listEnlace);
    stringify1 = await utiles.replaceAll(stringify1, 'codEnlace','num_enlace') ;
    stringify1 = await utiles.replaceAll(stringify1, 'nomEnlace','des_enlace') ;
    stringify1 = await utiles.replaceAll(stringify1, 'eliminado','ind_del');  
    var listEnlace = JSON.parse(stringify1); 
    //console.log('**** listEnlace :',listEnlace);
    var Item = {
        "num_enlace": "",
        "num_tramite" : "",
        "des_enlace":"",
        "ind_del" :""
    };
    for(var x in listEnlace){  
        Item = {
            "num_enlace": "",
            "num_tramite" : "",
            "des_enlace":"",
            "ind_del" :""
        };
        //console.log('**** req.codEnlace :',listEnlace[x].num_enlace); 
        valida = await  utiles.validateParametro(listEnlace[x].num_enlace,'codEnlace');
        if (!valida.result) {
            return {result: valida.result, errores:valida.errores};
        }
        Item.num_enlace=listEnlace[x].num_enlace;
        valida = await utiles.validateParametro(listEnlace[x].des_enlace,'nomEnlace');
        if (valida.result) {
            Item.des_enlace=listEnlace[x].des_enlace;
        }else{ 
            delete Item['des_enlace'];
        }
        Item.num_tramite=req.claveTramite;
        Item.ind_del= IND_DEL;
        //Item.tip_archivo=lista[x].tip_archivo;
        Put = {TableName: ENLACE_TABLE, Item};
        Puts= {Put} ;
        var p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
        //console.log('***** Item *******',Item);
    }
    
//}
console.info(" TransactItems: " , TransactItems);
//**************ENLACE****************

//**************ARCHIVO******************
//valida = await utiles.IsJsonString(req.listArchivo);
//console.info(" valida listArchivo: " , valida);
//if (req.listArchivo != undefined) {
    var stringify1 =JSON.stringify(req.listArchivo);
    //console.log('**** req.listArchivo :',req.listArchivo); 
    stringify1 = await utiles.replaceAll(stringify1, 'codArchivo','num_archivo') ;
    stringify1 = await utiles.replaceAll(stringify1, 'tipoArchivo','tip_archivo');
    stringify1 = await utiles.replaceAll(stringify1, 'nomArchivo','nom_archivo');
    stringify1 = await utiles.replaceAll(stringify1, 'eliminado','ind_del');  
    var listaArchivo = JSON.parse(stringify1); 
    //console.log('**** listaArchivo :', listaArchivo); 

    var Item = {
        "num_archivo": "",
        "num_tramite" : "",
        "tip_archivo":"",
        "nom_archivo" :"",
        "ind_del" :""
    };

    for(var x in listaArchivo){ 
        Item = {
            "num_archivo": "",
            "num_tramite" : "",
            "tip_archivo":"",
            "nom_archivo" :"",
            "ind_del" :""
        };
        //console.log('**** listaArchivo[x].num_archivo :', listaArchivo[x].num_archivo); 
        valida = await  utiles.validateParametro(listaArchivo[x].num_archivo,'num_archivo');
        if (!valida.result) {
            return {result: valida.result, errores:valida.errores};
        }
        Item.num_archivo=listaArchivo[x].num_archivo;
        valida = await utiles.validateParametro(listaArchivo[x].nom_archivo,'nom_archivo');
        if (valida.result) {
            Item.nom_archivo=listaArchivo[x].nom_archivo;
        }else{ 
            delete Item['nom_archivo'];
        }

        valida = await utiles.validateParametro(listaArchivo[x].tip_archivo,'tip_archivo');
        if (valida.result) {
            Item.tip_archivo=listaArchivo[x].tip_archivo;
        }else{ 
            delete Item['tip_archivo'];
        }

        Item.num_archivo=listaArchivo[x].num_archivo;
        Item.num_tramite=req.claveTramite;
        Item.ind_del= IND_DEL;
        //Item.tip_archivo=lista[x].tip_archivo;
        Put = {TableName: ARCHIVO_TABLE, Item};
        Puts= {Put} ;
        var p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
        //console.log('***** Item *******',Item);
    } 
//}
console.info(" TransactItems: " , TransactItems);

//**************ARCHIVO****************

//**************INSPECCION****************
 var  ExpressionAttributeValues= {
    ":fec_modif": fechaHora,
    ":fec_actualizacion":req.fechaRegistro,
    ":cod_estado": req.estadoInspeccion
    //":cod_tipinforme":req.codTipoTramite, 
};
var setter="set ";
var registros = [];
// var valida=null;
 registros.push("fec_modif = :fec_modif");
 registros.push("fec_actualizacion = :fec_actualizacion");

 valida = await utiles.validateParametro(req.estadoInspeccion,'estadoInspeccion');
 if (valida.result) {
     registros.push("cod_estado = :cod_estado");
 }else{ 
     delete ExpressionAttributeValues[':cod_estado'];
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
        UpdateExpression: setter,
        ExpressionAttributeValues: ExpressionAttributeValues,
        //ConditionExpression: "cod_tipinforme = :cod_tipinforme",
        returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
        },
};
//console.log('*****upd*******',upd);
TransactItems.push(upd);
//**************INSPECCION****************
params = { "TransactItems":TransactItems};
var result=  await save(params);
//console.log('****result*******',result);
return result; 

}



async  function paso5Upd(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = true;
	var TransactItems = [];
    //********* SINIESTRO ************
    //var valida = await utiles.validateParametro(req.listaSiniestro,'listaSiniestro');
    //if (req.listaSiniestro != undefined) {    
            let stringify =JSON.stringify(req.listaSiniestro);
            var listaSiniestros = JSON.parse(stringify);
            var registros = [];           
            var ExpressionAttributeValues = {
                    ":fec_siniestro": "",
                    ":des_siniestro": "",
                    ":des_tie_paral": "",
                    ":ind_del": ""
            };
            for(var x in listaSiniestros){
                registros = [];
                ExpressionAttributeValues = {
                    ":fec_siniestro": listaSiniestros[x].fechaSiniestro,
                    ":des_siniestro": listaSiniestros[x].descripcion,
                    ":des_tie_paral": listaSiniestros[x].tiempoParalizacion,                
                    ":ind_del": listaSiniestros[x].eliminado
                };
                var valida = await utiles.validateParametro(listaSiniestros[x].fechaSiniestro,'fechaSiniestro');
                if (valida.result) {
                    registros.push("fec_siniestro = :fec_siniestro");
                }else{ delete ExpressionAttributeValues[':fec_siniestro'];}
                
                valida = await utiles.validateParametro(listaSiniestros[x].descripcion,'descripcion');
                if (valida.result) {
                    registros.push("des_siniestro = :des_siniestro");
                }else{ delete ExpressionAttributeValues[':des_siniestro'];} 
                
                valida = await utiles.validateParametro(listaSiniestros[x].des_tie_paral,'des_tie_paral');
                if (valida.result) {
                    registros.push("des_tie_paral = :des_tie_paral");
                }else{ delete ExpressionAttributeValues[':des_tie_paral'];} 
                
                valida = await utiles.validateParametro(listaSiniestros[x].eliminado,'eliminado');
                if (valida.result) {
                        registros.push("ind_del = :ind_del");
                        valida = await utiles.validarBoolean(listaSiniestros[x].eliminado,'eliminado');
                        listaSiniestros[x].ind_del =valida.data.codigo;
                        ExpressionAttributeValues[':ind_del']=valida.data.codigo;            
                }else{ 
                        delete ExpressionAttributeValues[':ind_del'];
                }
            //console.log('*****ExpressionAttributeValues*******',ExpressionAttributeValues); 
            var upd="set ";
            for (var i=0; i<registros.length;i++){
                        if(i==registros.length-1)
                            upd = upd + registros[i] ;
                        else upd = upd + registros[i] + "," ;
            }
            //console.log('**** ExpressionAttributeValues[i] ********',ExpressionAttributeValues);
            var key = { "num_tramite": req.claveTramite,"num_siniestro": listaSiniestros[x].codSiniestro};
            //console.log('**** key[i] ********',key);
            var Update = {
                    TableName: SINIESTRO_TABLE,
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
       // }

    //********* ARCHIVO ************
    //var valida = await utiles.validateParametro(req.listArchivo,'listArchivo');
    //if (req.listArchivo != undefined) {
         
            stringify =JSON.stringify(req.listArchivo);
            var listArchivo = JSON.parse(stringify);
            var registros = [];
            var ExpressionAttributeValues = {
                    ":tip_archivo": "",
                    ":nom_archivo": "",
                    ":ind_del": ""
            };
            for(var x in listArchivo){
                registros = [];
                ExpressionAttributeValues = {
                    ":tip_archivo": listArchivo[x].tipoArchivo,
                    ":nom_archivo": listArchivo[x].nomArchivo,                
                    ":ind_del": listArchivo[x].eliminado
                };
                var valida = await utiles.validateParametro(listArchivo[x].tipoArchivo,'tipoArchivo');
                if (valida.result) {
                    registros.push("tip_archivo = :tip_archivo");
                }else{ delete ExpressionAttributeValues[':tip_archivo'];}
                
                valida = await utiles.validateParametro(listArchivo[x].descripcion,'descripcion');
                if (valida.result) {
                    registros.push("nom_archivo = :nom_archivo");
                }else{ delete ExpressionAttributeValues[':nom_archivo'];} 
                
                valida = await utiles.validateParametro(listArchivo[x].eliminado,'eliminado');
                if (valida.result) {
                        registros.push("ind_del = :ind_del");
                        valida = await utiles.validarBoolean(listArchivo[x].eliminado,'eliminado');
                        listArchivo[x].ind_del =valida.data.codigo;
                        ExpressionAttributeValues[':ind_del']=valida.data.codigo;            
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
            var key = { "num_tramite": req.claveTramite,"num_archivo": listArchivo[x].codArchivo};
            //console.log('**** key[i] ********',key);
            var Update = {
                    TableName: ARCHIVO_TABLE,
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
       // }

        //********* ENLACE ************
    //var valida = await utiles.validateParametro(req.listEnlace,'listEnlace');
    //if (req.listEnlace != undefined) {
         
            stringify =JSON.stringify(req.listEnlace);
            var listEnlace = JSON.parse(stringify);
            var registros = [];
            var ExpressionAttributeValues = {
                    ":des_enlace": "",
                    ":ind_del": ""
            };
            for(var x in listEnlace){
                registros = [];
                ExpressionAttributeValues = {
                    ":des_enlace": listEnlace[x].nomEnlace,               
                    ":ind_del": listEnlace[x].eliminado
                };
                var valida = await utiles.validateParametro(listEnlace[x].nomEnlace,'nomEnlace');
                if (valida.result) {
                    registros.push("des_enlace = :des_enlace");
                }else{ delete ExpressionAttributeValues[':des_enlace'];}
                valida = await utiles.validateParametro(listEnlace[x].eliminado,'eliminado');
                if (valida.result) {
                    registros.push("ind_del = :ind_del");
                    valida = await utiles.validarBoolean(listEnlace[x].eliminado,'eliminado');
                    listEnlace[x].ind_del =valida.data.codigo;
                    ExpressionAttributeValues[':ind_del']=valida.data.codigo;            
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
            var key = { "num_tramite": req.claveTramite,"num_enlace": listEnlace[x].codEnlace};
            //console.log('**** key[i] ********',key);
            var Update = {
                    TableName: ENLACE_TABLE,
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
        //}

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

async function SiniestroGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var keycondicion = 'num_tramite = :num_tramite';
    var vigente = IND_DEL;
    var ExpressionAttributeValues= {
        ':num_tramite':  numtramite,
        ':ind_del': vigente
    };
            params = {
                TableName: SINIESTRO_TABLE,
                ExpressionAttributeValues:ExpressionAttributeValues,
                KeyConditionExpression: keycondicion,
                FilterExpression: 'ind_del = :ind_del'
            };
            const {Items} = await dynamoDbClient.query(params).promise();
            if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_siniestro','codSiniestro') ;
                stringify = await utiles.replaceAll(stringify, 'fec_siniestro','fechaSiniestro');
                stringify = await utiles.replaceAll(stringify, 'des_siniestro','descripcion');
                stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
                var datos  = JSON.parse(stringify);
                for (var y of datos) {
                   delete y.num_tramite;
                   delete y.des_tie_paral;   
                   delete y.eliminado;  
                }
                return {result: true, data: datos};
            }
            return {result: false, data: {}};
            //return {result: false, errores:{codigo:'3',mensaje:'consulta sin resultado en '+ SINIESTRO_TABLE},fechaConsulta:fechaConsulta};
}

async function EnlaceGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var keycondicion = 'num_tramite = :num_tramite';
    var vigente = IND_DEL;
    var ExpressionAttributeValues= {
        ':num_tramite':  numtramite,
        ':ind_del': vigente
    };
            params = {
                TableName: ENLACE_TABLE,
                ExpressionAttributeValues:ExpressionAttributeValues,
                KeyConditionExpression: keycondicion,
                FilterExpression: 'ind_del = :ind_del'
            };
            const {Items} = await dynamoDbClient.query(params).promise();
            if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_enlace','codEnlace') ;
                stringify = await utiles.replaceAll(stringify, 'des_enlace','nomEnlace');
                stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
                var datos  = JSON.parse(stringify);
                for (var y of datos) {
                  delete y.num_tramite; 
                  delete y.eliminado;  
                }
                return {result: true, data: datos};
            }
            return {result: false, data: {}};
}

async function paso5Get(numtramite,email) {
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    //console.log('****numtramite*******',numtramite);
    //console.log('****email*******',email);
    if (email && numtramite){
    var y,codtipotramite,fechaRegistro,codEstado;  //InspeccionGet(numtramite,email) 
    var listainspeccion = await InspeccionGet(numtramite,email) ;
    //console.log('****listainspeccion*******',listainspeccion);
    //des_observacion
    for (y of listainspeccion.data) {
        codEstado = y.cod_estado;
        codtipotramite=y.cod_tipinforme;
        fechaRegistro = y.fec_solicitud;               
    }
    
    //console.log('*** 7 *****')  ;
    var listArchivo = await ArchivoGet(numtramite);
    //listArchivo = JSON.parse(listArchivo);
    var listaSiniestro = await SiniestroGet(numtramite); 
    //listaSiniestro = JSON.parse(listaSiniestro);
    var listaEnlace = await EnlaceGet(numtramite);
    //listaEnlace  = JSON.parse(listaEnlace);
    //console.log('*** listArchivo *****',listArchivo)  ;
    //console.log('*** listaSiniestro *****',listaSiniestro)  ;
    //console.log('*** listaEnlace *****',listaEnlace)  ;

    var resultado=[
        {"claveTramite":numtramite}, 
        {"codTipoTramite":codtipotramite}, 
        {"email":email} , 
        {"fechaRegistro" :fechaRegistro},
        {"listArchivo":listArchivo.data},
        {"listaSiniestro":listaSiniestro.data},
        {"listaEnlace":listaEnlace.data}
        ];

        //console.log('*** resultado *****',resultado)  ;
  return {result: true,data:resultado};
}
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Inspeccion'},fechaConsulta:fechaConsulta};
}

async function ArchivoGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    if (numtramite){
         params = {
                TableName: ARCHIVO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite':  numtramite,
                    ':ind_del': vigente,
                },
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
  
        const {Items} = await dynamoDbClient.query(params).promise();
        if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_archivo','codArchivo') ;
                stringify = await utiles.replaceAll(stringify, 'nom_archivo','nomArchivo');
                stringify = await utiles.replaceAll(stringify, 'tip_archivo','tipoArchivo');
                stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
                var datos  = JSON.parse(stringify);
                for (var y of datos) {
                   delete y.num_tramite;
                   delete y.des_archivo; 
                   delete y.eliminado;  
                }
           return {result: true, data: datos};
        }
        return {result: true, data: {}};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Archivo'}};
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

async  function save(params) {
    try {
             await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
}

module.exports = {
    save,paso5Ins,paso5Upd,paso5Get
}