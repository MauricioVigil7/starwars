const dynamoDbClient = require('../db/config');

const TABLE_STARSHIPS = process.env.TABLE_STARSHIPS;
const now = new Date().toISOString();

async  function procesarIns(req){
    console.log("procesarIns dao:",req);
    var TransactItems = [];
    var Put = {};
    var Puts="";
    var params=null;
    var   Item = {
                "id":                   req.id,
                "nombre":               req.nombre,
                "modelo" :              req.modelo,
                "nave_estelar":         req.naveEstelar,
                "costo_creditos" :      req.costoCreditos,
                "longitud" :            req.longitud,
                "tripulacion" :         req.tripulacion,
                "pasajeros" :           req.pasajeros,
                "max_velocidad" :       req.maxVelocidad,
                "clase_hiperimpulsor" : req.claseHiperimpulsor,
                "mglt" :                req.mglt,
                "capacidad_carga" :     req.capacidadCarga,
                "consumibles":          req.consumibles,
                "peliculas":            req.peliculas,
                "pilotos":              req.pilotos,
                "url":                  req.url,
                "creado":               now,
                "modificado":           now,
            };
            console.log("Item ",Item);
            Put = {TableName: TABLE_STARSHIPS, Item};
            Puts= {Put} ;
            console.log("Puts ",Puts);
            var p =JSON.stringify(Puts);
            console.log("p ",p);
            p = await JSON.parse(p);
            console.log("p ",p);
            TransactItems.push(p);

    console.log("TransactItems ",TransactItems);
    params = { "TransactItems":TransactItems};
    return save(params);

}



async  function save(params) {
    try {
             await  dynamoDbClient.transactWrite(params).promise();        
             return {result: true,data:{codigo:'0',mensaje:'Paso realizado correctamente'}};
   } catch (error) {
            console.log('error:',error);
            return {result: false, errores: {codigo:'3',mensaje:'Error de validación de datos :'+error}};
   }
  
}

async function procesarGet(req) {
    
       console.log("procesarGet dao:",req);
        var lista = await getStarships() ;
        console.log("procesarGet dao  lista:",lista);
        if (!lista.result){
            return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados'}};
        }
        
        var find = false;
        for(var x of lista.data){
             req.nombre = req.nombre.replace('%20', " ");
             req.modelo = req.modelo.replace('%20', " ");
             console.log("req.nombre:",req.nombre);
             console.log("req.modelo:",req.modelo);
            if (x.nombre == req.nombre && x.modelo == req.modelo){
                find = true;
            }
           
            if (x.id == req.id){
                find = true;
            }

            if (find == true){
                var resultado=[
                    {"id":x.id},
                    {"nombre":x.nombre}, 
                    {"modelo":x.modelo}, 
                    {"naveEstelar":x.nave_estelar} ,
                    {"costoCreditos" :x.costo_creditos},
                    {"longitud" :x.longitud},
                    {"tripulacion" :x.tripulacion},
                    {"pasajeros" :x.pasajeros},
                    {"maxVelocidad" :x.max_velocidad},
                    {"claseHiperimpulsor" :x.clase_hiperimpulsor},
                    {"mglt" :x.mglt},
                    {"capacidad_carga" :x.capacidadCarga},
                    {"consumibles" :x.consumibles},
                    {"peliculas" :x.peliculas},
                    {"pilotos" :x.pilotos},
                    {"url" :x.url},
                    {"creado" :x.creado},
                    {"modificado" :x.modificado},
                    ];
                    console.info("*******get resultado********: " , resultado);
                    return {result: true,data:resultado};

            }
        }
            
     return {result: false,errores: {codigo:'2',mensaje:'Consulta sin resultados '}};
}

async function getStarships() {
       
        var params = {
            TableName: TABLE_STARSHIPS
        };

        if(TABLE_STARSHIPS == undefined) {
            params = {
                TableName: 'STARSHIPS'
            };
        }
        
        console.info("*******params********: " , params);

        try {
            
            var result1 = await dynamoDbClient.scan(params).promise() ;
            console.info("*******get result1********: " , result1);
            if (result1 ['Count']=='0'){
              return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
            }
            return {result: true,data:result1 ['Items']};

        } catch (error) {
            return {result: false,errores:{codigo:'2',mensaje:'No se encontraron datos'}};
        }
       

}

module.exports = {
    procesarGet,procesarIns};