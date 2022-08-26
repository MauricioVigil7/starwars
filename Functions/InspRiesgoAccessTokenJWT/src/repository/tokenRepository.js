const dynamoDbClient = require('../db/config');

const TOKEN_TABLE = process.env.TOKEN_TABLE;
//const COD_POR_INSPECCIONAR = process.env.COD_POR_INSPECCIONAR;
const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;

async function getToken(req) {
    const params = {
        TableName: TOKEN_TABLE,
        Key: {
            token: req.accessToken
        },
    };

    try {
        const {Item} = await dynamoDbClient.get(params).promise();
        if (Item) {
            const {token, email, username} = Item;
            return {
                result: true, 
                status: 200,
                data: {token, email, username}
            };
        } else {
            return {
                result: false,
                status: 401, 
                errores: {
                    codigo:'1',
                    mensaje:'No se reconoce Token ' + TOKEN_TABLE
                }
            };
        }
    } catch (error) {
        console.log(error);
        return {
            result: false, 
            status: 500,
            errores: {
                codigo:'-1',
                mensaje:'Error Interno ' + error
            }
        };
    }
}

async function insertToken(req) {
    
    var  item= {
            email: req.email,
            password: req.password,
            username: req.username,
            token: req.token,
            created_at: (new Date()).toISOString(),
        };
        
        if (req.email == undefined) {
           delete item['email'] 
        }
        if (req.password == undefined) {
           delete item['password'] 
        }
        
    console.log('item:',item);
    const params = {
        TableName: TOKEN_TABLE,
        Item: item,
    };

    try {
        await dynamoDbClient.put(params).promise();
        return {
            result: true,
            status: 200, 
            data:{
                codigo:'0',
                mensaje:'Token generado'
            }
        };

    } catch (error) {
        console.log(error);
       return {
            result: false, 
            status: 401,
            errores: {
               codigo:'1',
               mensaje:'Error al generar Token',
            }
        };
    }
}

async function getInspecciones(correo_insp) {

	var params = {
                TableName: INSPECCIONES_TABLE,
               
                ExpressionAttributeValues: {
                   ':correo_insp' :correo_insp
                },
                KeyConditionExpression: 'correo_insp =:correo_insp',
			};
	const {Items} = await dynamoDbClient.query(params).promise();
			
    if (Items.length > 0) {
         var stringify =JSON.stringify(Items);
         var datos  = JSON.parse(stringify);
         return {
            result: true, 
            status: 200,
            data: datos
        };
    }
        return {
            result: false, 
            status: 404, 
            errores:{
                codigo:'3',
                mensaje:'consulta sin resultado'
            }
        };   
      
    } 



module.exports = {
    getToken,
    insertToken,
    getInspecciones
}