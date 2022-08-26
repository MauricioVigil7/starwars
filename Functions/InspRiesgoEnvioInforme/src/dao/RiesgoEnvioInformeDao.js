const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const INSPECCIONES_TABLE = process.env.TablaInspeccion;
const COD_INFORME_GENERADO = process.env.CodInformeGenerado;
const TIP_ARCHIVO = process.env.TipArchivo;
const IND_DEL = process.env.IndDel;
const ARCHIVO_TABLE = process.env.TablaArchivo;
const RIESGO_ENVIO_ARCHIVO = process.env.RiesgoEnvioArchivo;
const HOSTNAME = process.env.Hostname;
const PATH = process.env.Path;
const COD_INSPECCIONADO = process.env.CodInformeInspeccionado;

const https = require('https');
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();


async  function grabar(claveTramite,email,codEstadoTramite) {
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var TransactItems = [];
    var params=null;
    try {
            var  ExpressionAttributeValues= {
                                    ":fec_modif": fechaHora,
                                    ":cod_estado": codEstadoTramite,
                                    ":fec_actualizacion":fechaHora
                                  };
            var upd = {
                        Update: {
                          TableName: INSPECCIONES_TABLE,
                          Key: {
                            correo_insp:email,
                            num_tramite: claveTramite
                          },
                          UpdateExpression: "set fec_actualizacion =:fec_actualizacion,"+
                         "fec_modif = :fec_modif,cod_estado = :cod_estado",
                          ExpressionAttributeValues: ExpressionAttributeValues,
                          //ConditionExpression: "cod_tipinforme = :cod_tipinforme",
                          returnValuesOnConditionCheckFailure: "ALL_OLD | NONE"
                        },
                      };
               TransactItems.push(upd);
               params = { "TransactItems":TransactItems};

                await  dynamoDbClient.transactWrite(params).promise();
             return {result: true,data:{codigo:'0',mensaje:'Operacion realizada correctamente'},fechaConsulta:fechaConsulta};
    } catch (error) {
            console.log(error);
            return {result: false, errores: {codigo:'-2',mensaje:'Error al procesar :'+error},fechaConsulta:fechaConsulta};
    }
}

async  function enviarInformeValida(req) {
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
async function procesarLambda(req,archivo) {
	var codTramite = null;
    var codArchivo = null;
    var nombreArchivo = null;
	var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
       for (var x of archivo.data) {
                   codTramite = x.num_tramite;
                   codArchivo = x.num_archivo;
                   nombreArchivo = x.nom_archivo;
       }
       var payload = { 
                            codTramite: codTramite,
                            codArchivo: codArchivo,
                            nombreArchivo: nombreArchivo,
                            do: req.do,
                            action:'obtener'
                            
        };
       
       var params = {
                  FunctionName: RIESGO_ENVIO_ARCHIVO,///obtener
                  InvocationType: "RequestResponse",
                  Payload: JSON.stringify(payload)
              };
            
        try {
                 let funcion = await lambda.invoke(params).promise();
                 
				 return {result: true ,data: funcion ,fechaConsulta:fechaConsulta}; 
				 
		} catch (error) {
               console.log(error);
          return {result: false,errores: {codigo:'-1',mensaje:'Error interno '+error},fechaConsulta:fechaConsulta}; 
       }   
}

async function parseLambda(funcion,email) {
     var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
	var payload =  JSON.parse(funcion.Payload);
    //console.log("funcion.Payload: ", payload);

    var exito = payload.exito;//body['exito'];
    var mensaje= payload.mensaje;
    var data = payload.data;
          
        if(exito){                       
            var archiv      = data ['archivo'];
            var tipo        = data ['Extension'];
            var nomarchivo  = data ['nombreArchivo'];
            var numarchivo  = data ['codArchivo'];
            var numtramite  = data ['codTramite'];
            var cntpesoarchivo = data ['pesoArchivo'];
            var feccrea     = data ['fechaHoraCarga'];

            var token = null;
            var riesgo =null;
            var parametros = [archiv,tipo,nomarchivo,numarchivo,numtramite,cntpesoarchivo,feccrea,mensaje];
                        try {
                            
                            riesgo = await mpeEmisionAppRiesgos(parametros);
                            token = riesgo['token'];
                            if (token != undefined){
                                // console.log("numtramite: ", numtramite);
                                // console.log("email: ", email);
                                // console.log("COD_INSPECCIONADO: ", COD_INSPECCIONADO);
                                var graba = await grabar(numtramite,email,COD_INSPECCIONADO);
                                
                                if (graba.result){
                                   return {result: true,data:{codigo:'0',mensaje:'Informe enviado'},fechaConsulta:fechaConsulta}; 
                                }
                                
                                return {result: false,errores: {codigo:'-1',mensaje:'Error interno '},fechaConsulta:fechaConsulta};
                            }
                            return {result: false,errores: {codigo:'-1',mensaje:'Error interno '},fechaConsulta:fechaConsulta};
                            
                        } catch(ex) {
                            console.log("ERRORRRRRRR: ", ex);
                            return {result: false,errores: {codigo:'-1',mensaje:'Error interno '+ex},fechaConsulta:fechaConsulta}; 
                        }                       
        }
		return {result: false,errores: {codigo:'-1',mensaje:'Error interno ' + exito},fechaConsulta:fechaConsulta};
}

async function enviarInforme(req) {
   // console.log('****  dao 1 ********');
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
    var estado = null;
	
    var seguir = await enviarInformeValida(req);
    //console.log('**** seguir :'+ seguir);
	if (!seguir) {
         return seguir;
    }

    var listainspeccion = await getInspeccion(req.claveTramite,req.email) ;
    //console.log('listainspeccion',listainspeccion);
    for (var y of listainspeccion.data) {
             estado = y.cod_estado;
    }
    if (estado === undefined) {
            return {result: false,errores: {codigo:'-1',mensaje:'Error interno : estado Inspeccion es undefined '},fechaConsulta:fechaConsulta};
    }
        console.log(estado);
    if (estado == COD_INFORME_GENERADO){
          let archivo = await getArchivo(req.claveTramite,TIP_ARCHIVO);
          //console.log('*****archivo*****',archivo);
          if (archivo.result){

				 var proceso  = await procesarLambda(req,archivo);
                 //console.log('*****proceso*****',proceso);
				 if (!proceso.result){
					 return proceso;
				 }
				 
                 let funcion = proceso.data;
                 var statusCode= funcion['StatusCode'];
                 //console.log('statusCode',statusCode);
                 if(statusCode == 200){
                    //console.log('****funcion****',funcion);
                    //console.log('***req.email****',req.email);
					var resultado = await parseLambda(funcion,req.email);
					//console.log('resultado',resultado);
					return resultado;
                 }
       
                  return {result: false,errores: {codigo:'-1',mensaje:'Error interno '},fechaConsulta:fechaConsulta};
          }else {
            return {result: false,errores: {codigo:'-1',mensaje:'Error interno'},fechaConsulta:fechaConsulta}; 
          }
        }else{
            return {result: false,errores: {codigo:'-1',mensaje:'Error interno : estado Inspeccion es diferente a ' + COD_INFORME_GENERADO},fechaConsulta:fechaConsulta};
            
        }

}


async function getInspeccion(numtramite,email) {
    
    let params;
    var fechaHora = await utiles.fechaHora();

    var fechaConsulta = fechaHora;
    var ExpressionAttributeValues= {
                   ':correo_insp' :email,
                   ':num_tramite' :numtramite
                };
    // console.log('email '+email);
    // console.log('numtramite '+numtramite);
    // console.log('ExpressionAttributeValues '+ExpressionAttributeValues);
    params = {
                TableName: INSPECCIONES_TABLE,
                ExpressionAttributeValues: ExpressionAttributeValues,
                //FilterExpression: 'cod_tipinforme = :cod_tipinforme',
                KeyConditionExpression: 'correo_insp =:correo_insp and num_tramite =:num_tramite',
     };    
     const {Items} = await dynamoDbClient.query(params).promise();
     
     if (Items.length > 0) {
            var stringify =JSON.stringify(Items);
            var datos  = JSON.parse(stringify); 
            var y;
            for (y of datos) {
                 
                         delete y.num_piso;
                         delete y.fec_ven_insp;
                         delete y.mto_edificacion;
                         delete y.cod_inspector;
                         delete y.mto_existencia;
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
            }
            return {result: true,data:datos,fechaConsulta:fechaConsulta};             
     }
      return {result: false,errores: {codigo:'-2',mensaje:'No se encontraron datos en Inspeccion'},fechaConsulta:fechaConsulta};
     
}

async function getArchivo(numtramite,tipArchivo) {
      let params;
      var fechaHora = await utiles.fechaHora();
      var fechaConsulta = fechaHora;
      
            params = {
                  TableName: ARCHIVO_TABLE, 
                  ExpressionAttributeValues: {
                      ':num_tramite':  numtramite,
                      ':tip_archivo':  tipArchivo,
                      ':ind_del':  IND_DEL
                  },
                  FilterExpression: 'tip_archivo = :tip_archivo and ind_del = :ind_del',
                  KeyConditionExpression: 'num_tramite =:num_tramite',
              };
  
              const {Items} = await dynamoDbClient.query(params).promise();
              if (Items.length > 0) {
                  var stringify =JSON.stringify(Items);
                  var datos  = JSON.parse(stringify);
                  for (var y of datos) {
                       delete y.ind_del; 
                  }
                  return {result: true, data: datos,fechaConsulta:fechaConsulta};
              }
         
       return {result: false,errores:{codigo:'-2',mensaje:'No se encontraron datos en '+ARCHIVO_TABLE},fechaConsulta:fechaConsulta};
  }

async function mpeEmisionAppRiesgos(parametros) {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify({test: 1});
        var credenciales = "apimafiriesgopre:1nspRi3sgoPre.2021";
        console.log("HOSTNAME: ", HOSTNAME);
        console.log("PATH: ", PATH);
        const options = {
            hostname: HOSTNAME,
            path: PATH,
            method: 'POST',
            headers: {
                'Authorization':"Basic " + Buffer.from(credenciales).toString("base64"),
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            data = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}


module.exports =  {grabar,enviarInforme,getInspeccion,getArchivo} ;
