'use strict';

const tokenController = require('./src/controller/tokenController');

module.exports.token = async (event, context, callback) => {
    
    console.log(`Evento: ${JSON.stringify(event)}`);

    const params = event.data;

    if (event.authorizationToken) {
        console.log(`Ingreso a la validación del token: ${event.authorizationToken}`);

        const params1 = {
            accessToken: event.authorizationToken
        }

        const principalId = event.methodArn.split(":")[4];
        console.log(`principal: ${principalId}`);

        const token = await tokenController.validateToken(params1);
        console.log(`Token: ${JSON.stringify(token)}`);
        
        let tokenResponse = JSON.parse(token.body);
        console.log(`response token: ${JSON.stringify(tokenResponse)}`);

        if (tokenResponse.exito) {
            console.log(`Generar politica`)
            return generatePolicy(principalId, 'Allow', event.methodArn)
        }else{
            return generatePolicy(principalId, 'Deny', event.methodArn)
        }

    }


    if (event.action == 'token') {
        console.log(`Generar Token`)
        const token = tokenController.generateToken(params);

        if(token.statusCode == 500) {
            callback(new Error("INTERNAL_ERROR","INTERNAL Error..."));
        }

        if(token.statusCode == 401) {
             callback(new Error("UNAUTHORIZED","Unauthorized Error..."));
         }

        if(token.statusCode == 400) {
            callback(new Error("BAD_REQUEST","BAD Request..."));
        }

        return token;
    }

    if (event.action == 'check-token') {

        console.log(`Handler:: Check Token`);
        const token = await tokenController.validateToken(params);
        console.log(`Handler::: After Check Token: ${token}`);
        console.log("Handler:: statusCode:", token.statusCode);

        if(token.statusCode == 500) {
            callback(new Error("INTERNAL_ERROR","INTERNAL Error..."));
        }

        if(token.statusCode == 401) {
             callback(new Error("UNAUTHORIZED","Unauthorized Error..."));
         }

        if(token.statusCode == 400) {
            callback(new Error("BAD_REQUEST","BAD Request..."));
        }
        return token;
        //callback(undefined, token);
        //callback(JSON.stringify(token));
        // var myErrorObj = {
        //         statusCode: token.statusCode,
        //         requestId : context.awsRequestId,
        //         body: token
        //     };
       // context.fail(JSON.stringify(myErrorObj));
    }

    if (event.action == 'refresh-token') {
        console.log(`Refresh token`);
        const token = await tokenController.refreshToken(params);
        
        console.log(`Refresh token:result:statusCode: ${token.statusCode}`);

        if(token.statusCode == 500) {
            callback(new Error("INTERNAL_ERROR","INTERNAL Error..."));
        }

        if(token.statusCode == 401) {
             callback(new Error("UNAUTHORIZED","Unauthorized Error..."));
         }

        if(token.statusCode == 400) {
            callback(new Error("BAD_REQUEST","BAD Request..."));
        }

        if(token.statusCode == 202) {
            console.log("202: Accepted");
           callback(new Error("ACCEPTED"));
        }
        console.log("todo ok!");
        return token;
    }
}

const generatePolicy = (principalId, effect, resource) => {
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    console.log("return auth: " + authResponse);
    return authResponse;
}