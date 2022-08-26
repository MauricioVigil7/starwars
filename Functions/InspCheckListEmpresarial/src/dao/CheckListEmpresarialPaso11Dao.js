const dynamoDbClient = require('../db/config');
const utiles = require('../utiles/validacion');

const ROBO_TABLE = process.env.ROBO_TABLE;
const INSPECCIONES_TABLE = process.env.TABLE_INSPECCION;


async  function paso11Robo(req) {

   req.codAcceso = req.roboAsalto.accesoPredio.codAcceso;
   req.codPerimetro = req.roboAsalto.accesoPredio.codPerimetro;
   
   req.codAcceso    = req.roboAsalto.proteccionContraRobo.codVigilancia;
   req.codPerimetro = req.roboAsalto.proteccionContraRobo.alarma.codSensor;
   req.codAcceso    = req.roboAsalto.proteccionContraRobo.alarma.otros;
   req.codPerimetro = req.roboAsalto.proteccionContraRobo.cctv.codUbicacion;
   req.codPerimetro = req.roboAsalto.proteccionContraRobo.cctv.codMonitoreo;
   
   req.codPerimetro = req.roboAsalto.existenciasValoresExpRobo.objetoMayor5000;
   req.codPerimetro = req.roboAsalto.existenciasValoresExpRobo.manejoValores.codManejoValor;
   req.codPerimetro = req.roboAsalto.existenciasValoresExpRobo.manejoValores.descripcionProcedimiento;
   

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
            "num_robo": req.codRoboAsalto,
            "cod_acceso" : req.codAcceso,
            "cod_perimetro":req.codPerimetro,
            "cod_vigilancia" :req.codVigilancia,
            "cod_sensores" :req.codSensor,
            "des_otros" :req.otros,
            "cod_ubicacion" :req.codUbicacion,
            "cod_mon_cctv" :req.codMonitoreo,
            "des_obje_valor" :req.objetoMayor5000,
            "cod_manej_val" :req.codManejoValor,
            "des_procedim" :req.descripcionProcedimiento
          };
    valida = await utiles.validateParametro(req.codAcceso,'codAcceso');
    if (valida.result==false) {
          delete Item['cod_acceso'];
    }
    valida = await utiles.validateParametro(req.codPerimetro,'codPerimetro');
    if (valida.result==false) {
          delete Item['cod_perimetro'];
    }
   
    valida = await utiles.validateParametro(req.codVigilancia,'codVigilancia');
    if (valida.result==false) {
        delete Item['cod_vigilancia'];
    }
    valida = await utiles.validateParametro(req.codSensor,'codSensor');
    if (valida.result==false) {
        delete Item['cod_sensores'];
    }
    valida = await  utiles.validateParametro(req.otros,'otros');
    if (valida.result==false) {
          delete Item['des_otros'];
    }
    valida = await  utiles.validateParametro(req.codUbicacion,'codUbicacion');
    if (valida.result==false) {
          delete Item['cod_ubicacion'];
    }
    valida = await utiles.validateParametro(req.codMonitoreo,'codMonitoreo');
    if (valida.result==false) {
          delete Item['cod_mon_cctv'];
    }
    valida = await  utiles.validateParametro(req.objetoMayor5000,'objetoMayor5000');
    if (valida.result==false) {
          delete Item['des_obje_valor'];
    }
    valida = await  utiles.validateParametro(req.codManejoValor,'codManejoValor');
    if (valida.result==false) {
          delete Item['cod_manej_val'];
    }
    valida = await  utiles.validateParametro(req.descripcionProcedimiento,'descripcionProcedimiento');
    if (valida.result==false) {
          delete Item['des_procedim'];
    }
    
   //****** fin validadacion ************ 

    const params = {
            "TransactItems": [
              {
                "Put": {
                 Item,
                  "TableName": ROBO_TABLE
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


async  function paso11RoboUpd(req) {

   req.codRoboAsalto  = req.roboAsalto.codRoboAsalto;
   req.codAcceso = req.roboAsalto.accesoPredio.codAcceso;
   req.codPerimetro = req.roboAsalto.accesoPredio.codPerimetro;
   
   req.codAcceso    = req.roboAsalto.proteccionContraRobo.codVigilancia;
   req.codPerimetro = req.roboAsalto.proteccionContraRobo.alarma.codSensor;
   req.codAcceso    = req.roboAsalto.proteccionContraRobo.alarma.otros;
   req.codPerimetro = req.roboAsalto.proteccionContraRobo.cctv.codUbicacion;
   req.codPerimetro = req.roboAsalto.proteccionContraRobo.cctv.codMonitoreo;
   
   req.codPerimetro = req.roboAsalto.existenciasValoresExpRobo.objetoMayor5000;
   req.codPerimetro = req.roboAsalto.existenciasValoresExpRobo.manejoValores.codManejoValor;
   req.codPerimetro = req.roboAsalto.existenciasValoresExpRobo.manejoValores.descripcionProcedimiento;
   

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
   //****** fin validadacion ************ 
   
    var  ExpressionAttributeValues= {
                                   // ":num_tramite": req.claveTramite,
                                    ":cod_acceso": req.codAcceso,
                                    ":cod_perimetro" : req.codPerimetro,
                                    ":cod_vigilancia":req.codVigilancia,
                                    ":cod_sensores" :req.codSensor,
                                    ":des_otros" :req.otros,
                                    ":cod_ubicacion" :req.codUbicacion,
                                    ":cod_mon_cctv" :req.codMonitoreo,
                                    ":des_obje_valor" :req.objetoMayor5000,
                                    ":cod_manej_val" :req.codManejoValor,
                                    ":des_procedim" :req.descripcionProcedimiento,
                                  };
    
    var upd="set ";
    var registros = [];

    valida = await utiles.validateParametro(req.codAcceso,'codAcceso');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':cod_acceso'];
    }else{
         registros.push("cod_acceso = :cod_acceso");
    }
    
    //req.codRoboAsalto,
    valida = await utiles.validateParametro(req.codRoboAsalto,'codRoboAsalto');
     if (valida.result==false) {
          return {result: valida.result, errores:valida.errores,fechaConsulta:fechaConsulta};
    }
    valida = await utiles.validateParametro(req.codPerimetro,'codPerimetro');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':cod_perimetro'];
    }else{
         registros.push("cod_perimetro = :cod_perimetro");
    }
   
    valida = await utiles.validateParametro(req.codVigilancia,'codVigilancia');
    if (valida.result==false) {
        delete ExpressionAttributeValues[':cod_vigilancia'];
    }else{
         registros.push("cod_vigilancia = :cod_vigilancia");
    }
    valida = await utiles.validateParametro(req.codSensor,'codSensor');
    if (valida.result==false) {
        delete ExpressionAttributeValues['cod_sensores'];
    }else{
         registros.push("cod_sensores = :cod_sensores");
    }
    valida = await  utiles.validateParametro(req.otros,'otros');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':des_otros'];
    }else{
         registros.push("des_otros = :des_otros");
    }
    valida = await  utiles.validateParametro(req.codUbicacion,'codUbicacion');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':cod_ubicacion'];
    }else{
         registros.push("cod_ubicacion = :cod_ubicacion");
    }
    valida = await utiles.validateParametro(req.codMonitoreo,'codMonitoreo');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':cod_mon_cctv'];
    }else{
         registros.push("cod_mon_cctv = :cod_mon_cctv");
    }
    valida = await  utiles.validateParametro(req.objetoMayor5000,'objetoMayor5000');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':des_obje_valor'];
    }else{
         registros.push("des_obje_valor = :des_obje_valor");
    }
    valida = await  utiles.validateParametro(req.codManejoValor,'codManejoValor');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':cod_manej_val'];
    }else{
         registros.push("cod_manej_val = :cod_manej_val");
    }
    valida = await  utiles.validateParametro(req.descripcionProcedimiento,'descripcionProcedimiento');
    if (valida.result==false) {
          delete ExpressionAttributeValues[':des_procedim'];
    }else{
         registros.push("des_procedim = :des_procedim");
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
                      TableName: ROBO_TABLE,
                      Key: {
                        num_tramite: req.claveTramite,
                        num_robo: req.codRoboAsalto
                      },
                      
                      ExpressionAttributeValues: ExpressionAttributeValues,
                      UpdateExpression: 
                      upd
                      ,
                      //ConditionExpression: "num_tramite = :num_tramite",
                      returnValuesOnConditionCheckFailure: "ALL_OLD | NONE",
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

async function paso11RoboGet(numtramite,email,codTipoTramite) {
   // console.log('*******paso10RamosTecnicosGet 1 dao************');
    var fechaHora = await utiles.fechaHora();
    var fecha = await utiles.fecha();
    var fechaConsulta = fechaHora;
    //if (numtramite && codRamos){
    var y;
    var roboAsalto = [];
    var codRoboAsalto={};
    //var codVigilancia={};
    var accesoPredio={};
    var alarma={};
    var cctv={};
    var existenciasValoresExpRobo={};
    var manejoValores={};
    var objetoMayor5000={};
    //var siniestro=[{"claveTramite":numtramite}, {"codTipoTramite":codTipoTramite}, {"email":email} , {fechaRegistro :fecha},{"Siniestro":listasiniestro.data}];
    var proteccionContraRobo={};
    //console.log('*******paso10RamosTecnicosGet 1************');
    var listaramos = await paso11GetRobo(numtramite,"-1") ;
    if(listaramos.result==false)
          return {result: listaramos.result, errores:listaramos.errores,fechaConsulta:fechaConsulta}; 
    //console.log('*******paso11RobosGet 2************');
    for (y of listaramos.data) {
        
        codRoboAsalto ={codRoboAsalto:y.codRoboAsalto};
        accesoPredio = {codAcceso:y.codAcceso,codPerimetro:y.codPerimetro};
        roboAsalto.push({codRoboAsalto,accesoPredio});
       // roboAsalto.push(accesoPredio);
        
        alarma={codSensor:y.codSensor,otros:y.otros};
        cctv={codUbicacion:y.codUbicacion,codMonitoreo:y.codMonitoreo};
        proteccionContraRobo ={codVigilancia:y.codVigilancia};
       // proteccionContraRobo ={proteccionContraRobo,alarma,cctv};
       proteccionContraRobo ={proteccionContraRobo,alarma,cctv};
        
        roboAsalto.push(proteccionContraRobo);
        
        objetoMayor5000={objetoMayor5000:y.objetoMayor5000};
        manejoValores={codManejoValor:y.codManejoValor,descripcionProcedimiento:y.descripcionProcedimiento};
        existenciasValoresExpRobo={objetoMayor5000,manejoValores};
        
        roboAsalto.push(existenciasValoresExpRobo);
        
    }
    var resultado=[{"claveTramite":numtramite}, {"codTipoTramite":codTipoTramite}, {"email":email} , {fechaRegistro :fecha},{"roboAsalto":roboAsalto}];
    return {result: true,data:resultado,fechaConsulta:fechaConsulta};
    //}
}

async function paso11GetRobo(numtramite,codRoboAsalto) {
    let params;
    var fechaHora = await utiles.fechaHora();
    var fechaConsulta = fechaHora;
           params = {
                TableName: ROBO_TABLE,
                ExpressionAttributeValues: {
                    ':num_tramite': numtramite,
                    ':num_robo' :codRoboAsalto
                },
                KeyConditionExpression: 'num_tramite =:num_tramite and num_robo = :num_robo',
            };
            if (codRoboAsalto=="-1"){
                params = {
                        TableName: ROBO_TABLE,
                        ExpressionAttributeValues: {
                            ':num_tramite': numtramite
                        },
                        KeyConditionExpression: 'num_tramite =:num_tramite',
                    }; 
               }
         
            const {Items} = await dynamoDbClient.query(params).promise();
            //console.log('*******Items************');
            //console.log(Items);
            if (Items.length > 0) {
                var stringify =JSON.stringify(Items);
                stringify = await utiles.replaceAll(stringify, 'num_robo','codRoboAsalto') ;
                stringify = await utiles.replaceAll(stringify, 'cod_acceso','codAcceso');
                stringify = await utiles.replaceAll(stringify, 'cod_perimetro','codPerimetro');
                stringify = await utiles.replaceAll(stringify, 'cod_vigilancia','codVigilancia');
                stringify = await utiles.replaceAll(stringify, 'cod_sensores','codSensor');
                stringify = await utiles.replaceAll(stringify, 'cod_registro','codRegistro');
                stringify = await utiles.replaceAll(stringify, 'des_otros','otros');
                stringify = await utiles.replaceAll(stringify, 'cod_ubicacion','codUbicacion');
                stringify = await utiles.replaceAll(stringify, 'cod_mon_cctv','codMonitoreo');
                stringify = await utiles.replaceAll(stringify, 'des_obje_valor','objetoMayor5000');
                stringify = await utiles.replaceAll(stringify, 'des_procedim','descripcionProcedimiento');
                var datos  = JSON.parse(stringify);
                return {result: true, data: datos,fechaConsulta:fechaConsulta};
            }
            return {result: false, errores:{codigo:'3',mensaje:'consulta sin resultado en '+ ROBO_TABLE},fechaConsulta:fechaConsulta};
}

module.exports = {
    paso11RoboGet,paso11RoboUpd,paso11Robo,paso11GetRobo
}

