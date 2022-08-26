const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const SINIESTRO_TABLE = process.env.SINIESTRO_TABLE;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;
const IND_DEL = process.env.IND_DEL;



async  function paso10valida(req) {
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
    
	return valida;
}
async  function paso10Ins(req,context) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    //console.log('**** fechaHora :'+ fechaHora);
     //****** inicio validadacion ************ 
	var valida = null;
    var seguir = await paso10valida(req);
	if (!seguir.result) {
         return seguir;
    }
   //****** fin validacion ************ 
   //console.log('**** req.listSiniestro.siniestro :', req.listSiniestro);
   if (req.listSiniestro != undefined){
    var stringify =JSON.stringify(req.listSiniestro);
	stringify = await utiles.replaceAll(stringify, 'codSiniestro','num_siniestro') ;
    stringify = await utiles.replaceAll(stringify, 'fecha','fec_siniestro');
    stringify = await utiles.replaceAll(stringify, 'descripcion','des_siniestro');
    stringify = await utiles.replaceAll(stringify, 'tiempoParalizacion','des_tie_paral');
    stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
    var lista = JSON.parse(stringify);

     var Item= {
                    "num_siniestro": "",
                    "num_tramite" : "",
                    "fec_siniestro":"",
                    "des_tie_paral" :"",
                    "ind_del" :""
                  };
    var TransactItems = [];
    var Put = {};
    var Puts="";
    var params=null;
    var cont=1;
    for(var x in lista){
        valida = await utiles.validateParametro(lista[x].des_siniestro,'des_siniestro');
        if (valida.result) {
            Item.des_siniestro=lista[x].des_siniestro;
        }else{ 
            delete Item['des_siniestro'];
        }
        valida = await utiles.validateParametro(lista[x].fec_siniestro,'fec_siniestro');
        if (valida.result) {
            Item.fec_siniestro=lista[x].fec_siniestro;
        }else{ 
            delete Item['fec_siniestro'];
        }
        valida = await utiles.validateParametro(lista[x].des_tie_paral,'des_tie_paral');
        if (valida.result) {
            Item.des_tie_paral=lista[x].des_tie_paral;
        }else{ 
            delete Item['des_tie_paral'];
        }
        cont++;
        Item.num_siniestro= context.awsRequestId.concat(cont);
        Item.num_tramite=req.claveTramite;
        Item.ind_del= IND_DEL;
        //console.log('**** Item :', Item);
        Put = {TableName: SINIESTRO_TABLE, Item};
        Puts= {Put} ;
        var p =JSON.stringify(Puts);
        p = await JSON.parse(p);
        TransactItems.push(p);
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


async  function getRegistrosSiniestro(req) {
    
	var valida = null;
	var stringify =JSON.stringify(req.listSiniestro);
	var ExpressionAttributeValues = null;
	stringify = await utiles.replaceAll(stringify,'codSiniestro', 'num_siniestro') ;
	stringify = await utiles.replaceAll(stringify,'descripcion', 'des_siniestro') ;
    stringify = await utiles.replaceAll(stringify,'fecha', 'fec_siniestro');
    stringify = await utiles.replaceAll(stringify,'tiempoParalizacion', 'des_tie_paral');
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
            ":des_siniestro": lista[x].des_siniestro,
            ":fec_siniestro": lista[x].fec_siniestro,
            ":des_tie_paral": lista[x].des_tie_paral,
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
        valida = await utiles.validateParametro(lista[x].des_siniestro,'des_siniestro');
        if (valida.result) {
               registros.push("des_siniestro = :des_siniestro");
        }else{ 
				delete ExpressionAttributeValues[':des_siniestro'];
		}
		valida = await utiles.validateParametro(lista[x].fec_siniestro,'fec_siniestro');
        if (valida.result) {
               registros.push("fec_siniestro = :fec_siniestro");
        }else{ 
				delete ExpressionAttributeValues[':fec_siniestro'];
		}
		valida = await utiles.validateParametro(lista[x].des_tie_paral,'des_tie_paral');
        if (valida.result) {
               registros.push("des_tie_paral = :des_tie_paral");
        }else{ 
				delete ExpressionAttributeValues[':des_tie_paral'];
		}
        for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
        }
        //console.log('*****ExpressionAttributeValues*******:',ExpressionAttributeValues);
        key = { "num_tramite": req.claveTramite,"num_siniestro": lista[x].num_siniestro };
            Update = {
                      TableName: SINIESTRO_TABLE,
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


async  function paso10Upd(req) {

    //console.log('**** paso4dao update********');
    
    var fechaHora = await utiles.fechaHora();

	var valida = null;
     //****** inicio validadacion ************ 
    var seguir = await paso10valida(req);

     //console.log('**** seguir :'+ seguir.result);
	 if (!seguir.result) {
         return seguir;
    }
    
   //****** fin validadacion ************ 

    var TransactItems = [];
	var p = null;
    var Update = null;
    if(req.listSiniestro){
        TransactItems = await getRegistrosSiniestro(req);
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
    p =JSON.stringify(Update);
    p = await JSON.parse(p);
    TransactItems.push(p);
    var params = { "TransactItems":TransactItems};
    var result=  await save(params);
	//console.log('result',result);
    return result;

}


async function paso10Get(numtramite,email) {
    
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
        var lista = await ArchivoGet(numtramite) ;
        for(var x of lista.data){
            delete x.num_tramite;
            //delete x.ind_del;
       }
       var stringify =JSON.stringify(lista);
       stringify = await utiles.replaceAll(stringify, 'num_siniestro','codSiniestro') ;
	   stringify = await utiles.replaceAll(stringify, 'des_siniestro','descripcion') ;
       stringify = await utiles.replaceAll(stringify, 'fec_siniestro','fecha');
       stringify = await utiles.replaceAll(stringify, 'des_tie_paral','tiempoParalizacion');
       stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
       
       lista = JSON.parse(stringify); 
       var y;
        for (y of lista.data) {
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
            {"listSiniestro":lista.data}
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
                TableName: SINIESTRO_TABLE,
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
  save,paso10Ins,ArchivoGet,InspeccionGet, 
  paso10Upd,paso10Get};