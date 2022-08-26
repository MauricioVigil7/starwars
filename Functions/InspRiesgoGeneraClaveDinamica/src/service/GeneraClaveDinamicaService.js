const dynamoDbClient = require('../db/config');

const CLAVETEMP_TABLE = process.env.CLAVETEMP_TABLE;
const CLAVETEMPHIST_TABLE = process.env.CLAVETEMPHIST_TABLE;
  
async function getClaveTemp(req) {
    
    console.log('*******temp req.email****:' + req.email);
    console.log('*******temp req.clave****:' + req.clave);
  
    const params = {
        TableName: CLAVETEMP_TABLE,
        Key: {
            clave: req.clave,
            email: req.email
        },
    };

    try {
        const {Item} = await dynamoDbClient.get(params).promise();
        console.log('******* getClaveTemp****: false' );
        if (Item) {
            console.log('******* getClaveTemp****: true' );
            const {email, clave,created_at,expires_at,num_intent} = Item; 
            return {result: true, data: {email:email, clave:clave,createdat:created_at, expiresat:expires_at,numintent:num_intent}};
        } else {
            return {result: false, errores: 'Could not find ClaveTemp with provided '};
        }
    } catch (error) {
        console.log(error);
        return {result: false, errores: 'Could not retreive ClaveTemp:'+error};
    }
}


async function getClaveTempHistCant(req){
    try {
        var params = {
            KeyConditionExpression: 'clave = :clave',
            ExpressionAttributeValues: {
            ":clave": req.clave
            },
            TableName: CLAVETEMPHIST_TABLE
        };
        var result = await dynamoDbClient.query(params).promise();
        
        console.log(result['Count'])
        console.log(JSON.stringify(result))
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getClaveTempHist(req) {
    
   // console.log('*******hist req.email****:' + req.email);
    console.log('*******hist req.clave****:' + req.clave);
    const params = {
        TableName: CLAVETEMPHIST_TABLE,
        Key: {
            //email: req.email,
            clave: req.clave,
        },
    };

    try {
        console.log('******* getClaveTempHist****: false' );
        const {Item} = await dynamoDbClient.get(params).promise();
        if (Item) {
            console.log('******* getClaveTempHist****: true' );
            const {email, clave, fec_verif, num_intent} = Item;
            return {result: true, data: {email:email, clave:clave, fecverif:fec_verif, numintent:num_intent}};
        } else {
            return {result: false, errores: 'Could not find ClaveTempHist with provided '};
        }
    } catch (error) {
        console.log(error);
        return {result: false, errores: 'Could not retreive ClaveTempHist: ' + error};
    }
}


async function generarClave(req) {//generarClave  verificarClave
    
    try {
        const AWSpass = require("aws-sdk");
    //const endpoint = dynamoDbClient.endpoint; //"https://secretsmanager.us-east-1.amazonaws.com";
    //const region =  dynamoDbClient.region;
    const caracteres =  dynamoDbClient.caracteres;

    const secretsmanager = new AWSpass.SecretsManager({});

    var params1 = {
        PasswordLength: 6, 
        RequireEachIncludedType: true,
        ExcludeCharacters: caracteres, 
        ExcludeLowercase:  false,
        ExcludeNumbers: false,
        ExcludePunctuation: true ,
        ExcludeUppercase:false
       };

        console.log('------1------');
        let clasecret = await  secretsmanager.getRandomPassword(params1).promise();
        let clasecretstr ='';
       if ('RandomPassword' in clasecret) {
            clasecretstr = clasecret.RandomPassword;
            console.log('RandomPassword:'+ clasecretstr);
       }
        console.log('------2------');
        console.log('*********** getRandomPassword ******* :' + clasecretstr  +'***'  );
        
        if(clasecretstr=='' || clasecretstr.length != 6)
            return {result: false, errores: {codigo:'1',mensaje:'No se pudo generar la clave'}};
        
        const now = new Date();
        const expires =  now.setTime(now.getTime() + (60 * 60 * 1000)); // Add 1 hour.
        req.clave = clasecretstr;
        req.numintent = 0;
        req.fecverif = now.toString();
        req.createdat =  now.toString();
        req.expiresat =  expires;
        console.log('------3------');
        let resulttemp = await insertClaveTemp(req);
        let exitoTemp = resulttemp['result'];
        if (exitoTemp==false) return resulttemp;
        console.log('------4------');
        let resulthist = await insertClaveTempHist(req);
        let exitoTemphist = resulthist['result'];
        if (exitoTemphist==false)  return resulthist;
        console.log('------5------');
//clasecretstr
       return {result: true, data: {codigo:'0',mensaje:'Clave generado con exito', claveTemp:clasecretstr}};
    } catch(e) {
        return {result: false, errores: {codigo:'1',mensaje:'No se pudo generar la clave ' + e}};
    }

}

async function verificarClave(req) {//verificarClave  generarClave
    
    console.log('******* hist req.email****:' + req.email);
    console.log('*******hist req.clave****:' + req.clave);
    let resulttemp = await getClaveTemp(req);
    var numIntent=0;
    var cantidad;
    var canthist;
    var resulttempupd;
    var resulthistupd;
    var now = new Date();
    console.log('******* 1  ****:' );
    let exitoTemp = resulttemp['result'];
    console.log('******* exitoTemp  ****:' +exitoTemp);
    if (exitoTemp==false) {
        cantidad = await getClaveTempHistCant(req);
        canthist = cantidad['Count'];
        numIntent = !isNaN(canthist) ? canthist : 0;
        numIntent = canthist + 1;
        req.numintent = numIntent;
        req.fecverif = now.toString();
        resulthistupd = await insertClaveTempHist(req);
        if (numIntent > 5) {
            return  {result: false, errores: {codigo:'3',mensaje:'Supero máximo número de intento de validación'}};
        }
        return  {result: false, errores: {codigo:'2',mensaje:'No se reconoce la clave'}};
    }
    console.log('******* 2  ****:' );
    console.log('******* 3  ****:' );
    let tempdata = resulttemp['data'];
    console.log('******* 4  ****:' );

    let fecha1 = new Date(tempdata.expiresat);
     console.log('******* 5  ****:' +fecha1 );
    let fecha2 = new Date();
     console.log('******* 6  ****:' +fecha2);
    let resta = fecha1.getTime() - fecha2.getTime(); 
    console.log('******* resta  ****:' +resta);
 /*  
    if (numIntent > 5) {
        return  {result: false, errores: {codigoMensaje:'3',mensaje:'Supero máximo número de intento de validación'}};
    }
 */
    req.numintent = 0;
    req.fecverif = now.toString();
    cantidad = await getClaveTempHistCant(req);
    canthist = cantidad['Count'];
    console.log('******* Count  ****:' +canthist);
     
    resulttempupd = await updateClaveTemp(req);
    var exitoTempupd = resulttempupd['result'];
    if (exitoTempupd==false) return resulttempupd;
    
    numIntent = canthist;
    numIntent = numIntent + 1;
    req.numintent = numIntent;
    
    resulthistupd = await insertClaveTempHist(req);
    let exitoTemphistupd = resulthistupd['result'];
    if (exitoTemphistupd==false) return resulthistupd;

    if (resta < 0) {
        return  {result: false, errores: {codigo:'1',mensaje:'Clave expirada'}};
    }
    
    return {result: true, data: {codigo:'0',mensaje:'Clave generado con exito'}};
        
}



async  function insertClaveTemp(req) {

    console.log('==== req.clave ====' + req.clave);
    const params = {
        TableName: CLAVETEMP_TABLE,
        Item: {
            email: req.email,
            clave: req.clave,
            created_at: req.createdat,
            expires_at: req.expiresat,
            num_intent: req.numintent,
        },
    };
    try {
            await  dynamoDbClient.put(params).promise();
            return {result: true};
    } catch (error) {
        console.log(error);
        return {result: false, errores: 'Could not insert to ' + CLAVETEMP_TABLE + ':'+error};
    }
    
}

async function insertClaveTempHist(req) {
    
    console.log('==== req.clave ====' + req.clave);
    console.log('==== req.email ====' + req.email);
    console.log('==== req.numintente ====' + req.numintent);
    console.log('==== req.fecverif ====' + req.fecverif);
    console.log('==== CLAVETEMPHIST_TABLE ====' + CLAVETEMPHIST_TABLE);
    
    const params = {
        TableName: CLAVETEMPHIST_TABLE,
        Item: {
            clave: req.clave,
            email: req.email,
            num_intent: req.numintent,
            fec_verif: req.fecverif,
        },
    };

    try {
        await dynamoDbClient.put(params).promise();
        return {result: true};
    } catch (error) {
        console.log(error);
        return {result: false, errores: 'Could not insert to ' + CLAVETEMPHIST_TABLE + ':' +  error};
    }
}


async function updateClaveTemp(req) {
    console.log('==== updateClaveTemp.clave ====' + req.clave);
    console.log('==== updateClaveTemp.email ====' + req.email);
    console.log('==== updateClaveTemp.numintent ====' + req.numintent);
    
    const params = {
        TableName: CLAVETEMP_TABLE,
        Key: {
            email: req.email,
            clave: req.clave
        },
        UpdateExpression: "SET num_intent = :num_intent",
        ExpressionAttributeValues: {
            ":num_intent": req.numintent
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        console.log('====UPDATE CLAVETEMP_TABLE ====' + CLAVETEMP_TABLE);
        console.log('==== updateClaveTemp ====  false' );
         dynamoDbClient.update(params,function(err,data){
             if(err)  console.log( err);
             
             console.log( data); 
            console.log('==== data ====  true' + data); 
         });
        //await dynamoDbClient.put(params).promise();
        console.log('==== updateClaveTemp ====  true' );
        return {result: true};
    } catch (error) {
        console.log(error);
        return {result: false, errores: 'Could not insert to :' + CLAVETEMP_TABLE +':' +error};
    }
    
    
}


module.exports = {
    getClaveTemp,getClaveTempHistCant, getClaveTempHist,updateClaveTemp, generarClave, verificarClave, insertClaveTemp, insertClaveTempHist
}