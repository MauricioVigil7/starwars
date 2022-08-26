const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;


var consin=true; 
async  function paso4valida(req) {
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
    
    valida = await utiles.validateParametro(req.direccion,'direccion');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.fechaInspeccion,'fechaInspeccion');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.horaInspeccion,'horaInspeccion');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(req.email,'email');
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateDate(req.fechaInspeccion);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validateDate(req.horaInspeccion);
    if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
    var stringify1 =JSON.stringify(req.listArchivo);
    valida = await utiles.IsJsonString(stringify1);
    if (!valida.result) {
          return valida;
    }
	return {result: true};
}
async  function paso4DatosNivelRiesgo(req) {

   /* console.log('**** paso4dao********');
    console.log('**** claveTramite :'+ req.claveTramite);
    console.log('**** listaArchivo :'+ req.listArchivo);
    console.log('**** direccion :'+ req.direccion);
    console.log('**** fechaInspeccion :'+ req.fechaInspeccion);
    console.log('**** horaInspeccion :'+ req.horaInspeccion);
    console.log('**** nombreInspector :'+ req.nombreInspector);
    console.log('**** email :'+ req.email);
    console.log('**** codTipoTramite :'+ req.codTipoTramite);
    console.log('**** fechaRegistro :'+ req.fechaRegistro);
    */
    
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    //console.log('**** fechaHora :'+ fechaHora);
     //****** inicio validadacion ************ 
	var valida = await  utiles.validateParametro(req.nombreInspector,'nombreInspector');
    var concat=",nom_inspector = :nom_inspector";
    if (!valida.result) {
         consin=false;
         concat="";
    }
     var seguir = await paso4valida(req);

     //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
   //****** fin validacion ************ 
    var stringify1 =JSON.stringify(req.listArchivo);
    stringify1 = await utiles.replaceAll(stringify1, 'codArchivo','num_archivo') ;
    stringify1 = await utiles.replaceAll(stringify1, 'tipoArchivo','tip_archivo');
    stringify1 = await utiles.replaceAll(stringify1, 'nomArchivo','nom_archivo');
    stringify1 = await utiles.replaceAll(stringify1, 'eliminado','ind_del');
    var lista = JSON.parse(stringify1); 
    //console.log('*****lista*******'+lista);
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
    
    var params=null;
    for(var x in lista){
            Item.ind_del= IND_DEL;
            //console.log('*****lista[x].tip_archivo*******'+lista[x].tip_archivo);
            valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
            if (!valida.result) {
               // console.log('*****lista[x].num_archivo*******'+lista[x].num_archivo);
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }
            valida = await  utiles.validateParametro(lista[x].tip_archivo,'tip_archivo');
            if (!valida.result) {
               // console.log('*****lista[x].tip_archivo*******'+lista[x].tip_archivo);
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }

        valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
        if (valida.result) {
            Item.nom_archivo=lista[x].nom_archivo;
        }else{ delete Item['nom_archivo'];}
        Item.num_archivo=lista[x].num_archivo;
        Item.num_tramite=req.claveTramite;
        Item.tip_archivo=lista[x].tip_archivo;
        Put = {TableName: ARCHIVO_TABLE, Item};
        Puts= {Put} ;
        var p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
    }
     var  ExpressionAttributeValues= {
  
                                    ":des_direccion": req.direccion,
                                    ":fec_modif": fechaHora,
                                    ":fec_inspeccion": req.fechaInspeccion,
                                    ":hor_inspeccion": req.horaInspeccion,
                                    ":nom_inspector": req.nombreInspector,
                                    ":cod_tipinforme":req.codTipoTramite,
                                    ":fec_actualizacion":req.fechaRegistro
                                  };
    if(!consin){
        delete ExpressionAttributeValues[':nom_inspector'];
      }
    var upd = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: "set fec_actualizacion =:fec_actualizacion,"+
                  "fec_modif = :fec_modif,des_direccion = :des_direccion,"+
                  "fec_inspeccion= :fec_inspeccion,hor_inspeccion= :hor_inspeccion"+
                  concat,
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              };
    TransactItems.push(upd);
    
    params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('result',result);
    return result;

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
            
            valida = await  utiles.validateParametro(lista[x].tip_archivo,'tip_archivo');
            if (!valida.result) {
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }      
            valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
            if (!valida.result) {              
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }
            /*valida = await  utiles.validarNumero(lista[x].tip_archivo,'tip_archivo');
            if (!valida.result) {
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }*/
            valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
            if (valida.result) {
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (!valida.result) {
                      return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
                }              
            }
	}
	return {result: true};
}



async  function getRegistrosArchivo(req) {
    
	var valida = null;
	var stringify =JSON.stringify(req.listArchivo);
	var ExpressionAttributeValues2 = null;
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
        ExpressionAttributeValues2= {
                                  
                                  ":tip_archivo": lista[x].tip_archivo,
                                  ":nom_archivo": lista[x].nom_archivo,
                                  ":ind_del": lista[x].ind_del
                                  };
           
            
          
            registros.push("tip_archivo = :tip_archivo");
            //lista[x].tip_archivo = parseInt(lista[x].tip_archivo);
            valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
            if (valida.result) {
                registros.push("ind_del = :ind_del");
                valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues2[':ind_del']=valida.data.codigo;
                //console.log('*****valida.data.codigo*******'+valida.data.codigo);
               
            }else{ 
				delete ExpressionAttributeValues2[':ind_del'];
			}
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result) {
                //console.log('*****lista[x].nom_archivo*******'+lista[x].nom_archivo);
              
               registros.push("nom_archivo = :nom_archivo");
            }else{ 
				delete ExpressionAttributeValues2[':nom_archivo'];
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
                      ExpressionAttributeValues: ExpressionAttributeValues2,
                     
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


async  function paso4DatosNivelRiesgoUpd(req) {

    /*console.log('**** paso4dao update********');
    console.log('**** claveTramite :'+ req.claveTramite);
    console.log('**** direccion :'+ req.direccion);
    console.log('**** fechaInspeccion :'+ req.fechaInspeccion);
    console.log('**** horaInspeccion :'+ req.horaInspeccion);
    console.log('**** nombreInspector :'+ req.nombreInspector);
    console.log('**** email :'+ req.email);
    console.log('**** fechaRegistro :'+ req.fechaRegistro);
    console.log('**** codTipoTramite :'+ req.codTipoTramite);*/
    var fechaHora = await utiles.fechaHora();

	var valida = null;
     //****** inicio validadacion ************ 
    var seguir = await paso4valida(req);

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
    TransactItems = await getRegistrosArchivo(req);
    // console.log('***********TransactItems*********',TransactItems);

    var  ExpressionAttributeValues= {
                                    ":des_direccion": req.direccion,
                     
                                    ":fec_modif": fechaHora,
                                    ":fec_inspeccion": req.fechaInspeccion,
                                    ":hor_inspeccion": req.horaInspeccion,
                                    ":nom_inspector": req.nombreInspector,
                                    ":cod_tipinforme":req.codTipoTramite,
                                    ":fec_actualizacion":req.fechaRegistro
                                  };
     valida = await  utiles.validateParametro(req.nombreInspector,'nombreInspector');
     var concat=",nom_inspector = :nom_inspector";
     
     if (!valida.result) {
         consin=false;
         delete ExpressionAttributeValues[':nom_inspector'];
         concat="";
        // console.log(ExpressionAttributeValues);
    }
     Update = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: "set fec_actualizacion =:fec_actualizacion,"+
                  "fec_modif = :fec_modif,des_direccion = :des_direccion,"+
                  "fec_inspeccion= :fec_inspeccion,hor_inspeccion= :hor_inspeccion"+
                  concat,
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


async function paso4DatosNivelRiesgoGet(numtramite,email,codTipoTramite) {
    
     //****** inicio validadacion ************ 
     //console.log('**** paso4DatosNivelRiesgoGet 1');
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
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
   //console.log("email",email);
   //console.log("numtramite",numtramite);
   //console.log("codTipoTramite",codTipoTramite);
    if (email && numtramite && codTipoTramite){
        var lista = await paso4ArchivoGet(numtramite) ;
        //console.log("lista",lista);
        for(var x of lista.data){
            delete x.num_tramite;
            delete x.des_archivo;
            delete x.ind_del;
       }
        var stringify =JSON.stringify(lista);

        stringify = await utiles.replaceAll(stringify, 'num_archivo','codArchivo') ;
        stringify = await utiles.replaceAll(stringify, 'tip_archivo','tipoArchivo');
        stringify = await utiles.replaceAll(stringify, 'nom_archivo','nomArchivo');
        stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
        lista = JSON.parse(stringify); 
        
        var listainspeccion = await paso4InspeccionGet(numtramite,email,codTipoTramite) ;
        //console.log('**** paso4DatosNivelRiesgoGet listainspeccion',listainspeccion);
        stringify =JSON.stringify(listainspeccion);

        stringify = await utiles.replaceAll(stringify, 'nom_inspector','nombreInspector') ;
        stringify = await utiles.replaceAll(stringify, 'des_direccion','direccion');
        stringify = await utiles.replaceAll(stringify, 'fec_inspeccion','fechaInspeccion');
        stringify = await utiles.replaceAll(stringify, 'hor_inspeccion','horaInspeccion');

        
        listainspeccion = JSON.parse(stringify); 
        var y;
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
               delete y.cod_tipinforme;
               
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_actualizacion;
               delete y.fec_solicitud;
               
               delete y.cod_estatus;
               delete y.porcen_eml;
               delete y.des_garantia;
               delete y.des_justificacion;
               delete y.porcen_pml;
               delete y.des_observacion;

               delete y.des_sumario;
               delete y.des_estructura;
               delete y.mto_contenido;
               delete y.des_nue_inver;
               delete y.des_mant;
               delete y.des_general;
               delete y.des_edif_inst;
               
           }

        var listArchivo = lista.data;
        var nivelRiesgo = listainspeccion.data;
        var output1 = {nivelRiesgo,listArchivo};
        var resultado=[
        {"claveTramite":numtramite}, 
        {"codTipoTramite":codTipoTramite}, 
        {"email":email} ,
        {fechaRegistro :fecha},
        output1];
        //console.log('**** paso4DatosNivelRiesgoGet resultado',resultado);
        return {result: true,data:resultado,fechaConsulta:fechaConsulta};

    } 
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados Paso 4 Datos Nivel Riesgo'},fechaConsulta:fechaConsulta};
}

async function paso4ArchivoGet(numtramite) {
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

async function paso4InspeccionGet(numtramite,email,codTipoTramite) {
    
    let params;
    var fechaHora = await utiles.fechaHora();

    var fechaConsulta = fechaHora;

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
     
            return {result: true,data:datos,fechaConsulta:fechaConsulta};
              
        }
        return {result: false,errores: {codigo:'3',mensaje:'No se encontraron datos en Inspeccion'},fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados Paso 4 Datos Nivel Riesgo'},fechaConsulta:fechaConsulta};

}

async function paso4Archivo(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    if (numtramite){
         params = {
                TableName: ARCHIVO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite':  numtramite
                    //':indregactual': estado
                },
               // FilterExpression: 'ind_regactual = :indregactual',
                KeyConditionExpression: 'num_tramite =:num_tramite',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if(result1 ['Count'] != '0'){
            return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta}; 
        }
    } 
     return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
}


module.exports = {
  paso4Archivo,paso4InspeccionGet, 
  paso4DatosNivelRiesgo,paso4DatosNivelRiesgoUpd,paso4DatosNivelRiesgoGet};