const generaClaveDinamica = require('./src/controller/GeneraClaveDinamicaController');

module.exports.generarClave = async (event, context) => {
    const currentMethod = event.httpMethod;
    const queryStringParams = event.queryStringParameters;
    const bodyParams = event.body;
    console.log('**** handler.js ****');
    console.log('**** event ****' ,event);
    console.log('**** context ****' + JSON.stringify(context));
    console.log('**** currentMethod :' + currentMethod);
    console.log('**** queryStringParams :' + queryStringParams);
    console.log('bodyParams:', bodyParams);
    
    if(currentMethod === undefined) {
        //event.do='generar';
        if(event.do === 'generar') {
            console.log('event.do:', event.do);
            const result = await generaClaveDinamica.generarClave(event);
            console.log('*****result*****:', result);
            return result;
        }
    
    }
    
    switch (currentMethod) {
        case 'POST':
            console.log('*****1111*****:');
            const result =  generaClaveDinamica.generarClave(JSON.parse(bodyParams));
            console.log('*****result*****:', result);
            return result;
        case 'PUT':
            return generaClaveDinamica.verificarClave(JSON.parse(bodyParams));
        default:
            return 'method not allowed';
    }
};
/*
module.exports.install = async () => {
    console.log('Installing database...');
    await dbInit.initInspecciones();
    console.log('Database installed finished...');
}
*/