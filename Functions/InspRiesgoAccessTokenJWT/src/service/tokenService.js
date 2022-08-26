const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const tokenRepository = require('../repository/tokenRepository');

async function getSecretKey() {
    let result = null;
    const client = new AWS.SecretsManager();
    const secretName = process.env.SM_SECRETID;
    const secretManager = await client.getSecretValue({SecretId: secretName}).promise();

    if ('SecretString' in secretManager) {
        result = JSON.parse(secretManager.SecretString);
    }

    if ('JWT_TOKEN_SECRET' in result) {
        return result.JWT_TOKEN_SECRET;
    } else {
        return result;
    }
}

async function generateToken(params) {
    try {
        var password = params.password;
        var username = params.username;
        var email = params.email;

        if(params.email != undefined){
           var inspecciones = await tokenRepository.getInspecciones(params.email);
           console.log(inspecciones);
           if (!inspecciones.result){
               return {
                    result: false,
                    status: 401,                    
                    errores: {
                        codigo:'5', 
                        mensaje: 'Email no encontrado'
                    }
                }
           }
        }

        const secretKey = await getSecretKey();
        const expireTime = process.env.TOKEN_EXPIRE_TIME || '2h';
        
        if (secretKey === null) {
            return {
                result: false, 
                status: 500,
                errores: {
                    codigo:'3',
                    mensaje: 'Internal error'
                }
            }
        }

        var token = null;
        var insertParams = null;
        var insertResult = null;

        if(params.email != undefined){
            token = jwt.sign(
                {email, username},
                secretKey,
                {expiresIn: expireTime}
            );

        }else{
            token = jwt.sign(
                {password, username},
                secretKey,
                {expiresIn: expireTime}
            );
        }
        
        console.log('token:',token);
        params.token=token;
        insertResult = await tokenRepository.insertToken(params);

        if (insertResult.result) {
            return {
                result: true,
                status: 200, 
                data: token
            };
        } else {
            return {
                result: false, 
                    status: 500,
                    errores: {
                        codigo:'1',
                        mensaje: 'Error al generar token'
                    }
                }
        }
    } catch (e) {
        console.log(e)
        return {
            result: false,
            status: 500,
            errores: {
                codigo:'-1',
                mensaje: 'Error interno: ' + e,
                }
            }
    }
}


async function validateToken(params) {
    try {
        const {accessToken} = params;
        const secretKey = await getSecretKey();

        if (secretKey === null || secretKey == "" || secretKey == undefined) {
            return {
                result: false,
                status: 500,
                errores: {
                    codigo:'3',
                    mensaje: 'can not get secret key'
                }
            }
        }

        const getResult = await tokenRepository.getToken(params);
            
        if(!getResult.result){
            return {
                result: false,
                status: 400, 
                errores: {
                    codigo:'1',
                    mensaje: 'No se reconoce Token'
                }
            }
        }

        try {
         var temp =jwt.verify(accessToken, secretKey);
        } catch (e) {
        console.error("verifyToken Catch::validateToken: ", e);
        return {
            result: false, 
            status: 401,
            errores: {
                codigo:'2',
                mensaje: 'Token expirado',
                }
            }
    }
        console.log("Service::result", getResult);
        return getResult;
    } catch (e) {
        console.log(e);
        return {
            result: false, 
            status: 500,
            errores: { 
                codigo:'-1', 
                mensaje: 'Error interno: ' + e
                }
            };
    }
}

async function refreshToken(params) {
    const {accessToken, email} = params;

    const getResult = await tokenRepository.getToken(params);

    if (getResult.result) {
        const generateParams = {
            email,
            username: getResult.data.username
        }
        
        const valToken = await validateToken(params);
        if(!valToken.result){
            if (valToken.errores.codigo=='2'){
                const newToken = await generateToken(generateParams);
                //console.log(newToken);
                return newToken;
            }
            return valToken;
            
        }else{
            return {
                result: false, 
                status: 202,
                errores: {
                    codigo: '4',
                    mensaje: 'Token no ha expirado'
                    }
                };
        }
    } else {
            return {
                result: false,
                status: 403,
                errores: {
                    codigo: '1',
                    mensaje: 'No se reconoce Token'                    
                }
            }
    }        
}

module.exports = {
    generateToken,
    validateToken,
    refreshToken
}