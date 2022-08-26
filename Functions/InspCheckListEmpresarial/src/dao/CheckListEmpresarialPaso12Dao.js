const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const SINIESTRO_TABLE = process.env.SINIESTRO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;


async  function paso12Siniestro(req) {

    req.descripcionSiniestro = req.siniestros.descripcionSiniestro;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var valida = await utiles.validateParametro(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
     valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
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
    //****** inicio validadacion ************ 
    var Item= {
            "num_tramite": req.claveTramite,
            "num_siniestro": req.codSiniestro,
            "des_siniestro" : req.descripcionSiniestro
          };
    valida = await utiles.validateParametro(req.codSiniestro,'codSiniestro');
    if (valida.result==false) {
           return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.descripcionSiniestro,'descripcionSiniestro');
    if (valida.result==false) {
          delete Item['des_siniestro'];
    }
   
    
   //****** fin validadacion ************ 

    const params = {
            "TransactItems": [
              {
                "Put": {
                 Item,
                  "TableName": SINIESTRO_TABLE
                }
              },
             {
               Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp :req.email,
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
                
              }
            ]
         };
   
    var result=  await save(params);
	//console.log('**** result :',result);
    return result;
    
}

async  function paso12SiniestroUpd(req) {

    req.codSiniestro = req.siniestros.codSiniestro;
    req.descripcionSiniestro = req.siniestros.descripcionSiniestro;
    
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;

    valida = await utiles.validateParametro(req.email,'email');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }

    valida = await utiles.validarEmail(req.email);
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
     var valida = await utiles.validateParametro(req.claveTramite,'claveTramite');
    if (valida.result==false) {
         return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
     valida = await utiles.validarNumero(req.codTipoTramite,'codTipoTramite');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    
    valida = await utiles.validateParametro(req.codSiniestro,'codSiniestro');
    if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
   //****** fin validadacion ************ 
   
    var  ExpressionAttributeValues= {
       // ":num_tramite": req.claveTramite,
        ":des_siniestro": req.descripcionSiniestro
    };
    
    
    var upd="set ";
    var registros = [];
    valida = await utiles.validateParametro(req.descripcionSiniestro,'descripcionSiniestro');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':des_siniestro'];
    }else{
         registros.push("des_siniestro = :des_siniestro");
    }
    
    for (var i=0; i<registros.length;i++){
        if(i==registros.length-1)
             upd = upd + registros[i] ;
        else upd = upd + registros[i] + "," ;
    }

        const params = {
            "TransactItems": [
              {
                Update: {
                      TableName: SINIESTRO_TABLE,
                      Key: {
                        num_tramite: req.claveTramite,
                        num_siniestro: req.codSiniestro
                      },
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      UpdateExpression: upd ,
                      //ConditionExpression: "num_tramite = :num_tramite",
                      returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
                     }
              },
             {
                Update: {
                  TableName: INSPECCIONES_TABLE,
                  Key: {
                    correo_insp : req.email,
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


async function paso12SiniestroGet(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 dao************');
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var fecha = await utiles.fecha();
    //console.log('*******paso12SiniestroGet 1************');
    var listasiniestro = await paso12GetSiniestro(numtramite,"-1") ;
    var y;
    for (y of listasiniestro.data) {
               delete y.fec_siniestro;
               delete y.des_tie_paral;
               delete y.ind_del;
    }
    if(listasiniestro.result==false)
          return {result: listasiniestro.result, errores:listasiniestro.errores,fechaConsulta:fechaConsulta}; 
    //console.log('*******paso12SiniestroGet 2************');
    var siniestro=[{"claveTramite":numtramite}, 
    {"codTipoTramite":codTipoTramite}, 
    {"email":email} , {fechaRegistro :fecha},{"siniestro":listasiniestro.data}];

    return {result: true,data:siniestro,fechaConsulta:fechaConsulta};
    //}
}

async function paso12GetSiniestro(numtramite,codSiniestro) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var keycondicion = 'num_tramite = :num_tramite and num_siniestro = :num_siniestro';
    var ExpressionAttributeValues= {
                    ':num_tramite': numtramite,
                    ':num_siniestro' :codSiniestro
                };
    
    if (codSiniestro=="-1"){
        delete ExpressionAttributeValues[":num_siniestro"];
        keycondicion = 'num_tramite = :num_tramite';
    }
    params = {
                TableName: SINIESTRO_TABLE,
                ExpressionAttributeValues:ExpressionAttributeValues,
                //FilterExpression: filterExpression,
                KeyConditionExpression: keycondicion,
            };
            
            const {Items} = await dynamoDbClient.query(params).promise();
            if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_siniestro','codSiniestro') ;
                stringify = await utiles.replaceAll(stringify, 'des_siniestro','descripcionSiniestro');
               
                var datos  = JSON.parse(stringify);
                for (var y of datos) {
                  delete y.num_tramite;   
                }

                return {result: true, data: datos,fechaConsulta:fechaConsulta};
            }
            return {result: false, errores:{codigo:'3',mensaje:'consulta sin resultado en '+ SINIESTRO_TABLE},fechaConsulta:fechaConsulta};
}

module.exports = {
    paso12SiniestroGet,paso12SiniestroUpd,paso12Siniestro,paso12GetSiniestro
}

