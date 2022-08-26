const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');
const ALMACENAMIENTO_TABLE = process.env.ALMACENAMIENTO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;
const IND_DEL = process.env.IND_DEL;


async  function paso8valida(req) {
	//****** inicio validadacion ************ 
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = null;
    var valoresparam = [
	req.codTipoTramite,req.claveTramite,req.email
	];
	var namesparam = [
	'codTipoTramite','claveTramite','email'
	];

	for(var i = 0; i <= valoresparam.length -1; i++) {
		valida = await utiles.validateParametro(valoresparam[i],namesparam[i]);
		if (!valida.result) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
		}
	}

    valida = await utiles.validarEmail(req.email);
    if (!valida.result) {
          return valida;
    }
	return {result: true};
}

async  function paso8Almacenamiento(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var valida = null;
	var seguir = await paso8valida(req);
     //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
    }
	 /*console.log('*****req.codAlmacenamiento****** '+req.codAlmacenamiento);
     console.log('*****req.edificacion****** '+req.almacenamiento.edificacion);
     console.log('*****req.mercaderia****** '+req.almacenamiento.mercaderia);
     console.log('*****req.caracteristica****** '+req.almacenamiento.caracteristica);
     console.log('*****req.inventario****** '+req.almacenamiento.inventario);
     console.log('*****req.email****** '+req.email);
     console.log('*****req.claveTramite****** '+req.claveTramite);
   */
     var Item =  {
                    "num_tramite": req.claveTramite,
                    "num_almacenamiento" : req.codAlmacenamiento,
                    "des_edificacion":req.almacenamiento.edificacion,
                    "des_mercaderia" :req.almacenamiento.mercaderia,
                    "des_caracteristica" :req.almacenamiento.caracteristica,
                    "des_inventario" :req.almacenamiento.inventario
                  };
    var stringify1 =JSON.stringify(Item);
         Item = JSON.parse(stringify1);
          valida = await utiles.validateParametro(req.almacenamiento.edificacion,'edificacion');
    if (!valida.result) {
         delete Item['des_edificacion'];
    }
    valida = await utiles.validateParametro(req.almacenamiento.mercaderia,'mercaderia');
    if (!valida.result) {
         delete Item['des_mercaderia'];
    }
    valida = await utiles.validateParametro(req.almacenamiento.caracteristica,'caracteristica');
    if (!valida.result) {
         delete Item['des_caracteristica'];
    }
    valida = await utiles.validateParametro(req.almacenamiento.inventario,'des_inventario');
    if (!valida.result) {
        delete Item['des_inventario'];
    }
     
        var params = {
            "TransactItems": [
             {
               "Put": {
                  Item,
                   "TableName": ALMACENAMIENTO_TABLE
               }
              },
              
              {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    correo_insp :req.email
                  },
                 UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion"
                  ,
                  ExpressionAttributeValues: {
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion": req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
                
              }
            ]
         };
        
 
    var result=  await save(params);
	//console.log('**** result :',result);
    return result;
    
}
async  function paso8AlmacenamientoUpd(req) {

    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = null;
	var seguir = await paso8valida(req);
     //console.log('**** seguir :'+ seguir.result);
	if (!seguir.result) {
         return seguir;
    }
   // var almacenamiento = await paso8GetAlmacenamiento(req.claveTramite,req.almacenamiento.codAlmacenamiento);
  /*  if (!almacenamiento.result){
        return {result: false, errores:{ codigo:'3',mensaje:'codigo de Amacenamiento '+ req.codAlmacenamiento + ' no existe'},fechaConsulta:fechaConsulta};
	}*/
    var ExpressionAttributeValues = {
            ":des_edificacion":req.almacenamiento.edificacion,
            ":des_mercaderia" :req.almacenamiento.mercaderia,
            ":des_caracteristica" :req.almacenamiento.caracteristica,
            ":des_inventario" :req.almacenamiento.inventario
    };
       /*  console.log('*****req.codAlmacenamiento****** '+req.almacenamiento.codAlmacenamiento);
         console.log('*****req.edificacion****** '+req.almacenamiento.edificacion);
         console.log('*****req.mercaderia****** '+req.almacenamiento.mercaderia);
         console.log('*****req.caracteristica****** '+req.almacenamiento.caracteristica);
         console.log('*****req.inventario****** '+req.almacenamiento.inventario);
         console.log('*****req.email****** '+req.email);
         console.log('*****req.claveTramite****** '+req.claveTramite);*/
         var upd="set ";
         var registros = [];
         valida = await utiles.validateParametro(req.almacenamiento.edificacion,'edificacion');
         if (valida.result) {
              registros.push("des_edificacion = :des_edificacion");
         }else{
              delete ExpressionAttributeValues[':des_edificacion'];
         }
         valida = await utiles.validateParametro(req.almacenamiento.mercaderia,'mercaderia');
         if (valida.result) {
             registros.push("des_mercaderia = :des_mercaderia");
         }else{
              delete ExpressionAttributeValues[':des_mercaderia'];
         }
         valida = await utiles.validateParametro(req.almacenamiento.caracteristica,'caracteristica');
         if (valida.result) {
              registros.push("des_caracteristica = :des_caracteristica");
         }else{
             delete ExpressionAttributeValues[':des_caracteristica'];
         }
         valida = await utiles.validateParametro(req.almacenamiento.inventario,'inventario');
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
        //console.log('**** upd :',upd);
        //console.log('**** ExpressionAttributeValues :',ExpressionAttributeValues);
        let params = {
           
            "TransactItems": [
             {
                Update: {
                  TableName: ALMACENAMIENTO_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    num_almacenamiento: req.almacenamiento.codAlmacenamiento
                  },
                  UpdateExpression: upd ,
                  //ConditionExpression: "num_tramite = :num_tramite",
                  ExpressionAttributeValues: ExpressionAttributeValues,
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              },
              
              {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    num_tramite: req.claveTramite,
                    correo_insp :req.email,
                    
                  },
                 UpdateExpression: "set "+
                    "fec_modif = :fec_modif," +
                    "fec_actualizacion = :fec_actualizacion"
                  ,
                  ExpressionAttributeValues: {
                    
                    ":fec_modif" :fechaHora,
                    ":fec_actualizacion": req.fechaRegistro,
                    ":cod_tipinforme":req.codTipoTramite
                  },
                  ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                  returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                },
              }
            ]
         };
    var result=  await save(params);
	//console.log('**** result :',result);
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

async function paso8AlmacenamientoGet(numtramite,email,codTipoTramite) {
   
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var fecha = await utiles.fecha();
    if (numtramite){
    
        var edi = await paso8ListaGet(numtramite) ;
        var stringify1 =JSON.stringify(edi);
        stringify1 = await utiles.replaceAll(stringify1, 'num_almacenamiento','codAlmacenamiento') ;
        stringify1 = await utiles.replaceAll(stringify1, 'des_edificacion','edificacion');
        stringify1 = await utiles.replaceAll(stringify1, 'des_mercaderia','mercaderia');
        stringify1 = await utiles.replaceAll(stringify1, 'des_caracteristica','caracteristica');
        stringify1 = await utiles.replaceAll(stringify1, 'des_inventario','inventario');
        var almacenamiento = JSON.parse(stringify1);
        var y;
         for (y of almacenamiento.data) {
            delete y.num_tramite;
            delete y.nom_almacen;
          }
        var resultado=[{"claveTramite":numtramite}, {"codTipoTramite":codTipoTramite}, {"email":email} , {fechaRegistro :fecha},{"almacenamiento":almacenamiento.data}];
       return {result: true,data:resultado,fechaConsulta:fechaConsulta};
    } 
     return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'},fechaConsulta:fechaConsulta};
}

async function paso8ListaGet(numtramite) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
  
         params = {
                TableName: ALMACENAMIENTO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite
                },
               // FilterExpression: '#num_tramite = :num_tramite',
                KeyConditionExpression: 'num_tramite =:num_tramite'
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+ALMACENAMIENTO_TABLE},fechaConsulta:fechaConsulta};
        }
        
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
 
}

async function paso8GetAlmacenamiento(numtramite,codAlmacenamiento) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
         params = {
                TableName: ALMACENAMIENTO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_almacenamiento': codAlmacenamiento
                },
        
                KeyConditionExpression: 'num_tramite =:num_tramite and num_almacenamiento =:num_almacenamiento',
            };
            
        var result1 = await dynamoDbClient.query(params).promise() ;
        if (result1 ['Count']=='0'){
          return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos en '+ALMACENAMIENTO_TABLE,fechaConsulta:fechaConsulta}};
        }
        return {result: true,data:result1 ['Items'],fechaConsulta:fechaConsulta};
 
}

module.exports = {
    paso8AlmacenamientoUpd,paso8AlmacenamientoGet,paso8ListaGet,
    paso8Almacenamiento,paso8GetAlmacenamiento
}