const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const EDIFICACION_TABLE = process.env.EDIFICACION_TABLE;
const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE;
const ACTIVIDAD_TABLE = process.env.ACTIVIDAD_TABLE;
const ALMACENAMIENTO_TABLE = process.env.ALMACENAMIENTO_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const IND_DEL = process.env.IND_DEL;


async  function paso6valida(req) {
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
    valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
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
	
	var stringify =JSON.stringify(req.listArchivo);
    valida = await utiles.IsJsonString(stringify);
    if (valida.result) {
          return valida;
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


async  function paso6Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    
     var valida = null;
     var seguir = await paso6valida(req);

     //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
    
    var stringify =JSON.stringify(req.listArchivo);
    
   //****** fin validacion ************ 
    stringify = await utiles.replaceAll(stringify, 'codArchivo','num_archivo') ;
    stringify = await utiles.replaceAll(stringify, 'tipoArchivo','tip_archivo');
    stringify = await utiles.replaceAll(stringify, 'nomArchivo','nom_archivo');
    stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
  
    var lista = JSON.parse(stringify); 
    //************** Archivo ******************
    var Item= {
                    "num_archivo": "",
                    "num_tramite" : "",
                    "tip_archivo":"",
                    "nom_archivo" :"",
                    "ind_del" :""
                  };
    var TransactItems = [];
    var Put = {};
    var Puts="";
	var p="";
    var params=null;
   
    for(var x in lista){
        valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
        if (!valida.result) {
              return {result: valida.result, errores:valida.errores};
        }
        valida = await utiles.validateParametro(lista[x].tip_archivo,'tip_archivo');
        if (valida.result) {
           Item.tip_archivo=lista[x].tip_archivo;
        }else{ delete Item['tip_archivo'];}
        
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
  //************** Archivo ******************
  
  //************** Edificaciones ******************
  //console.log('****descripcion*******',req.descripcionInterna.descripcion);
  //console.log('****num_latitud*******',req.descripcionInterna.latitud);
  //console.log('****num_longitud*******',req.descripcionInterna.longitud);
   Item= {
        "num_tramite": req.claveTramite,
        "num_edificacion" : context.awsRequestId,//req.codEdificacion,
        "des_interna":req.descripcionInterna.descripcion,
        "num_latitud" :req.descripcionInterna.latitud,
        "num_longitud" :req.descripcionInterna.longitud,
        "des_sepa_riesg" :req.descripcionInterna.separacionRiesgo,
        "des_ent_colinda" :req.entorno.colindantes,
        "des_natural" :req.entorno.naturaleza
        };
     valida = await utiles.validateParametro(req.descripcionInterna.descripcion,'descripcion');
    if (!valida.result) {
         delete Item['des_interna'];
    }
     valida = await utiles.validateParametro(req.descripcionInterna.latitud,'latitud');
    if (!valida.result) {
         delete Item['num_latitud'];
    }
     valida = await utiles.validateParametro(req.descripcionInterna.longitud,'longitud');
    if (!valida.result) {
         delete Item['num_longitud'];
    }
     valida = await utiles.validateParametro(req.descripcionInterna.separacionRiesgo,'separacionRiesgo');
    if (!valida.result) {
         delete Item['des_sepa_riesg'];
    }
    
    Put = {TableName: EDIFICACION_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
    TransactItems.push(p);
    
  //************** Edificaciones ******************
   
   //************** Actividad ******************
   Item= {
        "num_tramite": req.claveTramite,
        "num_actividad" : context.awsRequestId,//req.codActividad,
        "des_actividad":req.actividadDesarrollada.descripcion,
        "des_personal" :req.actividadDesarrollada.personal
        };
     valida = await utiles.validateParametro(req.actividadDesarrollada.descripcion,'descripcion');
    if (!valida.result) {
         delete Item['des_actividad'];
    }
     valida = await utiles.validateParametro(req.actividadDesarrollada.personal,'personal');
    if (!valida.result) {
         delete Item['des_personal'];
    }
    Put = {TableName: ACTIVIDAD_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
    TransactItems.push(p);
    
  //************** Actividad ******************
  
    
  //************** Almacenamiento ******************
  
   Item= {
        "num_tramite": req.claveTramite,
        "num_almacenamiento" : context.awsRequestId,//req.codAlmacenamiento,
        "nom_almacen":req.almacenes.nombreAlmacen,
        "des_edificacion":req.almacenes.edificacion,
        "des_mercaderia" :req.almacenes.mercaderiaAlmacenada,
        "des_caracteristica":req.almacenes.caracteristicasAlm,
        "des_inventario" :req.almacenes.inventarios
        };
    valida = await utiles.validateParametro(req.almacenes.nombreAlmacen,'nombreAlmacen');
    if (!valida.result) {
         delete Item['nom_almacen'];
    }
    valida = await utiles.validateParametro(req.almacenes.edificacion,'des_edificacion');
    if (!valida.result) {
         delete Item['des_edificacion'];
    }
     valida = await utiles.validateParametro(req.almacenes.mercaderiaAlmacenada,'mercaderiaAlmacenada');
    if (!valida.result) {
         delete Item['des_mercaderia'];
    }
     valida = await utiles.validateParametro(req.almacenes.caracteristicasAlm,'caracteristicasAlm');
    if (!valida.result) {
         delete Item['des_caracteristica'];
    }
     valida = await utiles.validateParametro(req.almacenes.inventarios,'inventarios');
    if (!valida.result) {
         delete Item['des_inventario'];
    }
    Put = {TableName: ALMACENAMIENTO_TABLE, Item};
    Puts= {Put} ;
    p =JSON.stringify(Puts);
    p = await JSON.parse(p);
    TransactItems.push(p);
    
  //************** Almacenamiento ******************
  
   
   
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
        var result=  await save(params);
	    //console.log('****result*******',result);
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
async  function paso6Upd(req) {

    
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
    
    var stringify2 =JSON.stringify(req.listArchivo);
   
    stringify2 = await utiles.replaceAll(stringify2, 'codArchivo','num_archivo') ;
    stringify2 = await utiles.replaceAll(stringify2, 'tipoArchivo','tip_archivo');
    stringify2 = await utiles.replaceAll(stringify2, 'nomArchivo','nom_archivo');
    stringify2 = await utiles.replaceAll(stringify2, 'eliminado','ind_del');
    
    var lista = JSON.parse(stringify2); 
    
    var upd="";
    var registros = [];
	var key = null;
    var Update = null;
    for(var x in lista){
        upd="set ";
        registros = [];
       var ExpressionAttributeValues= {
                                  
                                  ":tip_archivo": lista[x].tip_archivo,
                                  ":nom_archivo": lista[x].nom_archivo,
                                  ":ind_del": lista[x].ind_del
                                  };
            //registros.push("tip_archivo = :tip_archivo");
            valida = await utiles.validateParametro(lista[x].tip_archivo,'tip_archivo');
            if (valida.result) {
                registros.push("tip_archivo = :tip_archivo");
            }else{ 
				delete ExpressionAttributeValues[':tip_archivo'];
			}
            
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result) {
               registros.push("nom_archivo = :nom_archivo");
            }else{ 
				delete ExpressionAttributeValues[':nom_archivo'];
			}
            
            valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
            if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues[':ind_del']=valida.data.codigo;
            }else{ 
				delete ExpressionAttributeValues[':ind_del'];
			}
            
             for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
            }
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
     //************  Edificion ***************       
    var  ExpressionAttributeValues= {
        ":des_interna": req.descripcionInterna.descripcion,
        ":num_latitud": req.descripcionInterna.latitud,
        ":num_longitud": req.descripcionInterna.longitud,
        ":des_sepa_riesg": req.descripcionInterna.separacionRiesgo,
        ":des_ent_colinda": req.entorno.colindantes,
        ":des_natural": req.entorno.naturaleza
    };
    //console.log('*****num_latitud*******' + req.descripcionInterna.latitud);
    //console.log('*****longitud*******' + req.descripcionInterna.longitud);
    //console.log('*****separacionRiesgo*******' + req.descripcionInterna.separacionRiesgo);
    upd="set ";
    registros = [];
    valida = await utiles.validateParametro(req.entorno.colindantes,'colindantes');
    if (valida.result) {
         registros.push("des_ent_colinda = :des_ent_colinda");
    }else{
         delete ExpressionAttributeValues[':des_ent_colinda'];
    }
    valida = await utiles.validateParametro(req.entorno.naturaleza,'naturaleza');
    if (valida.result) {
         registros.push("des_natural = :des_natural");
    }else{
         delete ExpressionAttributeValues[':des_natural'];
    }
    
    valida = await utiles.validateParametro(req.descripcionInterna.descripcion,'descripcion');
    if (valida.result) {
         registros.push("des_interna = :des_interna");
    }else{
         delete ExpressionAttributeValues[':des_interna'];
    }
    valida = await utiles.validateParametro(req.descripcionInterna.latitud,'latitud');
    if (valida.result) {
         registros.push("num_latitud = :num_latitud");
    }else{
         delete ExpressionAttributeValues[':num_latitud'];
    }
    valida = await utiles.validateParametro(req.descripcionInterna.longitud,'longitud');
    if (valida.result) {
         registros.push("num_longitud = :num_longitud");
    }else{
         delete ExpressionAttributeValues[':num_longitud'];
    }
    valida = await utiles.validateParametro(req.descripcionInterna.separacionRiesgo,'separacionRiesgo');
    if (valida.result) {
         registros.push("des_sepa_riesg = :des_sepa_riesg");
    }else{
         delete ExpressionAttributeValues[':des_sepa_riesg'];
    }
    for (var i=0; i<registros.length;i++){
        if(i==registros.length-1)
             upd = upd + registros[i] ;
        else upd = upd + registros[i] + "," ;
    }
     Update = {
               Update: {
                      TableName: EDIFICACION_TABLE,
                      Key: {
                        num_tramite: req.claveTramite,
                        num_edificacion: req.descripcionInterna.codEdificacion
                      },
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      //ConditionExpression: "num_edificacion = :num_edificacion",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                     }
              };
    p =JSON.stringify(Update);
    //console.log('*****p*******' +p);
    p = await JSON.parse(p);
    valida = await utiles.validateParametro(req.descripcionInterna.codEdificacion,'descripcion');
    if (valida.result) {
        TransactItems.push(p);
    }
    //************  Edificion ***************
     
    //************  Actividad ***************
    ExpressionAttributeValues= {
       // ":num_actividad": req.actividadDesarrollada.codActividad,
        ":des_actividad": req.actividadDesarrollada.descripcion,
        ":des_personal": req.actividadDesarrollada.personal
    };
    upd="set ";
    registros = [];
    valida = await utiles.validateParametro(req.actividadDesarrollada.descripcion,'descripcion');
    if (valida.result) {
         registros.push("des_actividad = :des_actividad");
    }else{
         delete ExpressionAttributeValues[':des_actividad'];
    }
    valida = await utiles.validateParametro(req.actividadDesarrollada.personal,'personal');
    if (valida.result) {
         registros.push("des_personal = :des_personal");
    }else{
         delete ExpressionAttributeValues[':des_personal'];
    }
    
    
    for (var i=0; i<registros.length;i++){
        if(i==registros.length-1)
             upd = upd + registros[i] ;
        else upd = upd + registros[i] + "," ;
    }
     Update = {
               Update: {
                      TableName: ACTIVIDAD_TABLE,
                      Key: {
                        num_tramite: req.claveTramite,
                        num_actividad: req.actividadDesarrollada.codActividad
                      },
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      //ConditionExpression: "num_edificacion = :num_edificacion",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                     }
              };
    p =JSON.stringify(Update);
    //console.log('*****p*******' +p);
    p = await JSON.parse(p);
    valida = await utiles.validateParametro(req.actividadDesarrollada.codActividad,'codActividad');
    if (valida.result) {
        TransactItems.push(p);
    }
   
     //************  Actividad ***************
     
     
    //************  Almacenamiento ***************
    ExpressionAttributeValues= {
       // ":num_actividad": req.actividadDesarrollada.codActividad,
        ":nom_almacen": req.almacenes.nombreAlmacen,
        ":des_edificacion": req.almacenes.edificacion,
        ":des_mercaderia": req.almacenes.mercaderiaAlmacenada,
        ":des_caracteristica": req.almacenes.caracteristicasAlm,
        ":des_inventario": req.almacenes.inventarios,
    };
    upd="set ";
    registros = [];
    valida = await utiles.validateParametro(req.almacenes.nombreAlmacen,'nombreAlmacen');
    if (valida.result) {
         registros.push("nom_almacen = :nom_almacen");
    }else{
         delete ExpressionAttributeValues[':nom_almacen'];
    }
    valida = await utiles.validateParametro(req.almacenes.edificacion,'edificacion');
    if (valida.result) {
         registros.push("des_edificacion = :des_edificacion");
    }else{
         delete ExpressionAttributeValues[':des_edificacion'];
    }
    valida = await utiles.validateParametro(req.almacenes.mercaderiaAlmacenada,'mercaderiaAlmacenada');
    if (valida.result) {
         registros.push("des_mercaderia = :des_mercaderia");
    }else{
         delete ExpressionAttributeValues[':des_mercaderia'];
    }
    valida = await utiles.validateParametro(req.almacenes.caracteristicasAlm,'caracteristicasAlm');
    if (valida.result) {
         registros.push("des_caracteristica = :des_caracteristica");
    }else{
         delete ExpressionAttributeValues[':des_caracteristica'];
    }
    valida = await utiles.validateParametro(req.almacenes.inventarios,'inventarios');
    if (valida.result) {
         registros.push("des_inventario = :des_inventario");
    }else{
         delete ExpressionAttributeValues[':des_inventario'];
    }
    
    
    for (var i=0; i<registros.length;i++){
        if(i==registros.length-1)
             upd = upd + registros[i] ;
        else upd = upd + registros[i] + "," ;
    }
     Update = {
               Update: {
                      TableName: ALMACENAMIENTO_TABLE,
                      Key: {
                        num_tramite: req.claveTramite,
                        num_almacenamiento: req.almacenes.codAlmacenamiento
                      },
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      //ConditionExpression: "num_edificacion = :num_edificacion",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                     }
              };
    p =JSON.stringify(Update);
    //console.log('*****p*******' +p);
    p = await JSON.parse(p);
    valida = await utiles.validateParametro(req.almacenes.codAlmacenamiento,'codAlmacenamiento');
    if (valida.result) {
        TransactItems.push(p);
    }
     
     //************  Almacenamiento ***************

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
     var result=  await save(params);
	 //console.log('**** result :',result);
     return result;
}


async function paso6Get(numtramite,email) {
   
    //console.log('numtramite:'+numtramite);
    //console.log('email:'+email);
    ////console.log('codTipoTramite:'+codTipoTramite);
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
	var stringify1 = null;
    if (numtramite){

        //console.log('****1****');
        var descripcionInterna = await EdificacionGet(numtramite) ;
        //console.log('****2****');
        var actividadDesarrollada = await ActividadGet(numtramite) ;
        //console.log('****3****');
        var almacenes = await AlmacenamientoGet(numtramite) ;
        //console.log('****4****');

         var entorno = JSON.parse(JSON.stringify(descripcionInterna));
         var y;
         //console.log('****5****');
         for (y of descripcionInterna.data) {
            delete y.num_edificacion;
            delete y.num_tramite;
            delete y.fec_modif;
            //delete y.num_longitud;
            //delete y.des_sepa_riesg;
          }
          //console.log('****6****');
          for (y of entorno.data) {
            delete y.num_tramite;
            delete y.num_edificacion;
            delete y.fec_modif;
            delete y.num_latitud;
            delete y.num_longitud;
            delete y.des_sepa_riesg;
            //delete y.des_sepa_riesg;
          }
          //console.log('****7****');
        var listaArchivo = await paso6ArchivoGet(numtramite) ;
        var valida = null;
        //console.log('****8****');
        for (y of listaArchivo.data) {
            delete y.num_tramite;
            //delete y.ind_del;
            valida = await utiles.validateParametro(y.ind_del,'ind_del');
            if (valida.result) {
                if(y.ind_del=='0') y.ind_del =false;
                else y.ind_del =true;
            }
          }
        //var listaArchivo = {};
        //console.log('****8****');
        if(listaArchivo.result){
            stringify1 =JSON.stringify(listaArchivo);
            stringify1 = await utiles.replaceAll(stringify1, 'num_archivo','codArchivo') ;
            stringify1 = await utiles.replaceAll(stringify1, 'tip_archivo','tipoArchivo');
            stringify1 = await utiles.replaceAll(stringify1, 'nom_archivo','nomArchivo');
            stringify1 = await utiles.replaceAll(stringify1, 'ind_del','eliminado');
            listaArchivo = JSON.parse(stringify1); 
        }else{listaArchivo={};}
        //console.log('****9****');
        stringify1 =JSON.stringify(descripcionInterna);
        stringify1 = await utiles.replaceAll(stringify1, 'des_interna','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'num_latitud','latitud') ;
        stringify1 = await utiles.replaceAll(stringify1, 'num_longitud','longitud') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_sepa_riesg','separacionRiesgo') ;
        descripcionInterna = JSON.parse(stringify1);
        //console.log('****10****');
         for (y of descripcionInterna.data) {
            delete y.num_edificacion;
            delete y.num_tramite;
            delete y.des_natural;
            delete y.des_ent_colinda;
            delete y.des_rio_quebrada;
          }
          //console.log('****11****');
        
        stringify1 =JSON.stringify(entorno);
        stringify1 = await utiles.replaceAll(stringify1, 'des_ent_colinda','colindantes') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_natural','naturaleza') ;
        entorno = JSON.parse(stringify1);
        for (y of entorno.data) {
            delete y.des_interna;
            delete y.des_rio_quebrada;
          }
          //console.log('****12****');
        stringify1 =JSON.stringify(actividadDesarrollada);
        stringify1 = await utiles.replaceAll(stringify1, 'des_actividad','descripcion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_personal','personal') ;
        actividadDesarrollada = JSON.parse(stringify1);
        for (y of actividadDesarrollada.data) {
            delete y.num_actividad;
            delete y.num_tramite;
            delete y.fec_modif;
            delete y.num_longitud;
            delete y.des_sepa_riesg;
          } 
          //console.log('****13****');
        stringify1 =JSON.stringify(almacenes);
        stringify1 = await utiles.replaceAll(stringify1, 'nom_almacen','nombreAlmacen') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_edificacion','edificacion') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_mercaderia','mercaderiaAlmacenada') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_caracteristica','caracteristicasAlm') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_inventario','inventarios') ;
        almacenes = JSON.parse(stringify1);
        for (y of almacenes.data) {
            delete y.num_almacenamiento;
            delete y.num_tramite;
            delete y.fec_modif;
            delete y.num_longitud;
            delete y.des_sepa_riesg;
          }
          //console.log('****14****');
        var output1 = {
                  "descripcionInterna":descripcionInterna.data,
                  "entorno":entorno.data,
                  "actividadDesarrollada":actividadDesarrollada.data,
                  "almacenes":almacenes.data,
                  "listArchivo":listaArchivo.data
               };

               var resultado=[{"claveTramite":numtramite}, 
               //{"codTipoTramite":codTipoTramite}, 
               {"email":email} , {fechaRegistro :fecha},
               output1];
               //console.log('****15****',resultado);
         return {result: true,data:resultado};

    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}

async function EdificacionGet(numtramite) {
    let params;

    var fechaConsulta = utiles.fecha();
    if (numtramite){
         params = {
                TableName: EDIFICACION_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}

async function AlmacenamientoGet(numtramite) {
    let params;

    var fechaConsulta = utiles.fecha();
    if (numtramite){
         params = {
                TableName: ALMACENAMIENTO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}



async function ActividadGet(numtramite) {
    let params;

    var fechaConsulta = utiles.fecha();
    if (numtramite){
         params = {
                TableName: ACTIVIDAD_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}


async function EdificacionGet(numtramite,email) {
    let params;

    var fechaConsulta = utiles.fecha();
    if (numtramite){
         params = {
                TableName: EDIFICACION_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        //console.log('true:');
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
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
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Archivo'}};
        }
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Archivo'}};
}

module.exports = {
    paso6Ins,paso6Upd,paso6Get
}