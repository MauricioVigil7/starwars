const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE;
const ENLACE_TABLE = process.env.ENLACE_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const IND_DEL = process.env.IND_DEL;



async  function paso11valida(req) {
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
    var lista = JSON.parse(stringify); 
	for(var x in lista){
            valida = await  utiles.validateParametro(lista[x].codArchivo,'codArchivo');
            if (!valida.result) {              
                  return {result: valida.result, errores:valida.errores};
            }
            valida = await  utiles.validateParametro(lista[x].tipoArchivo,'tipoArchivo');
            if (!valida.result) {              
                  return {result: valida.result, errores:valida.errores};
            }
            if(req.trx=='PUT'){
                valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
                if (valida.result) {
                    valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                    if (!valida.result) {
                          return {result: valida.result, errores:valida.errores};
                    }              
                }
            }
	}
	return valida;
}




async  function paso11Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    //console.log('**** fechaHora :'+ fechaHora);
     //****** inicio validadacion ************ 
	var valida = null;
    var seguir = await paso11valida(req);
	if (!seguir.result) {
         return seguir;
    }
   //****** fin validacion ************ 
   var TransactItems = [];
   var Put = {};
   var Puts="";
   var params=null;
   var cont=1;
   var p = null;
   var stringify = null;
   var lista = null;
   var Item = null;
   if (req.listArchivo != undefined){
         stringify =JSON.stringify(req.listArchivo);
         lista = JSON.parse(stringify);
         Item = {
                "num_archivo": "",
                "num_tramite" : "",
                "tip_archivo":"",
                "nom_archivo" :"",
                "des_archivo" :"",
                "ind_del" :""
            };
            for(var x in lista){
                valida = await utiles.validateParametro(lista[x].codArchivo,'codArchivo');
                if (valida.result) {
                    Item.num_archivo=lista[x].codArchivo;
                }else{ 
                    delete Item['num_archivo'];
                }
                valida = await utiles.validateParametro(lista[x].tipoArchivo,'tipoArchivo');
                if (valida.result) {
                    Item.tip_archivo=lista[x].tipoArchivo;
                }else{ 
                    delete Item['tip_archivo'];
                }
                valida = await utiles.validateParametro(lista[x].nomArchivo,'nomArchivo');
                if (valida.result) {
                    Item.nom_archivo=lista[x].nomArchivo;
                }else{ 
                    delete Item['nom_archivo'];
                }
                valida = await utiles.validateParametro(lista[x].comentario,'comentario');
                if (valida.result) {
                    Item.des_archivo=lista[x].comentario;
                }else{ 
                    delete Item['des_archivo'];
                }
                
                //cont++;
                //Item.num_archivo= lista[x].codArchivo;
                Item.num_tramite=req.claveTramite;
                Item.ind_del= IND_DEL;
                //console.log('**** Item :', Item);
                Put = {TableName: ARCHIVO_TABLE, Item};
                Puts= {Put} ;
                p =JSON.stringify(Puts);
                p = await JSON.parse(p);
                TransactItems.push(p);
            }
    //console.log('**** TransactItems :', TransactItems);
   }
   
      if (req.listEnlace != undefined){
             stringify =JSON.stringify(req.listEnlace);
             lista = JSON.parse(stringify);
             Item= {
                "num_enlace" : "",
                "num_tramite" : "",
                "des_enlace" :"",
                "ind_del" : ""
            };
            // cont=1;
            for(var x in lista){
                valida = await utiles.validateParametro(lista[x].codEnlace,'codEnlace');
                if (valida.result) {
                    Item.num_enlace=lista[x].codEnlace;
                }else{ 
                    delete Item['num_enlace'];
                }
                valida = await utiles.validateParametro(lista[x].nomEnlace,'nomEnlace');
                if (valida.result) {
                    Item.des_enlace=lista[x].nomEnlace;
                }else{ 
                    delete Item['des_enlace'];
                }
               // cont++;
                //Item.num_enlace= lista[x].num_enlace;
                Item.num_tramite=req.claveTramite;
                Item.ind_del= IND_DEL;
                //console.log('**** Item :', Item);
                Put = {TableName: ENLACE_TABLE, Item};
                Puts= {Put} ;
                p =JSON.stringify(Puts);
                p = await JSON.parse(p);
               //TransactItems.push(p);
            }
    //console.log('**** TransactItems :', TransactItems);
   }
     var  ExpressionAttributeValues= {
        ":fec_modif": fechaHora,
        ":cod_tipinforme":req.codTipoTramite,
        ":fec_actualizacion":req.fechaRegistro
     };
    var upd = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: "set fec_actualizacion =:fec_actualizacion,"+
                  "fec_modif = :fec_modif",
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
    };
    //console.log('*****upd*******',upd);
    //TransactItems.push(upd);
    //console.log('*****2*******',ExpressionAttributeValues);
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('****result*******',result);
    return result;
}

async  function save(params) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    try {
             //console.log('*****3*******');
             await  dynamoDbClient.transactWrite(params).promise();
             //console.log('*****4*******');
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
   //console.log('*****exito*******:',exito);
   //return {result: exito}
}

async  function getRegistrosArchivo(req) {
    
	var valida = null;
	var stringify =JSON.stringify(req.listArchivo);
	var ExpressionAttributeValues = null;
	stringify = await utiles.replaceAll(stringify,'codArchivo', 'num_archivo') ;
	stringify = await utiles.replaceAll(stringify,'tipoArchivo', 'tip_archivo') ;
    stringify = await utiles.replaceAll(stringify,'nomArchivo', 'nom_archivo');
    stringify = await utiles.replaceAll(stringify,'comentario', 'des_archivo');
    stringify = await utiles.replaceAll(stringify,'eliminado', 'ind_del');
    
    var lista = JSON.parse(stringify); 
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
           // ":num_archivo": lista[x].num_archivo,
            ":tip_archivo": lista[x].tip_archivo,
            ":nom_archivo": lista[x].nom_archivo,
            ":des_archivo": lista[x].des_archivo,
            ":ind_del": lista[x].ind_del
        };
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (valida.result) {
                    if(lista[x].ind_del==true){
                        lista[x].ind_del ='1';
                        ExpressionAttributeValues[':ind_del']='1';
                    }else {
                        lista[x].ind_del ='0';
                        ExpressionAttributeValues[':ind_del']='0';
                    }
                 }
        }else{ 
				delete ExpressionAttributeValues[':ind_del'];
		}
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
		valida = await utiles.validateParametro(lista[x].des_archivo,'des_archivo');
        if (valida.result) {
               registros.push("des_archivo = :des_archivo");
        }else{ 
				delete ExpressionAttributeValues[':des_archivo'];
		}
        for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
        }
        //console.log('*****ExpressionAttributeValues*******:',ExpressionAttributeValues);
        key = { "num_tramite": req.claveTramite,"num_archivo": lista[x].num_archivo };
        //console.log('*****key*******:',key);
        //console.log('*****upd*******:',upd);
        Update = {
                TableName: ARCHIVO_TABLE,
                Key: key,
                UpdateExpression: upd,
                ExpressionAttributeValues: ExpressionAttributeValues,
                returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
        };
        Update ={Update};
        p =JSON.stringify(Update);
        //console.log('*****p*******' +p);
        p = await JSON.parse(p);
        TransactItems.push(p);
    }
	return TransactItems;
}


async  function getRegistrosEnlace(req) {
    
	var valida = null;
	var stringify =JSON.stringify(req.listEnlace);
	var ExpressionAttributeValues = null;
	stringify = await utiles.replaceAll(stringify,'codEnlace', 'num_enlace') ;
	stringify = await utiles.replaceAll(stringify,'nomEnlace', 'des_enlace') ;
    stringify = await utiles.replaceAll(stringify,'eliminado', 'ind_del');
    
    var lista = JSON.parse(stringify); 
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
           // ":num_enlace": lista[x].num_enlace,
            ":des_enlace": lista[x].des_enlace,
            ":ind_del": lista[x].ind_del
        };
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (valida.result) {
                    if(lista[x].ind_del==true){
                        lista[x].ind_del ='1';
                        ExpressionAttributeValues[':ind_del']='1';
                    }else {
                        lista[x].ind_del ='0';
                        ExpressionAttributeValues[':ind_del']='0';
                    }
                 }
        }else{ 
				delete ExpressionAttributeValues[':ind_del'];
		}
        valida = await utiles.validateParametro(lista[x].des_enlace,'des_enlace');
        if (valida.result) {
               registros.push("des_enlace = :des_enlace");
        }else{ 
				delete ExpressionAttributeValues[':des_enlace'];
		}
		
        for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
        }
        //console.log('*****ExpressionAttributeValues*******:',ExpressionAttributeValues);
        key = { "num_tramite": req.claveTramite,"num_enlace": lista[x].num_enlace };
            Update = {
                      TableName: ENLACE_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues,
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
            Update ={Update};
            p =JSON.stringify(Update);
            //console.log('*****p*******' +p);
            p = await JSON.parse(p);
            TransactItems.push(p);
    }
	return TransactItems;
}


async  function paso11Upd(req) {

    //console.log('**** paso4dao update********');
    var fechaHora = await utiles.fechaHora();
	var valida = null;
     //****** inicio validadacion ************ 
    var seguir = await paso11valida(req);
     //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
   //****** fin validadacion ************ 
    var TransactItems = [];
	var p = null;
    var Update = null;
    if(req.listArchivo){
       var archivos = await getRegistrosArchivo(req);
       //console.log('***********getRegistrosArchivo*********',archivos);
       TransactItems=archivos;
        //console.log('***********TransactItems*********',TransactItems);
    }
    if(req.listEnlace){
        var enlace = await getRegistrosEnlace(req);
        TransactItems = TransactItems.concat(enlace);
        //console.log('***********TransactItems*********',TransactItems);
    }
    var  ExpressionAttributeValues= {
         ":fec_modif": fechaHora,
         ":cod_tipinforme":req.codTipoTramite,
         ":fec_actualizacion":req.fechaRegistro
    };
     Update = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp: req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: "set fec_actualizacion =:fec_actualizacion,"+
                  "fec_modif = :fec_modif",
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
     };
    p =JSON.stringify(Update);
    p = await JSON.parse(p);
    TransactItems.push(p);
    var params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('result',result);
    return result;

}


async function paso11Get(numtramite,email) {
    
     //****** inicio validadacion ************ 
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    var valida = await utiles.validateParametro(numtramite);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validateParametro(email);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    valida = await utiles.validarEmail(email);
    if (!valida.result) {
          return valida;
    }
   //****** fin validadacion ************
    if (email && numtramite){
        var listaarchivo = await ArchivoGet(numtramite) ;
        for(var x of listaarchivo.data){
            delete x.num_tramite;
            //delete x.ind_del;
       }
       var stringify =JSON.stringify(listaarchivo);
       stringify = await utiles.replaceAll(stringify, 'num_archivo','codArchivo') ;
	   stringify = await utiles.replaceAll(stringify, 'tip_archivo','tipoArchivo') ;
       stringify = await utiles.replaceAll(stringify, 'nom_archivo','nomArchivo');
       stringify = await utiles.replaceAll(stringify, 'comentario','des_archivo');
       stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
       
       listaarchivo = JSON.parse(stringify); 
       var y;
        for (y of listaarchivo.data) {
            valida = await utiles.validateParametro(y.eliminado,'eliminado');
            if (valida.result) {
                if(y.eliminado=='0'){
                    y.eliminado = false;
                }
                if(y.eliminado=='1'){
                    y.eliminado = true;
                }
            }
        }
        
        var listaenlace = await EnlaceGet(numtramite) ;
        for(var x of listaenlace.data){
            delete x.num_tramite;
            //delete x.ind_del;
       }
       stringify =JSON.stringify(listaenlace);
       stringify = await utiles.replaceAll(stringify, 'num_enlace','codEnlace') ;
	   stringify = await utiles.replaceAll(stringify, 'des_enlace','nomEnlace') ;
       stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
       
       listaenlace = JSON.parse(stringify); 
       
        for (y of listaenlace.data) {
            valida = await utiles.validateParametro(y.eliminado,'eliminado');
            if (valida.result) {
                if(y.eliminado=='0'){
                    y.eliminado = false;
                }
                if(y.eliminado=='1'){
                    y.eliminado = true;
                }
            }
        }
       
       var listainspeccion = await InspeccionGet(numtramite,email) ;
        stringify =JSON.stringify(listainspeccion);
        stringify = await utiles.replaceAll(stringify, 'nom_inspector','nombreInspector') ;
        stringify = await utiles.replaceAll(stringify, 'fec_actualizacion','fechaActualizacion');
        stringify = await utiles.replaceAll(stringify, 'cod_tipinforme','codTipoTramite');
        var fechaActualizacion='';
        var codTipoTramite='';
        listainspeccion = JSON.parse(stringify); 
        
        for (y of listainspeccion.data) {
               delete y.num_piso;
               delete y.fec_ven_insp;
               delete y.mto_edificacion;
               delete y.cod_inspector;
               delete y.mto_existencia;
               delete y.cod_estado;
               delete y.num_latitud;
               delete y.colindantes;
               delete y.correo_insp;
               delete y.mto_maquinaria;
               delete y.descripcion;
               delete y.cod_estructura;
               delete y.riosQuebradas;
               delete y.des_ent_colinda;
               delete y.cod_uso;
               delete y.mto_lucro;
               delete y.actividad_local;
               delete y.nom_razsocial;
               delete y.mto_total;
               codTipoTramite=y.codTipoTramite;
               fechaActualizacion=y.fechaActualizacion;
               delete y.codTipoTramite;
               delete y.fechaActualizacion;
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_solicitud;
           }
           
        var resultado=[
            {"claveTramite":numtramite}, 
            {"codTipoTramite":codTipoTramite}, 
            {"email":email} , 
            {"fechaRegistro" :fechaActualizacion},
            {"listArchivo":listaarchivo.data},
            {"listEnlace":listaenlace.data}
            ];
        return {result: true,data:resultado};
    } 
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados'}};
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
  
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}

async function EnlaceGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    if (numtramite){
         params = {
                TableName: ENLACE_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite':  numtramite,
                    ':ind_del': vigente,
                },
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
  
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
        return {result: true,data:result1 ['Items']};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos'}};
}


async function InspeccionGet(numtramite,email) {
    
    let params;
    var fechaHora = await utiles.fechaHora();

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
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados'}};

}

module.exports = {
  save,paso11Ins, paso11Upd,paso11Get}