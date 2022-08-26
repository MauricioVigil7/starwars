const repository = require('../repository/NotificacionRepository');
const Buffer = require('buffer').Buffer;

const CRECRET_ID = process.env.SM_SECRETID;
const IS_SECRETMANAGER = process.env.IS_SECRETMANAGER;
const API_HOST_MAPFRE = process.env.API_HOST_MAPFRE;
const API_PATH_LOGIN = process.env.API_PATH_LOGIN;
const API_PATH_WSRUTILES_MAIL = process.env.API_PATH_WSRUTILES_MAIL;
const AWS = require('aws-sdk');
const https = require('https');
let time = null;
const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;

async function enviar(req) {
    const SKEY = await getSecretKey();
    const inspeccion = repository.getInspecciones(req);
    if(!inspeccion.result){
        return { result: inspeccion.result, errores: inspeccion.errores };
    }
    const mailBody = repository.getMensajeMail(req);
    if(!mailBody.result){
        return { result: mailBody.result, errores: mailBody.errores };
    }
    const predataAPI = await getTokenAPI(SKEY);
    if(!predataAPI.result){
        return { result: predataAPI.result, errores: predataAPI.errores };
    }
    req.codusumodif = inspeccion.data.codinspector;
    const now = new Date();
    req.indenvio = "1";
    req.estadocorreo = req.estado;
    req.inddel = "0";
    req.feccrea = now.toString();
    req.fecenvio = now.toString();
    req.correoelectr = req.para;
    try {
        var call = await getCall(SKEY.usuario, SKEY.password);
        return { result: true, data: null };
    } catch (e) {
        console.error('****Error****:' + e);
        return { result: false, errores: { codigo: '3', mensaje: "*Error al conectar url: " + process.env.URL + " error: " + e } };
    }
}

async function getTokenAPI(SKEY) {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify({ test: 1 });
        const options = {
            hostname: API_HOST_MAPFRE,
            path: API_PATH_LOGIN,
            method: 'POST',
            headers: {
                'Authorization': "Basic " + Buffer.from(SKEY.usuario + ":" + SKEY.password).toString("base64"),
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
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

async function getSecretKey() {
    let result = { usuario: 'apimafiriesgopre', password: '1nspRi3sgoPre.2021' };
    if(IS_SECRETMANAGER == 'true'){
        const client = new AWS.SecretsManager();
        const secretManager = await client.getSecretValue({ SecretId: CRECRET_ID }).promise();
        if ('SecretString' in secretManager) {
            result = JSON.parse(secretManager.SecretString);
        }
        if ('usuario' in result && 'password' in result) {
            return result;
        }
    }
    return result;
}

async function getCall(usuario, pass) {
    var getReq = null;
    try {
        getReq = await testAPI();
        console.log('getReq', getReq);
    } catch (ex) {
        console.log("ERRORRRRRRR: ", ex);
    }
    return getReq;
}

async function callWebservice(host, path, user, pass) {
    let basic = Buffer.from(user + ":" + pass).toString("base64");
    let options = {
        host: host,
        path: path,
        method: "POST",
        headers: {
            Authorization: 'Basic ' + basic,
        },
    };
    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
            console.log("*****callWebservice 2****: ");
            console.debug("Status: " + res.statusCode);
            res.on("data", (d) => {
                try {
                    var respuesta = JSON.parse(d);
                    console.log("*****callWebservice 3****: ");
                    console.debug("Status: " + res.statusCode);
                    console.info("data: " + JSON.stringify(respuesta));
                    if (res.statusCode === 200) {
                        console.log("*****callWebservice 4****: ");
                        console.debug("Status: " + res.statusCode);
                        console.debug("respuesta.token: " + respuesta.token);
                        return resolve(respuesta.token);
                    } else {
                        var error;
                        console.log("*****callWebservice 5****: ");
                        console.debug("Status: " + res.statusCode);
                        error = '************errrrr*********';
                        console.log(res.statusCode);
                        return reject(error);
                    }
                } catch (e) {
                    console.log("*****callWebservice 6****: ");
                    console.debug("Status: " + res.statusCode);
                    console.error("Error Llamar WS: " + e);
                    var error = JSON.stringify(e);
                    return reject(error);
                }
            });
            res.on('error', (e) => {

                var error = JSON.stringify(e);
                return reject(error);
            })
        });
        req.on("error", (e) => {
            console.log(e);
            console.log("**********dentro error");
            var error = JSON.stringify(e);
            return reject(error);
        });
        req.end();
    });
}

async function enviarEmail(req) {
    var aws = require('aws-sdk');
    var ses = new aws.SES({ region: 'eu-west-1' });
    var params = {
        Destination: {
            ToAddresses: [req.para],
            CcAddresses: [req.cc]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: req.cuerpo
                },
            },
            Subject: { Data: req.asunto }
        },
        Source: req.de
    };
    console.log('===SENDING EMAIL===');
    try {
        var sendPromise = await ses.sendEmail(params).promise();
        console.log(sendPromise);//Promise { <pending> }
        return { result: true, data: { codigo: "3", mensaje: "se envio el correo: " } };
    } catch (e) {
        console.log(e);
        return { result: false, errores: { codigo: "4", mensaje: "no se envio Correo: " + e } };
    }
}

module.exports = {
    enviar
}