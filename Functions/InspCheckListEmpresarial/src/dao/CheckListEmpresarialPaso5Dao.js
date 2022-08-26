const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const ENTREVISTADO_TABLE = process.env.ENTREVISTADO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;

async  function paso5InformacionGeneral(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    let stringify =JSON.stringify(req.datosGenerales.listaEntrevistados);
    stringify = await utiles.replaceAll(stringify, 'codEntrevistado','num_entrevistado') ;
    stringify = await utiles.replaceAll(stringify, 'nombreEntrevistado','nom_entrevistado');
    stringify = await utiles.replaceAll(stringify, 'cargo','des_cargo');
    stringify = await utiles.replaceAll(stringify, 'correo','des_correo');
    stringify = await utiles.replaceAll(stringify, 'telefono','des_telefono');
    stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
    
    var lista = JSON.parse(stringify); 
    var seguir = await pasoValida(req);
    //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
	
    var TransactItems = [];
    var Put = {};
    var Puts="";
    var params=null;
	var valida = true;
	var p = null;
    var cont=0;
    for(var x in lista){
        var Item = {
            "num_tramite" : "",
            "num_entrevistado": "",
            "nom_entrevistado": "",
            "des_correo": "",
            "des_telefono": "",
            "des_cargo":"",
            "ind_del" :""
        };
        valida = await  utiles.validateParametro(lista[x].des_telefono,'des_telefono');
        if (valida.result) {
             delete Item['des_telefono'];
        }else Item.des_telefono=lista[x].des_telefono;

        valida = await  utiles.validateParametro(lista[x].des_cargo,'des_cargo');
        if (valida.result) {
             delete Item['des_cargo'];
        }else Item.des_cargo=lista[x].des_cargo;

        valida = await  utiles.validateParametro(lista[x].nom_entrevistado,'nom_entrevistado');
        if (valida.result) {
             delete Item['nom_entrevistado'];
        }else Item.nom_entrevistado=lista[x].nom_entrevistado;
        
        valida = await  utiles.validateParametro(lista[x].des_cargo,'des_cargo');
        if (valida.result) {
             delete Item['des_cargo'];
        }else Item.des_cargo=lista[x].des_cargo;
        cont++;
        Item.num_tramite=req.claveTramite;
        Item.num_entrevistado=req.codEntrevistado.concat(cont);
        Item.nom_entrevistado=lista[x].nom_entrevistado;
        Item.ind_del = IND_DEL;

        Put = {TableName: ENTREVISTADO_TABLE, Item};
        Puts= {Put} ;
        p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
   }

    var upd = {
                  Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    correo_insp :req.email
                  },
                  UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion," + 
                    "mto_contenido = :mto_contenido,"+
                    "nom_razsocial= :nom_razsocial,"+
                    "actividad_local= :actividad_local,"+
                    "num_piso= :num_piso," +
                    "num_sotano = :num_sotano,"+
                    "cod_estructura=:cod_estructura,"+
                    "cod_uso=:cod_uso,"+
                    "num_latitud=:num_latitud,"+
                    "num_longitud=:num_longitud,"+
                    "mto_edificacion=:mto_edificacion,"+
                    "mto_maquinaria=:mto_maquinaria,"+
                    "mto_existencia=:mto_existencia,"+
                    "mto_lucro=:mto_lucro,"+
                    "mto_total=:mto_total"
                  ,
                  ExpressionAttributeValues: {
                    //":correo_insp" :req.email,
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion":req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite,
                    ":mto_contenido":req.valoresDeclarados.montoContenido,
                    ":nom_razsocial":req.datosGenerales.razonSocial,
                    ":actividad_local":req.datosGenerales.actividadLocal,
                    ":num_piso" :req.informacionSBS.numeroPisos,
                    ":num_sotano" :req.informacionSBS.numeroSotanos,
                    ":cod_estructura":req.informacionSBS.codTipoEstructura,
                    ":cod_uso":req.informacionSBS.codTipoUso,
                    ":num_latitud" :req.informacionSBS.coordLatitud,
                    ":num_longitud":req.informacionSBS.coordLongitud,
                    ":mto_edificacion":req.valoresDeclarados.montoEdificacion,
                    ":mto_maquinaria":req.valoresDeclarados.montoMaquinaria,
                    ":mto_existencia":req.valoresDeclarados.montoExistencia,
                    ":mto_lucro":req.valoresDeclarados.montoLucroCesante,
                    ":mto_total":req.valoresDeclarados.total
                  },
                 ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                 returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              };
        TransactItems.push(upd);
        params = { "TransactItems":TransactItems};
	    var result =  await save(params);
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


async  function pasoValida(req) {
	//****** inicio validadacion ************ 
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    
	var valida = null;
    var valoresparam = [
	req.codTipoTramite,req.claveTramite,req.email, req.fechaRegistro,
	
	req.datosGenerales.razonSocial, req.datosGenerales.actividadLocal,
	
	req.informacionSBS.numeroPisos,req.informacionSBS.numeroSotanos,
    req.informacionSBS.codTipoEstructura,req.informacionSBS.codTipoUso,
	req.informacionSBS.coordLatitud,req.informacionSBS.coordLongitud,
	
	req.valoresDeclarados.montoEdificacion,req.valoresDeclarados.montoMaquinaria,
	req.valoresDeclarados.montoExistencia,req.valoresDeclarados.montoLucroCesante,
	req.valoresDeclarados.total
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email', 'fechaRegistro',
	'razonSocial', 'actividadLocal',
	'numeroPisos','numeroSotanos','codTipoEstructura','codTipoUso',
	'coordLatitud','coordLongitud','montoEdificacion',
	'montoMaquinaria','montoExistencia','montoLucroCesante','total'
	];

   for(var i = 0; i <= 3; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
		}
	}
	
	for(var i = 6; i <= 9; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (valida.result) {
		    valida = await utiles.validarNumero(valoresparam[i],namesparam[i]);
		    if (!valida.result) {
                return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
	    	}   
          //return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
		}
	}
	
	for(var i = 10; i <= 16; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (valida.result) {
		    valida = await utiles.validarFloat(valoresparam[i]);
		    if (!valida.result) {
                return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
	    	}   
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
		}
	}


    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	return {result: true};
}

async  function getRegistrosEntrevistados(lista,req) {
    
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = null;
	var ExpressionAttributeValues = null;
	
    var TransactItems = [];
	var p = null;
    var registros = [];
    //console.log('**** 1 ********');
    for(var x in lista){
        registros = [];
        ExpressionAttributeValues = {
                ":nom_entrevistado": lista[x].nom_entrevistado,
                ":des_cargo": lista[x].des_cargo,
                ":des_correo": lista[x].des_correo,
                ":des_telefono": lista[x].des_telefono,
                ":ind_del": lista[x].ind_del
        };
        valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
        if (valida.result) {
               valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (!valida.result) {
                      return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
                }
                registros.push("ind_del = :ind_del");
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues[':ind_del']=valida.data.codigo;
        }else{ delete ExpressionAttributeValues[':ind_del'];}
           
        valida = await utiles.validateParametro(lista[x].nom_entrevistado,'nom_entrevistado');
        if (valida.result) {
               registros.push("nom_entrevistado = :nom_entrevistado");
        }else{ delete ExpressionAttributeValues[':nom_entrevistado'];}
        
        valida = await utiles.validateParametro(lista[x].des_cargo,'des_cargo');
        if (valida.result) {
               registros.push("des_cargo = :des_cargo");
        }else{ delete ExpressionAttributeValues[':des_cargo'];} 

        valida = await utiles.validateParametro(lista[x].des_correo,'des_correo');
        if (valida.result) {
               registros.push("des_correo = :des_correo");
        }else{ delete ExpressionAttributeValues[':des_correo'];} 

        valida = await utiles.validateParametro(lista[x].des_telefono,'des_telefono');
        if (valida.result) {
               registros.push("des_telefono = :des_telefono");
        }else{ delete ExpressionAttributeValues[':des_telefono'];} 
        
        var entrevistado= await entrevistadoGet(req.claveTramite,lista[x].num_entrevistado);
        if (!entrevistado.result) {
             return {result: entrevistado.result, errores:entrevistado.errores,fechaConsulta:fechaConsulta};
        }
        
		p = await getRegistro(registros,req.claveTramite,lista[x].num_entrevistado,ExpressionAttributeValues);
		//console.log('**** p ********',p);
        TransactItems.push(p);
     

    }
	return TransactItems;
}

async  function getRegistro(registros,numtramite,numentrevistado,ExpressionAttributeValues) {
     var upd="set ";
	 for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
         }
     var key = { "num_tramite": numtramite,"num_entrevistado": numentrevistado};
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
	 return p;
}


async  function paso5InformacionGeneralUpd(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var stringify = null;
    var TransactItems = [];
    var params=null;
    if(req.datosGenerales.listaEntrevistados){
        stringify =JSON.stringify(req.datosGenerales.listaEntrevistados);
        var valida = await utiles.IsJsonString(stringify);
        if (!valida.result) {
              return valida;
        }
        stringify = await utiles.replaceAll(stringify, 'codEntrevistado','num_entrevistado') ;
        stringify = await utiles.replaceAll(stringify, 'nombreEntrevistado','nom_entrevistado');
        stringify = await utiles.replaceAll(stringify, 'cargo','des_cargo');
        stringify = await utiles.replaceAll(stringify, 'correo','des_correo');
        stringify = await utiles.replaceAll(stringify, 'telefono','des_telefono');
        stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
        var lista = JSON.parse(stringify); 
    	var listEntrevistados = await getRegistrosEntrevistados(lista,req);
    	if(listEntrevistados != undefined){
    	    TransactItems = TransactItems.concat(listEntrevistados);
    	}
    }
	var seguir = await pasoValida(req);
    //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
    }
	var upd="";
    //console.log('TransactItems',TransactItems);
    upd = {
        Update: {
        TableName: INSPECCIONES_TABLE,
        Key: {
                    num_tramite: req.claveTramite,
                    correo_insp :req.email
             },
        UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion," + 
                   // "cod_tipinforme = :cod_tipinforme,"+
                    "mto_contenido = :mto_contenido,"+     
                    "nom_razsocial= :nom_razsocial,"+
                    "actividad_local= :actividad_local,"+
                    "num_piso= :num_piso," +
                    "num_sotano = :num_sotano,"+
                    "cod_estructura=:cod_estructura,"+
                    "cod_uso=:cod_uso,"+
                    "num_latitud=:num_latitud,"+
                    "num_longitud=:num_longitud,"+
                    "mto_edificacion=:mto_edificacion,"+
                    "mto_maquinaria=:mto_maquinaria,"+
                    "mto_existencia=:mto_existencia,"+
                    "mto_lucro=:mto_lucro,"+
                    "mto_total=:mto_total"
                  ,
                  ExpressionAttributeValues: {
                    //":correo_insp" :req.email,
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion":req.fechaRegistro,
                    //":cod_tipinforme":req.codTipoTramite, 
                    ":mto_contenido":req.valoresDeclarados.montoContenido,
                    ":nom_razsocial":req.datosGenerales.razonSocial,
                    ":actividad_local":req.datosGenerales.actividadLocal,
                    ":num_piso" :req.informacionSBS.numeroPisos,
                    ":num_sotano" :req.informacionSBS.numeroSotanos,
                    ":cod_estructura":req.informacionSBS.codTipoEstructura,
                    ":cod_uso":req.informacionSBS.codTipoUso,
                    ":num_latitud":req.informacionSBS.coordLatitud,
                    ":num_longitud":req.informacionSBS.coordLongitud,
                    ":mto_edificacion":req.valoresDeclarados.montoEdificacion,
                    ":mto_maquinaria":req.valoresDeclarados.montoMaquinaria,
                    ":mto_existencia":req.valoresDeclarados.montoExistencia,
                    ":mto_lucro":req.valoresDeclarados.montoLucroCesante,
                    ":mto_total":req.valoresDeclarados.total
                  },
                  //ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                 returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              };
         TransactItems.push(upd);
         params = { "TransactItems":TransactItems};
        // console.log('TransactItems',TransactItems);
       var result =  await save(params);
	   //console.log('result',result);
       return result;
}

async function paso5InformacionGeneralGet(numtramite,email,codTipoTramite) {
   /* console.log('numtramite******',numtramite);
    console.log('email***********',email);
    console.log('codTipoTramite**',codTipoTramite);*/
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    if (email && numtramite&&codTipoTramite){
    var y,x;
    var listainspeccion = await paso5InspeccionGet(numtramite,email,codTipoTramite) ;
    var datosGeneralesIni=JSON.parse(JSON.stringify(listainspeccion));
    var informacionSBSIni=JSON.parse(JSON.stringify(listainspeccion));
    var valoresDeclaradosIni=JSON.parse(JSON.stringify(listainspeccion));
    
    let stringify =JSON.stringify(datosGeneralesIni);
    stringify = await utiles.replaceAll(stringify, 'actividad_local','actividadLocal') ;
    stringify = await utiles.replaceAll(stringify, 'nom_razsocial','razonSocial');
    datosGeneralesIni = JSON.parse(stringify);
    
    stringify =JSON.stringify(informacionSBSIni);
    stringify = await utiles.replaceAll(stringify, 'num_piso','numeroPisos') ;
    stringify = await utiles.replaceAll(stringify, 'num_latitud','coordLatitud');
    stringify = await utiles.replaceAll(stringify, 'cod_estructura','codTipoEstructura');
    stringify = await utiles.replaceAll(stringify, 'cod_uso','codTipoUso');
    stringify = await utiles.replaceAll(stringify, 'num_longitud','coordLongitud');
    stringify = await utiles.replaceAll(stringify, 'num_sotano','numeroSotanos');
    informacionSBSIni = JSON.parse(stringify);
     //console.log(informacionSBSIni)  ; //x.montoContenido;
    for (y of datosGeneralesIni.data) {
                delete y.des_sumario;
                delete y.des_estructura;
                delete y.mto_contenido;
                delete y.des_nue_inver;
                delete y.des_mant;
                delete y.des_general;
                delete y.des_edif_inst;

               delete y.num_piso;
               delete y.mto_edificacion;
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
               delete y.cod_tipinforme;
               
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_actualizacion;
               delete y.fec_solicitud;
               delete y.fec_ven_insp;
               
               delete y.cod_estatus;
               delete y.porcen_eml;
               delete y.des_garantia;
               //delete y.nom_razsocial;
               delete y.des_observacion;
               delete y.des_justificacion;
               delete y.porcen_pml;
               
           }
    
    stringify =JSON.stringify(valoresDeclaradosIni);
    stringify = await utiles.replaceAll(stringify, 'mto_contenido','montoContenido') ;
    stringify = await utiles.replaceAll(stringify, 'mto_edificacion','montoEdificacion') ;
    stringify = await utiles.replaceAll(stringify, 'mto_existencia','montoExistencias');
    stringify = await utiles.replaceAll(stringify, 'mto_maquinaria','montoMaquinaria');
    stringify = await utiles.replaceAll(stringify, 'mto_lucro','montoLucroCesante');
    stringify = await utiles.replaceAll(stringify, 'mto_total','total');
    valoresDeclaradosIni = JSON.parse(stringify);

           for (x of informacionSBSIni.data) {
               delete x.cod_estatus;
                delete x.porcen_eml;
                delete x.des_garantia;
                delete x.nom_razsocial;
                delete x.des_observacion;
                delete x.des_justificacion;
                delete x.porcen_pml;
               
               delete x.nom_inspector;
               delete x.mto_edificacion;
               delete x.cod_inspector;
               delete x.mto_existencia;
               delete x.cod_estado;
               delete x.hor_inspeccion;
               delete x.colindantes;
               delete x.correo_insp;
               delete x.mto_maquinaria;
               delete x.descripcion;
               delete x.fec_inspeccion;
               delete x.riosQuebradas;
               delete x.des_direccion;
               delete x.mto_lucro;
               delete x.actividad_local;
               delete x.nom_razsocial;
               delete x.mto_total;
               delete x.cod_tipinforme;
               
               delete x.des_direccion;
               delete x.fec_modif;
               delete x.fec_inspeccion;
               delete x.num_tramite;
               delete x.fec_actualizacion;
               delete x.fec_solicitud;
               delete x.fec_ven_insp;

               delete x.des_sumario;
                delete x.des_estructura;
                delete x.mto_contenido;
                delete x.des_nue_inver;
                delete x.des_mant;
                delete x.des_general;
                delete x.des_edif_inst;
           }
  
  for (y of valoresDeclaradosIni.data) {
               delete y.num_piso;
               delete y.nom_inspector;
               delete y.cod_inspector;
               delete y.des_direccion;
               delete y.cod_estado;
               delete y.num_latitud;
               delete y.colindantes;
               delete y.correo_insp;
               delete y.fec_inspeccion;
               delete y.descripcion;
               delete y.cod_estructura;
               delete y.riosQuebradas;
               delete y.cod_uso;
               delete y.codImgDistInterna;
               delete y.hor_inspeccion;
               delete y.actividad_local;
               delete y.nom_razsocial;

               delete y.cod_tipinforme;              
               delete y.num_sotano;
               delete y.fec_modif;
               delete y.num_longitud;
               delete y.num_tramite;
               delete y.fec_actualizacion;
               delete y.fec_solicitud;
               delete y.fec_ven_insp;
               delete y.cod_estatus;
               delete y.porcen_eml;
               delete y.des_garantia;
               delete y.nom_razsocial;
               delete y.des_observacion;
               delete y.des_justificacion;
               delete y.porcen_pml;

               delete y.des_sumario;
                delete y.des_estructura;
                //delete y.mto_contenido;
                delete y.des_nue_inver;
                delete y.des_mant;
                delete y.des_general;
                delete y.des_edif_inst;
           }  
    var listaEntrevistados= await entrevistadoGet(numtramite,"-1");
    if(listaEntrevistados.result){
     
        for ( y of listaEntrevistados.data) {
           delete y.ind_del;
           delete y.num_tramite;
        }
    
        stringify =JSON.stringify(listaEntrevistados);
        stringify = await utiles.replaceAll(stringify, 'des_cargo','cargo') ;
        stringify = await utiles.replaceAll(stringify, 'nom_entrevistado','nombreEntrevistado');
        stringify = await utiles.replaceAll(stringify, 'num_entrevistado','codEntrevistado');
        stringify = await utiles.replaceAll(stringify, 'des_correo','correo');
        stringify = await utiles.replaceAll(stringify, 'des_telefono','telefono');
        
        listaEntrevistados = JSON.parse(stringify);
        
   
    }else {listaEntrevistados={};}
    
    //var d1=datosGeneralesIni.data;
    var listaEntrevistados={"listaEntrevistados":listaEntrevistados.data};
    var datosGenerales= datosGeneralesIni.data.concat(listaEntrevistados);
    var informacionSBS= informacionSBSIni.data;
    var valoresDeclarados= valoresDeclaradosIni.data;
    var output= {
            datosGenerales,
            informacionSBS,valoresDeclarados
        
    };

    var resultado=[
        {"claveTramite":numtramite}, 
        {"codTipoTramite":codTipoTramite}, 
        {"email":email} , 
        {fechaRegistro :fecha},
        output];
         return {result: true,data:resultado,fechaConsulta:fechaConsulta};        

    } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Inspeccion'},fechaConsulta:fechaConsulta};
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

async  function grabar(params) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    try {
             await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'1',mensaje:'Paso realizado correctamente'},fechaConsulta:fechaConsulta};
   } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'7',mensaje:'No se pudo realizar Paso :'+error},fechaConsulta:fechaConsulta};
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
    grabar,paso5InspeccionGet,paso5InformacionGeneral,paso5InformacionGeneralUpd,paso5InformacionGeneralGet
}