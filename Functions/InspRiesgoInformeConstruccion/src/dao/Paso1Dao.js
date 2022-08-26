const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const ARCHIVO_TABLE = process.env.TABLE_ARCHIVO;
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
    valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    if (req.trx=='POST'){
        valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
        if (!valida.result) {
            return {result: valida.result, errores:valida.errores};
        }
    }
    if (req.trx=='PUT'){
        valida = await utiles.validateParametro(req.fechaActualizacion,'fechaActualizacion');
        if (!valida.result) {
            return {result: valida.result, errores:valida.errores};
        }
    }
    
    if (req.trx=='POST'){
        valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
        if (!valida.result) {
            return {result: valida.result, errores:valida.errores};
        }
    }

    valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
   
    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }

   /* valida = await utiles.validateParametro(req.listArchivo,'listArchivo');
    if (valida.result) {
        var stringify1 =JSON.stringify(req.listArchivo);
        valida = await utiles.IsJsonString(stringify1);
        if (!valida.result) {
              return valida;
        }
        return valida;
    }*/
    
    return {result:true};

}
async  function paso1Ins(req) {

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
    
    var validalista = await validaListaArchivo(req);
	//console.log('**** validalista :'+ validalista.result);
    if (!validalista.result) {
         return validalista;
    }

   //****** fin validacion ************ 
    
    var TransactItems = [];
    var Put = {};
    var Puts="";
    var params=null;

    //valida = await utiles.validateParametro(req.listArchivo,'listArchivo');
 //   if (req.listArchivo != undefined) {
        var stringify1 =JSON.stringify(req.listArchivo);
        stringify1 = await utiles.replaceAll(stringify1, 'codArchivo','num_archivo') ;
        stringify1 = await utiles.replaceAll(stringify1, 'tipoArchivo','tip_archivo');
        stringify1 = await utiles.replaceAll(stringify1, 'nomArchivo','nom_archivo');
        stringify1 = await utiles.replaceAll(stringify1, 'eliminado','ind_del');  
        var lista = JSON.parse(stringify1); 

        var Item = {
            "num_archivo": "",
            "num_tramite" : "",
            "tip_archivo":"",
            "nom_archivo" :"",
            "ind_del" :""
        };

        for(var x in lista){ 
            Item = {
                "num_archivo": "",
                "num_tramite" : "",
                "tip_archivo":"",
                "nom_archivo" :"",
                "ind_del" :""
            };
            valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
            if (!valida.result) {
                return {result: valida.result, errores:valida.errores};
            }
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result) {
                Item.nom_archivo=lista[x].nom_archivo;
            }else{ 
                delete Item['nom_archivo'];
            }

            valida = await utiles.validateParametro(lista[x].tip_archivo,'tip_archivo');
            if (valida.result) {
                Item.tip_archivo=lista[x].tip_archivo;
            }else{ 
                delete Item['tip_archivo'];
            }

            Item.num_archivo=lista[x].num_archivo;
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
        
 //   }

     var  ExpressionAttributeValues= {
        ":des_direccion": req.datosCliente.direccion,
        ":fec_modif": fechaHora,
        ":nom_razsocial": req.datosCliente.nombreCliente,
        ":nom_inspector": req.datosCliente.nombreInspector,
        //":cod_tipinforme":req.codTipoTramite,
        ":fec_actualizacion":req.fechaRegistro
    };
    var setter="set ";
    var registros = [];
   // var valida=null;
     registros.push("fec_modif = :fec_modif");
     registros.push("fec_actualizacion = :fec_actualizacion");
     valida = await utiles.validateParametro(req.datosCliente.direccion,'datosCliente.direccion');
     if (valida.result) {
         registros.push("des_direccion = :des_direccion");
     }else{ 
             delete ExpressionAttributeValues[':des_direccion'];
     }
     valida = await utiles.validateParametro(req.datosCliente.nombreCliente,'datosCliente.nombreCliente');
     if (valida.result) {
         registros.push("nom_razsocial = :nom_razsocial");
     }else{ 
             delete ExpressionAttributeValues[':nom_razsocial'];
     }
     valida = await utiles.validateParametro(req.datosCliente.nombreInspector,'datosCliente.nombreInspector');
     if (valida.result) {
         registros.push("nom_inspector = :nom_inspector");
     }else{ 
             delete ExpressionAttributeValues[':nom_inspector'];
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
    //console.log('*****2*******',ExpressionAttributeValues);
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('****result*******',result);
    return result;
}

async  function save(params) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var exito = true;
    try {
             await  dynamoDbClient.transactWrite(params).promise();        
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log(error);
            exito = false;
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
  
}

async  function validaListaArchivo(req) {
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = null;
	var stringify =JSON.stringify(req.listArchivo);
	stringify = await utiles.replaceAll(stringify, 'codArchivo','num_archivo') ;
    stringify = await utiles.replaceAll(stringify, 'tipoArchivo','tip_archivo');
    stringify = await utiles.replaceAll(stringify, 'nomArchivo','nom_archivo');
    stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
    var lista = JSON.parse(stringify); 
	for(var x in lista){
            valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
            if (!valida.result) {              
                  return {result: valida.result, errores:valida.errores};
            }
            if(req.trx=='PUT'){
                valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
                //console.log('*****lista[x].ind_del*******'+lista[x].ind_del);
                if (valida.result) {
                    valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                    //console.log('*****valida*******',valida);
                    if (!valida.result) {
                          return {result: valida.result, errores:valida.errores};
                    }              
                }
            }
	}
	return {result:true};

}

async  function getRegistrosArchivo(req) {
    
	var valida = null;
	var stringify =JSON.stringify(req.listArchivo);
	var ExpressionAttributeValues = null;
	stringify = await utiles.replaceAll(stringify,'codArchivo', 'num_archivo') ;
    stringify = await utiles.replaceAll(stringify,'tipoArchivo', 'tip_archivo');
    stringify = await utiles.replaceAll(stringify,'nomArchivo', 'nom_archivo');
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
            ":tip_archivo": lista[x].tip_archivo,
            ":nom_archivo": lista[x].nom_archivo,
            ":ind_del": lista[x].ind_del
        };
        registros.push("tip_archivo = :tip_archivo");
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues[':ind_del']=valida.data.codigo;
                //console.log('*****valida.data.codigo*******'+valida.data.codigo);              
            }else{ 
				delete ExpressionAttributeValues[':ind_del'];
			}
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result) {
               // console.log('*****lista[x].nom_archivo*******'+lista[x].nom_archivo);            
               registros.push("nom_archivo = :nom_archivo");
            }else{ 
				delete ExpressionAttributeValues[':nom_archivo'];
			}
			//console.log('*****ExpressionAttributeValues*******',ExpressionAttributeValues); 
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


async  function paso1Upd(req) {

    //console.log('**** paso4dao update********');
    
    var fechaHora = await utiles.fechaHora();

	var valida = null;
     //****** inicio validadacion ************ 
    req.trx='PUT';
    var seguir = await pasovalida(req);
     //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
    var validalista = await validaListaArchivo(req);
	//console.log('**** validalista :'+ validalista.result);
    if (!validalista.result) {
         return validalista;
    }
   //****** fin validadacion ************ 

    var TransactItems = [];
	var p = null;
    var Update = null;
   // valida = await utiles.validateParametro(req.listArchivo      ,'listArchivo');
    //if (req.listArchivo != undefined) {
        TransactItems = await getRegistrosArchivo(req);
    //}
     //console.log('***********TransactItems*********',TransactItems);
     var  ExpressionAttributeValues= {
        ":des_direccion": req.datosCliente.direccion,
        ":fec_modif": fechaHora,
        ":nom_razsocial": req.datosCliente.nombreCliente,
        ":nom_inspector": req.datosCliente.nombreInspector,
        //":cod_tipinforme":req.codTipoTramite,
        ":fec_actualizacion":req.fechaActualizacion
    };
    var setter="set ";
    var registros = [];
   // var valida=null;
     registros.push("fec_modif = :fec_modif");
     registros.push("fec_actualizacion = :fec_actualizacion");
     valida = await utiles.validateParametro(req.datosCliente.direccion,'datosCliente.direccion');
     if (valida.result) {
         registros.push("des_direccion = :des_direccion");
     }else{ 
             delete ExpressionAttributeValues[':des_direccion'];
     }
     valida = await utiles.validateParametro(req.datosCliente.nombreCliente,'datosCliente.nombreCliente');
     if (valida.result) {
         registros.push("nom_razsocial = :nom_razsocial");
     }else{ 
             delete ExpressionAttributeValues[':nom_razsocial'];
     }
     valida = await utiles.validateParametro(req.datosCliente.nombreInspector,'datosCliente.nombreInspector');
     if (valida.result) {
         registros.push("nom_inspector = :nom_inspector");
     }else{ 
             delete ExpressionAttributeValues[':nom_inspector'];
     }
    
    for (var i=0; i<registros.length;i++){
          if(i==registros.length-1)
               setter = setter + registros[i] ;
          else setter = setter + registros[i] + "," ;
      }
    var Update = {
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
    p =JSON.stringify(Update);
    p = await JSON.parse(p);
    TransactItems.push(p);
    var params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('result',result);
    return result;

}


async function paso1Get(numtramite,email) {
    
    //****** inicio validadacion ************ 
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    console.info("get dao1: numtramite " , numtramite); 
    console.info("get dao1: email " , email); 
    var valida = await utiles.validateParametro(numtramite);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores};
    }
    
    valida = await utiles.validateParametro(email);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validarEmail(email);
    if (!valida.result) {
          return valida;
    }
    
   //****** fin validadacion ************
    
    if (email && numtramite){
        var lista = await ArchivosGet(numtramite) ;
        console.info("get dao1: lista " , lista); 
        for(var x of lista.data){
            delete x.num_tramite;
            delete x.ind_del;
       }
        var stringify =JSON.stringify(lista);
        stringify = await utiles.replaceAll(stringify, 'num_archivo','codArchivo') ;
        stringify = await utiles.replaceAll(stringify, 'tip_archivo','tipoArchivo');
        stringify = await utiles.replaceAll(stringify, 'nom_archivo','nomArchivo');
        stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
        lista = JSON.parse(stringify); 
        
        var listainspeccion = await InspeccionGet(numtramite,email) ;
        console.info("get dao1: listainspeccion " , listainspeccion);      
        stringify =JSON.stringify(listainspeccion);
        stringify = await utiles.replaceAll(stringify, 'nom_razsocial','nombreCliente') ;
        stringify = await utiles.replaceAll(stringify, 'des_direccion','direccion');
        stringify = await utiles.replaceAll(stringify, 'nom_inspector','nombreInspector');
        stringify = await utiles.replaceAll(stringify, 'cod_tipinforme','codTipoTramite');
        var fechaActualizacion='';
        //var codTipoTramite='';
        listainspeccion = JSON.parse(stringify); 
        var y,nombreCliente,nombreInspector,direccion,codTipoTramite;
        for (y of listainspeccion.data) {
            nombreCliente = y.nombreCliente;
            direccion = y.direccion;
            nombreInspector = y.nombreInspector;
            codTipoTramite = y.codTipoTramite;
               //delete y.nom_inspector;
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
               delete y.nom_razsocial;
               delete y.mto_total;
               codTipoTramite=y.codTipoTramite;
               fechaActualizacion=y.fec_actualizacion;
               delete y.codTipoTramite;
               delete y.fechaActualizacion;
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_solicitud;
               delete y.cod_estatus;
               delete y.porcen_eml;
               delete y.des_garantia;
               delete y.des_observacion;
               delete y.des_justificacion;
               delete y.porcen_pml;
               
               delete y.fec_inspeccion;
               delete y.fec_actualizacion;
               delete y.hor_inspeccion;
               delete y.mto_contenido;
               
           }

        var archivo = lista.data;
        var datosCliente = [
            {"nombreCliente":nombreCliente},
            {"direccion":direccion},
            {"nombreInspector":nombreInspector},
            {"codTipoTramite":codTipoTramite},
        ]
        var output = {datosCliente,"listArchivo":archivo};
        var resultado=[
            {"claveTramite":numtramite}, 
            {"codTipoTramite":codTipoTramite}, 
            {"email":email} , 
            {"fechaRegistro" :fechaActualizacion},
            output];
        return {result: true,data:resultado};

    } 
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados'},fechaConsulta:fechaConsulta};
}

async function ArchivosGet(numtramite) {
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
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
        }
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
}

async function InspeccionGet(numtramite,email) {
    
    let params;
    var fechaHora = await utiles.fechaHora();

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
  paso1Ins,paso1Upd,paso1Get};