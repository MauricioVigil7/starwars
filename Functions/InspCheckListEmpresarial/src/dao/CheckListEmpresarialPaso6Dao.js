const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const EDIFICACIONES_TABLE = process.env.EDIFICACIONES_TABLE;
const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;


async  function paso6valida(req) {
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = true;
	valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	valida = await utiles.validateParametro(req.edificacion.entornoEdificacion.listArchivo,'listArchivo');
    if (valida.result) {
        var stringify =JSON.stringify(req.edificacion.entornoEdificacion.listArchivo);
        valida = await utiles.IsJsonString(stringify);
        if (!valida.result) {
            return valida;
        }
    }

	return {result: true};
}


async  function paso6Edificacion(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
    var seguir = await paso6valida(req);
    //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
    }
    
    
    
   //****** fin validacion ************ 
    
    var TransactItems = [];
    var Put = {};
    var Puts = "";
	var p = "";
    var params = null;
    if(req.edificacion.entornoEdificacion.listArchivo){
        
        var stringify =JSON.stringify(req.edificacion.entornoEdificacion.listArchivo);
        stringify = await utiles.replaceAll(stringify, 'codArchivo','num_archivo') ;
        stringify = await utiles.replaceAll(stringify, 'tipoArchivo','tip_archivo');
        stringify = await utiles.replaceAll(stringify, 'nomArchivo','nom_archivo');
        stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
      
        var lista = JSON.parse(stringify); 
        var Item = {
            "num_archivo": "",
            "num_tramite" : "",
            "tip_archivo":"",
            "nom_archivo" :"",
            "ind_del" :""
        };
        
        for(var x in lista){
            valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
            if (!valida.result) {
                return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }
            valida = await  utiles.validateParametro(lista[x].tip_archivo,'tip_archivo');
            if (!valida.result) {
                return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result) {
                Item.nom_archivo=lista[x].nom_archivo;
            }else{ delete Item['nom_archivo'];}
    
            Item.ind_del=IND_DEL;
            Item.num_archivo=lista[x].num_archivo;
            Item.num_tramite=req.claveTramite;
            Item.tip_archivo=lista[x].tip_archivo;
            
            Put = {TableName: ARCHIVO_TABLE, Item};
            Puts= {Put} ;
            p =JSON.stringify(Puts);
            p = await JSON.parse(p);
            TransactItems.push(p);
        }
    }

    Item= {
        "num_tramite": req.claveTramite,
        "num_edificacion" : req.codEdificacion,
        "des_interna":req.edificacion.edificacionInterna.descripcion,
        "des_ent_colinda" :req.edificacion.entornoEdificacion.colindantes,
        "des_rio_quebrada" :req.edificacion.entornoEdificacion.riosQuebradas
    };
    valida = await utiles.validateParametro(req.edificacion.edificacionInterna.descripcion,'descripcion');
    if (!valida.result) {
         delete Item['des_interna'];
    }
    valida = await utiles.validateParametro(req.edificacion.entornoEdificacion.colindantes,'colindantes');
    if (!valida.result) {
         delete Item['des_ent_colinda'];
    }
    valida = await utiles.validateParametro(req.edificacion.entornoEdificacion.riosQuebradas,'riosQuebradas');
    if (!valida.result) {
         delete Item['des_rio_quebrada'];
    }
    
    Put = {TableName: EDIFICACIONES_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
    TransactItems.push(p);

    var upd = {
        Update: {
          TableName: INSPECCIONES_TABLE,
            Key: {
               correo_insp:req.email,
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
    };
    TransactItems.push(upd);
    params = { "TransactItems":TransactItems};
    var result=  await grabar(params);
	//console.log('**** result :',result);
    return result;
}

async  function validaListaArchivo(lista) {
	var fechaConsulta = await utiles.fechaHora();
    var valida = null;
    for(var x in lista){
       valida = await  utiles.validarNumero(lista[x].tip_archivo,'tip_archivo');
       if (!valida.result) {
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
        }
       valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');    
	   if (!valida.result) {
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
        }    
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (!valida.result) {
                      return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
                }
        }	
		
    }
    return {result:true};
}
async  function paso6EdificacionUpd(req) {
    var fechaHora = await utiles.fechaHora();
	var upd="";
	var p="";
	var Update ="";
	var registros = [];
	var TransactItems = [];
	var params=null;
	var valida=null;
	
	var seguir = await paso6valida(req);
    //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
    }

    if (req.edificacion.entornoEdificacion.listArchivo){
            var stringify =JSON.stringify(req.edificacion.entornoEdificacion.listArchivo)
            stringify = await utiles.replaceAll(stringify, 'codArchivo','num_archivo') ;
            stringify = await utiles.replaceAll(stringify, 'tipoArchivo','tip_archivo');
            stringify = await utiles.replaceAll(stringify, 'nomArchivo','nom_archivo');
            stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
            
            var lista = JSON.parse(stringify);
            var vallista= await validaListaArchivo(lista);
            if (!vallista.result) {
                 return vallista;
            }
            TransactItems = await getRegistrosArchivo(req);
            //console.log('*****listArchivo TransactItems*******' ,TransactItems);
          //req.edificacion.codEdificacion
    }
	
    var  ExpressionAttributeValues= {
         ":des_interna": req.edificacion.edificacionInterna.descripcion,
         ":des_ent_colinda": req.edificacion.entornoEdificacion.colindantes,
         ":des_rio_quebrada": req.edificacion.entornoEdificacion.riosQuebradas
    };
    upd="set ";
    registros = [];

    valida = await utiles.validateParametro(req.edificacion.edificacionInterna.descripcion,'descripcion');
    if (valida.result) {
         registros.push("des_interna = :des_interna");
    }else{
         delete ExpressionAttributeValues['des_interna'];
        
    }
    valida = await utiles.validateParametro(req.edificacion.entornoEdificacion.colindantes,'colindantes');
    if (valida.result) {
         registros.push("des_ent_colinda = :des_ent_colinda");
    }else{
         delete ExpressionAttributeValues['des_ent_colinda'];
    }
    valida = await utiles.validateParametro(req.edificacion.entornoEdificacion.riosQuebradas,'riosQuebradas');
    if (valida.result) {
         registros.push("des_rio_quebrada = :des_rio_quebrada");
    }else{
         delete ExpressionAttributeValues['des_rio_quebrada'];
    }
    for (var i=0; i<registros.length;i++){
        if(i==registros.length-1)
             upd = upd + registros[i] ;
        else upd = upd + registros[i] + "," ;
    }
     Update = {
               Update: {
                      TableName: EDIFICACIONES_TABLE,
                      Key: {
                        num_tramite: req.claveTramite,
                        num_edificacion: req.edificacion.codEdificacion
                      },
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      //ConditionExpression: "num_edificacion = :num_edificacion",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                     }
              };
    p =JSON.stringify(Update);
    //console.log('*****p*******' +p);
    //console.log('*****req.edificacion.codEdificacion*******' + req.edificacion.codEdificacion);
    
    p = await JSON.parse(p);
    TransactItems.push(p);                           
                                  
     Update = {
               Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    correo_insp : req.email
                  },
                 UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion",
                  
                  ExpressionAttributeValues: {
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion":req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                }
              };
    p =JSON.stringify(Update);
    p = await JSON.parse(p);
    TransactItems.push(p);                               
    
    params = { "TransactItems":TransactItems};
    var result=  await grabar(params);
	//console.log('**** result :',result);
    return result;
}

async  function getRegistrosArchivo(req) {
    
	var valida = null;
	var stringify =JSON.stringify(req.edificacion.entornoEdificacion.listArchivo);
	var ExpressionAttributeValues = null;
	stringify = await utiles.replaceAll(stringify,'codArchivo', 'num_archivo') ;
    stringify = await utiles.replaceAll(stringify,'tipoArchivo', 'tip_archivo');
    stringify = await utiles.replaceAll(stringify,'nomArchivo', 'nom_archivo');
    stringify = await utiles.replaceAll(stringify,'eliminado', 'ind_del');
    var lista = JSON.parse(stringify); 
    //console.log('*****lista*******', lista);
    var TransactItems = [];
	var p = null;
	var upd="";
    var registros = [];
	var key = null;
    var Update = null;
    for(var x in lista){
        upd="set ";
        registros = [];
        ExpressionAttributeValues= {
            ":tip_archivo": lista[x].tip_archivo,
            ":nom_archivo": lista[x].nom_archivo,
            ":ind_del": lista[x].ind_del
        };
        registros.push("tip_archivo = :tip_archivo");
       // lista[x].tip_archivo = parseInt(lista[x].tip_archivo);
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues[':ind_del']=valida.data.codigo;
        }else{ 
				delete ExpressionAttributeValues[':ind_del'];
		}
        valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
        if (valida.result) {
                //console.log('*****lista[x].nom_archivo*******'+lista[x].nom_archivo);
               registros.push("nom_archivo = :nom_archivo");
        }else{ 
				delete ExpressionAttributeValues[':nom_archivo'];
		}
        for (var i=0; i<registros.length;i++){
            if(i==registros.length-1)
                upd = upd + registros[i] ;
            else upd = upd + registros[i] + "," ;
        }
        //console.log('*****lista[x].num_archivo *******' + lista[x].num_archivo ); 
        key = { "num_tramite": req.claveTramite,"num_archivo": lista[x].num_archivo };
        Update = {
            TableName: ARCHIVO_TABLE,
            Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
        Update ={Update};
            //console.log('*****upda*******' + Update);
        p =JSON.stringify(Update);
            //console.log('*****p*******' +p);
        p = await JSON.parse(p);
            
        TransactItems.push(p);

    }
	return TransactItems;
}




async  function getRegistroArchivo(registros,numtramite,numarchivo,ExpressionAttributeValues2) {
	
     var upd="set ";

	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
         }
         
     var key = { "num_tramite": numtramite,"num_archivo": numarchivo};
     var Update = {
                      TableName: ARCHIVO_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues2,
                      returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
     Update ={Update};
     var p = JSON.stringify(Update);
     p = await JSON.parse(p);
     
	 return p;
}


async function paso6ListaGet(numtramite,email,codTipoTramite) {
   
    /*console.log('numtramite:'+numtramite);
    console.log('email:'+email);
    console.log('codTipoTramite:'+codTipoTramite);*/
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
	var stringify1 = null;
    if (numtramite){

        var edificacion = await paso6EdificacionGet(numtramite,email,codTipoTramite) ;
        var edificacionInterna = JSON.parse(JSON.stringify(edificacion));
        var entornoEdificacion = JSON.parse(JSON.stringify(edificacion));
        var y;
        
        for (y of edificacion.data) {
            delete y.num_tramite;
            delete y.fec_modif;
            delete y.des_natural;
            delete y.des_rio_quebrada;
            delete y.des_ent_colinda;
            delete y.des_interna;
            delete y.des_natural;
            delete y.des_sepa_riesg;
            delete y.num_latitud;
            delete y.num_longitud;
            
          }
         for (y of edificacionInterna.data) {
            delete y.num_tramite;
            delete y.fec_modif;
            delete y.des_natural;
            delete y.num_edificacion;
            delete y.des_natural;
            delete y.des_sepa_riesg;
            delete y.des_ent_colinda;
            delete y.num_latitud;
            delete y.num_longitud;
            
          }
          for (y of entornoEdificacion.data) {
            delete y.num_tramite;
            delete y.des_interna;
            delete y.fec_modif;
            delete y.des_natural;
            delete y.num_edificacion;
            delete y.des_natural;
            delete y.des_sepa_riesg;
            delete y.num_latitud;
            delete y.num_longitud;
            
          }
        var lista = await paso6ArchivoGet(numtramite) ;
        for (y of lista.data) {
            delete y.num_tramite;
            delete y.ind_del;
          }
        var listArchivo = {};
        if(lista.result){
            stringify1 =JSON.stringify(lista);
            stringify1 = await utiles.replaceAll(stringify1, 'num_archivo','codArchivo') ;
            stringify1 = await utiles.replaceAll(stringify1, 'tip_archivo','tipArchivo');
            stringify1 = await utiles.replaceAll(stringify1, 'nom_archivo','nomArchivo');
            stringify1 = await utiles.replaceAll(stringify1, 'ind_del','eliminado');
            lista = JSON.parse(stringify1); 
            //console.log(lista);
            listArchivo = lista.data;
        }
       
        stringify1 =JSON.stringify(edificacion);
        stringify1 = await utiles.replaceAll(stringify1, 'num_edificacion','codEdificacion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_interna','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_ent_colinda','colindantes') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_rio_quebrada','riosQuebradas') ;
        stringify1 = await utiles.replaceAll(stringify1, 'cod_edificacion','codEdificacion') ;
        edificacion = JSON.parse(stringify1); 
        
        stringify1 =JSON.stringify(edificacionInterna);
        stringify1 = await utiles.replaceAll(stringify1, 'num_edificacion','codEdificacion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_interna','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_ent_colinda','colindantes') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_rio_quebrada','riosQuebradas') ;
        stringify1 = await utiles.replaceAll(stringify1, 'cod_edificacion','codEdificacion') ;
        edificacionInterna = JSON.parse(stringify1); 
      
        stringify1 =JSON.stringify(entornoEdificacion);
        stringify1 = await utiles.replaceAll(stringify1, 'num_edificacion','codEdificacion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_interna','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_ent_colinda','colindantes') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_rio_quebrada','riosQuebradas') ;
        stringify1 = await utiles.replaceAll(stringify1, 'cod_edificacion','codEdificacion') ;
        entornoEdificacion = JSON.parse(stringify1); 
      
        var output1 = null;
        edificacion = JSON.stringify(edificacion.data);
        entornoEdificacion = JSON.stringify(entornoEdificacion.data);
        edificacionInterna = JSON.stringify(edificacionInterna.data);
        
        edificacion = JSON.parse(edificacion);
        entornoEdificacion = JSON.parse(entornoEdificacion);
        edificacionInterna = JSON.parse(edificacionInterna);
        edificacion = {
            "edificacion" : {
                "codEdificacion":edificacion , 
                "entornoEdificacion":{entornoEdificacion,listArchivo},
                "edificacionInterna":edificacionInterna
            }
        };
        
        output1 =  edificacion ;
               var resultado=[
               {"claveTramite":numtramite}, 
               {"codTipoTramite":codTipoTramite}, 
               {"email":email} , 
               {fechaRegistro :fecha},
               output1
               ];
         return {result: true,data:resultado,fechaConsulta:fechaConsulta};
      
       
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'},fechaConsulta:fechaConsulta};
}

async function paso6EdificacionGet(numtramite,email,codTipoTramite) {
    let params;

    var fechaConsulta = utiles.fecha();
    if (numtramite){
         params = {
                TableName: EDIFICACIONES_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Edificacion'},fechaConsulta:fechaConsulta};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Edificacion'},fechaConsulta:fechaConsulta};
}

async function paso6ArchivoGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    if (numtramite){
         params = {
                TableName: ARCHIVO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':ind_del': vigente
                },
               FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
        }
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
}

async  function grabar(params) {
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



module.exports = {grabar,
    paso6Edificacion,paso6EdificacionUpd,paso6EdificacionGet,paso6ArchivoGet,paso6ListaGet,
}