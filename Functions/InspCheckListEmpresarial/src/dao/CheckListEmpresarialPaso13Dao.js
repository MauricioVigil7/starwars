const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE;
const ENLACE_TABLE = process.env.ENLACE_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;

//var consin=true; 
async  function paso13EnlaceArchivo(req) {
 
     req.listaArchivo = req.listArchivo;
     req.listaEnlace = req.listEnlace;
  /*   
    console.log('**** paso4dao********');
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
    var valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validateParametro(req.codEstadoTramite,'codEstadoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.email,'email');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
     valida = await utiles.validarEmail(req.email);
    if (valida.result==false) {
          return valida;
    }
    
 /*   valida = await  utiles.validateParametro(req.nombreInspector,'nombreInspector');
    var concat=",nom_inspector = :nom_inspector";
    if (valida.result==false) {
         consin=false;
         concat="";
    }
 */   
    var TransactItems = [];
    var Put = {};
    var Puts="";

    var params=null;
   
    var stringify1 =JSON.stringify(req.listaArchivo);
    //console.log('*****stringify1*******' + stringify1);
    valida = await utiles.IsJsonString(stringify1);
    if (valida.result==false) {
          return valida;
    }
     var Item= {
                    "num_archivo": "",
                    "num_tramite" : "",
                    "tip_archivo":"",
                    "nom_archivo" :"",
                    "des_archivo" :""
                  };
   
   //****** fin validacion ************ 
    stringify1 = await utiles.replaceAll(stringify1, 'codArchivo','num_archivo') ;
    stringify1 = await utiles.replaceAll(stringify1, 'tipoArchivo','tip_archivo');
    stringify1 = await utiles.replaceAll(stringify1, 'nomArchivo','nom_archivo');
    stringify1 = await utiles.replaceAll(stringify1, 'comentario','des_archivo');
    var lista = JSON.parse(stringify1); 
   /* var result = await paso4Archivo(req.claveTramite);
        if(result.result == true){
             return {result: false,errores:{codigo:'4',mensaje:'Paso 13 Lista de Archivo ya existe'},fechaConsulta:fechaConsulta};
        }*/
    for(var x in lista){
        //console.log('**** lista[x].tip_Archivo :'+ lista[x].tip_Archivo);
            Item.ind_del=IND_DEL;
            valida = await  utiles.validateParametro(lista[x].num_archivo,'num_archivo');
            if (valida.result==false) {
                //console.log('*****lista[x].num_archivo*******'+lista[x].num_archivo);
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }
            valida = await  utiles.validarNumero(lista[x].tip_archivo,'tip_archivo');
            if (valida.result==false) {
                //console.log('*****lista[x].tip_archivo*******'+lista[x].tip_archivo);
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }
           /* valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
            if (valida.result==true) {
                console.log('*****lista[x].ind_del*******'+lista[x].ind_del);
               valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (valida.result==false) {
                    console.log('*****lista[x].ind_del*******'+lista[x].ind_del);
                      return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
                }
                console.log('*****valida.data.codigo*******'+valida.data.codigo);
                Item.ind_del=valida.data.codigo;
            }else{ Item['ind_del'] = '0';}*/
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result==true) {
                //console.log('*****lista[x].nom_archivo*******'+lista[x].nom_archivo);
               Item.nom_archivo=lista[x].nom_archivo;
            }else{ delete Item['nom_archivo'];}
            valida = await utiles.validateParametro(lista[x].des_archivo,'des_archivo');
            if (valida.result==true) {
                //console.log('*****lista[x].des_archivo*******'+lista[x].des_archivo);
               Item.des_archivo=lista[x].des_archivo;
            }else{ delete Item['des_archivo'];}

        //lista[x].ind_del=valida.data.codigo;
        //lista[x].tip_archivo = parseInt(lista[x].tip_archivo);
        Item.num_archivo=lista[x].num_archivo;
        Item.num_tramite=req.claveTramite;
        Put = {TableName: ARCHIVO_TABLE, Item};
        Puts= {Put} ;
        //console.log('*****Puts*******');
         var p =JSON.stringify(Puts);
         p = await JSON.parse(p);
        //console.log('*****p*******' +p);
        TransactItems.push(p);
    }
    
    var stringify =JSON.stringify(req.listaEnlace);
    //console.log('*****stringify*******' + stringify);
    valida = await utiles.IsJsonString(stringify);
    if (valida.result==false) {
          return valida;
    }
    stringify = await utiles.replaceAll(stringify, 'codEnlace','num_enlace') ;
    stringify = await utiles.replaceAll(stringify, 'nomEnlace','des_enlace');
     Item= {
              "num_tramite" : "",
              "num_enlace":"",
              "des_enlace" :"",
              "ind_del" :"",
           };
    var listEnlace = JSON.parse(stringify); 
    for(var y in listEnlace){
        
        valida = await utiles.validateParametro(listEnlace[y].num_enlace,'num_enlace');
        if (valida.result==true) {
               Item.num_enlace=listEnlace[y].num_enlace;
        }else{ delete Item['num_enlace'];}
            valida = await utiles.validateParametro(listEnlace[y].des_enlace,'des_enlace');
        if (valida.result==true) {
               Item.des_enlace=listEnlace[y].des_enlace;
        }else{ delete Item['des_enlace'];}
        Item.num_tramite=req.claveTramite;
        Item.ind_del='0';
        Put = {TableName: ENLACE_TABLE, Item};
        Puts= {Put} ;
        //console.log('*****Puts*******');
         var p =JSON.stringify(Puts);
         p = await JSON.parse(p);
        //console.log('*****p*******' +p);
        TransactItems.push(p);
    }
    var  ExpressionAttributeValues= {

                                    ":fec_modif": fechaHora,
                                    ":cod_estado": req.codEstadoTramite,
                                    ":cod_tipinforme": req.codTipoTramite,
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
                 "fec_modif = :fec_modif,cod_estado = :cod_estado",
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              };
           TransactItems.push(upd);
           params = { "TransactItems":TransactItems};
           // console.log(TransactItems);
           var result=  await save(params);
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

async  function paso13EnlaceArchivoUpd(req) {

     req.listaArchivo = req.listArchivo;
     req.listaEnlace = req.listEnlace;
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
    var fechaConsulta = fechaHora;
     //****** inicio validadacion ************ 
    var valida = await utiles.validateParametro(req.email,'email');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validarEmail(req.email,'email');
    if (valida.result==false) {
          return valida;
    }
    valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
     valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.fechaRegistro,'fechaRegistro');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateDate(req.fechaRegistro);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(req.codEstadoTramite,'codEstadoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
   
    var stringify2 =JSON.stringify(req.listaArchivo);
    valida = await utiles.IsJsonString(stringify2);
    if (valida.result==false) {
          return valida;
    }
   
   //****** fin validadacion ************ 
    stringify2 = await utiles.replaceAll(stringify2, 'codArchivo','num_archivo') ;
    stringify2 = await utiles.replaceAll(stringify2, 'tipoArchivo','tip_archivo');
    stringify2 = await utiles.replaceAll(stringify2, 'nomArchivo','nom_archivo');
    stringify2 = await utiles.replaceAll(stringify2, 'comentario','des_archivo');
    stringify2 = await utiles.replaceAll(stringify2, 'eliminado','ind_del');
    var lista = JSON.parse(stringify2); 
    var TransactItems = [];
    for(var x in lista){
        var upd="set ";
        var registros = [];
         var ExpressionAttributeValues2= {
                                  //":num_tramite": req.claveTramite,
                                  ":tip_archivo": lista[x].tip_archivo,
                                  ":nom_archivo": lista[x].nom_archivo,
                                  ":des_archivo": lista[x].des_archivo,
                                  ":ind_del": lista[x].ind_del
                                  };
           /* valida = await  utiles.validarNumero(lista[x].tip_archivo,'tip_archivo');
            if (valida.result==false) {
                  return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
            }*/
            registros.push("tip_archivo = :tip_archivo");
            valida = await utiles.validateParametro(lista[x].ind_del,'ind_del');
            if (valida.result==true) {
               valida = await utiles.validarBoolean(lista[x].ind_del,'ind_del');
                if (valida.result==false) {
                      return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
                }
                registros.push("ind_del = :ind_del");
                lista[x].ind_del =valida.data.codigo;
                ExpressionAttributeValues2[':ind_del']=valida.data.codigo;
            }else{ delete ExpressionAttributeValues2[':ind_del'];}
            valida = await utiles.validateParametro(lista[x].nom_archivo,'nom_archivo');
            if (valida.result==true) {
               registros.push("nom_archivo = :nom_archivo");
            }else{ delete ExpressionAttributeValues2[':nom_archivo'];}
            valida = await utiles.validateParametro(lista[x].des_archivo,'des_archivo');
            if (valida.result==true) {
               registros.push("des_archivo = :des_archivo");
            }else{ delete ExpressionAttributeValues2[':des_archivo'];}
            
        //lista[x].tip_archivo = parseInt(lista[x].tip_archivo);
        
             for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
            }
/*
            var result = await paso13ArchivoGet(req.claveTramite,lista[x].num_archivo);
            if(result.result == false){
                 return {result: false,errores:{codigo:'4',mensaje:'Paso 13 Lista de Archivo no existe'},fechaConsulta:fechaConsulta};
            }*/
            var key = { "num_tramite": req.claveTramite,"num_archivo": lista[x].num_archivo };
            var Update = {
                      TableName: ARCHIVO_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues2,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
            Update ={Update};
            var p =JSON.stringify(Update);
            p = await JSON.parse(p);
            
            TransactItems.push(p);
    }

      
        
    var stringify =JSON.stringify(req.listaEnlace);
    valida = await utiles.IsJsonString(stringify);
    if (valida.result==false) {
          return valida;
    }
    stringify = await utiles.replaceAll(stringify, 'codEnlace','num_enlace') ;
    stringify = await utiles.replaceAll(stringify, 'nomEnlace','des_enlace');
    stringify = await utiles.replaceAll(stringify, 'eliminado','ind_del');
    var listEnlace = JSON.parse(stringify); 
    for(var y in listEnlace){
         upd="set ";
         registros = [];
         var ExpressionAttributeValues3= {
                                 // ":num_enlace": listEnlace[y].num_enlace,
                                  ":des_enlace": listEnlace[y].des_enlace,
                                  ":ind_del": listEnlace[y].ind_del
                                  };
        
        valida = await utiles.validateParametro(listEnlace[y].num_enlace,'num_enlace');
        if (valida.result==false) {
               //registros.push("num_enlace = :num_enlace");
                return {result: false,errores:valida.errores,fechaConsulta:fechaConsulta};
        }
       // registros.push("num_enlace = :num_enlace");
        valida = await utiles.validateParametro(listEnlace[y].ind_del,'ind_del');
            if (valida.result==true) {
               valida = await utiles.validarBoolean(listEnlace[y].ind_del,'ind_del');
                if (valida.result==false) {
                      return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
                }
                registros.push("ind_del = :ind_del");
                listEnlace[y].ind_del =valida.data.codigo;
                ExpressionAttributeValues3[':ind_del']=valida.data.codigo;
            }else{ delete ExpressionAttributeValues3[':ind_del'];}
            
        valida = await utiles.validateParametro(listEnlace[y].des_enlace,'des_enlace');
            if (valida.result==true) {
               registros.push("des_enlace = :des_enlace");
            }else{ delete ExpressionAttributeValues3[':des_enlace'];}
        
        
              for (var i=0; i<registros.length;i++){
                if(i==registros.length-1)
                     upd = upd + registros[i] ;
                else upd = upd + registros[i] + "," ;
            }
            
             key = { "num_tramite": req.claveTramite,"num_enlace": listEnlace[y].num_enlace };
             Update = {
                      TableName: ENLACE_TABLE,
                      Key: key,
                      UpdateExpression: upd,
                      ExpressionAttributeValues: ExpressionAttributeValues3,
                     // ConditionExpression: "num_tramite = :num_tramite",
                     returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                };
            Update ={Update};
            p =JSON.stringify(Update);
            p = await JSON.parse(p);
            TransactItems.push(p);
    }    
     var  ExpressionAttributeValues= {

                                    ":fec_modif": fechaHora,
                                    ":cod_estado": req.codEstadoTramite,
                                    ":cod_tipinforme": req.codTipoTramite,
                                    ":fec_actualizacion":req.fechaRegistro
                                  };
     upd = {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp:req.email,
                    num_tramite: req.claveTramite
                  },
                  UpdateExpression: "set fec_actualizacion =:fec_actualizacion,"+
                 "fec_modif = :fec_modif,cod_estado = :cod_estado",
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              };
   TransactItems.push(upd);
   let params = { "TransactItems":TransactItems};
    console.log(TransactItems);
   var result=  await save(params);
    return result;
}


async function paso13EnlaceArchivoGet(numtramite,email,codTipoTramite) {
    
     //****** inicio validadacion ************ 
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    var valida = await utiles.validateParametro(numtramite);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(email);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validarEmail(email);
    if (valida.result==false) {
          return valida;
    }
    
    valida = await utiles.validateParametro(codTipoTramite);
    //console.log('**** codTipoTramite ****' + codTipoTramite);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
   //****** fin validadacion ************
    
    if (email && numtramite&&codTipoTramite){
        var lista = await paso13ArchivoGet(numtramite,"-1") ;
        if (lista.result==true){
            for(var x of lista.data){
               delete  x.num_tramite;
               delete  x.ind_del;
           }
            var stringify =JSON.stringify(lista);
    
            stringify = await utiles.replaceAll(stringify, 'num_archivo','codArchivo') ;
            stringify = await utiles.replaceAll(stringify, 'tip_archivo','tipoArchivo');
            stringify = await utiles.replaceAll(stringify, 'nom_archivo','nomArchivo');
            stringify = await utiles.replaceAll(stringify, 'des_archivo','comentario');
            stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
            lista = JSON.parse(stringify); 
        }else {lista = {}}
         var listaenla = await paso13Enlaces(numtramite,"-1") ;
         //console.log(listaenla);
         if (listaenla.result==true){
                 for( x of listaenla.data){
                     delete x.num_tramite;
                     delete x.ind_del;
                    /*  if (x.ind_del=="1")
                          x.ind_del = true;
                      else  x.ind_del = false;*/
               }
         } else listaenla = {};
        stringify =JSON.stringify(listaenla);
        stringify = await utiles.replaceAll(stringify, 'num_enlace','codEnlace') ;
        stringify = await utiles.replaceAll(stringify, 'des_enlace','nomEnlace');
        stringify = await utiles.replaceAll(stringify, 'ind_del','eliminado');
         
        
       listaenla = JSON.parse(stringify);
       
       var listainspeccion = await paso13InspeccionGet(numtramite,email,codTipoTramite) ;
       
        //console.log('*******listainspeccion************');
        //console.log(listainspeccion);
        var estado = listainspeccion.data[0].cod_estado;
        var listaArchivo = lista.data;
        var listaEnlace = listaenla.data;
        var output1 = {listaArchivo,listaEnlace};
        var resultado=[
            {"claveTramite":numtramite}, 
            {"codTipoTramite":codTipoTramite}, 
            {"email":email} , 
            {fechaRegistro :fecha},
            {"codEstadoTramite":estado},
            output1];
        return {result: true,data:resultado,fechaConsulta:fechaConsulta};
        
      //  return {result: true,data:output1,fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados parametros no encontrados Paso 4 Datos Nivel Riesgo'},fechaConsulta:fechaConsulta};
}
async function paso13ArchivoGet(numtramite,numarchivo) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var vigente = IND_DEL;
    var keycondicion = 'num_tramite =:num_tramite and num_archivo =:num_archivo';
    var ExpressionAttributeValues= {
                    ':num_tramite': numtramite,
                    ':num_archivo': numarchivo,
                    ':ind_del': vigente,
                 };
    
    if (numarchivo=="-1"){
         delete ExpressionAttributeValues[':num_archivo'] ;
         keycondicion = 'num_tramite =:num_tramite';
    }   
    
     params = {
                TableName: ARCHIVO_TABLE,
                ExpressionAttributeValues: ExpressionAttributeValues,
                //ConditionExpression: "ind_del = '0'",
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: keycondicion,
            };
    
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
        }
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
     
   //  return {result: false,errores:{codigo:'3',mensaje:'No se encontraron datos en Archivo'},fechaConsulta:fechaConsulta};
}

async function paso13Enlaces(numtramite,numenlace) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
   
    var vigente = IND_DEL;
    var keycondicion = 'num_tramite =:num_tramite and num_enlace =:num_enlace';
    var ExpressionAttributeValues= {
                    ':num_tramite': numtramite,
                    ':num_enlace': numenlace,
                    ':ind_del': vigente
                };
    
    if (numenlace == "-1"){
         delete ExpressionAttributeValues[':num_enlace'] ;
         keycondicion = 'num_tramite =:num_tramite';
    }   
    //console.log(ExpressionAttributeValues);
    //console.log(keycondicion);
    if (numtramite){
         params = {
                TableName: ENLACE_TABLE,
                ExpressionAttributeValues: ExpressionAttributeValues,
                FilterExpression: 'ind_del = :ind_del',
                KeyConditionExpression: keycondicion,
            };
            
        //var result1 = await dynamoDbClient.query(params).promise() ;
        const {Items} = await dynamoDbClient.query(params).promise();
            if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_siniestro','codSiniestro') ;
                stringify = await utiles.replaceAll(stringify, 'des_siniestro','descripcionSiniestro');
                var datos  = JSON.parse(stringify);
                for (var y of datos) {
                     delete y.num_tramite;
                     delete y.ind_del; 
                }
                return {result: true, data: datos,fechaConsulta:fechaConsulta};
            }
       } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en Enlace'},fechaConsulta:fechaConsulta};
}


async function paso13InspeccionGet(numtramite,email,codTipoTramite) {
    
    let params;
    var fechaHora = await utiles.fechaHora();
    //var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
     //****** inicio validadacion ************ 
    var valida = await utiles.validateParametro(numtramite);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(email);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validarEmail(email);
    if (valida.result==false) {
          return valida;
    }
    
    valida = await utiles.validateParametro(codTipoTramite);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
   //****** fin validadacion ************
    if (email && numtramite&&codTipoTramite){
         params = {
                TableName: INSPECCIONES_TABLE,
                 ExpressionAttributeValues: {
                   ':correo_insp' :email,
                   ':num_tramite' :numtramite
                },
                KeyConditionExpression: 'correo_insp =:correo_insp and num_tramite =:num_tramite',
                //ConditionExpression: "ind_regactual = '1'"
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



module.exports = {
  paso13Enlaces, paso13InspeccionGet,paso13EnlaceArchivoUpd,paso13EnlaceArchivoGet,paso13EnlaceArchivo
}

