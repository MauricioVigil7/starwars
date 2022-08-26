const tokenService = require('../service/tokenService');
const response = require('../response');

async function generateToken(params) {
    const token = await tokenService.generateToken(params);

    if(token.status == 200) {
        return response.successResponse("success", {
            accessToken: token.data,
            email: params.email,
            statusCode:200
        });
    } 

    if(token.status != 200) {
        return response.errorResponse("error", {
            errores: token.errores,
            statusCode:token.status
        });
    }
}

async function validateToken(params) {
    console.log(params);
    const {accessToken} = params;

    if(accessToken === '' || accessToken === null || accessToken === undefined) {
        console.log("accessToken bad request, undifined: ", accessToken);
        return response.errorResponse("bad request", {
            errores: {
               codigo: "1",
               mensaje: "bad request", 
            }
        }, 400);
    }

    const token = await tokenService.validateToken(params);
    console.log(token);
    if(token.status == 200) {
        return response.successResponse("Token Valido",
        {
            codigo:"0",
            mensaje:"Token Valido"
        },token.status);
    } 
    
    if(token.status != 200) {
        return response.errorResponse("error", 
          token.errores
        , token.status);
    }
}

async function refreshToken(params) {
    const {accessToken, email} = params;

    if(accessToken === '' || accessToken === null || accessToken === undefined) {
        return response.errorResponse("error", {
            errores: {
                codigo: "1",
                mensaje: "bad request"
            },
            statusCode: 400
        });
    }

    // if(email === '' || email === null || email === undefined) {
    //     return response.errorResponse("error", {
    //         errores: {
    //             codigo: "1",
    //             mensaje: "bad request"
    //         },
    //         statusCode: 400
    //     });
    // }

    const token = await tokenService.refreshToken(params);

    if(token.status == 200) {
        return response.successResponse("success",{
            accessToken:token.data,
            statusCode:200
        });
    } 

    if(token.status != 200) {
        console.log("diff: statusCode != 200", token.status);
        const error =  response.errorResponse(
            token.errores.mensaje, 
            token.errores,
            token.status);
        console.log("diff: statusCode: ", error);
            return error;
    }
}

module.exports = {
    generateToken,
    validateToken,
    refreshToken
}