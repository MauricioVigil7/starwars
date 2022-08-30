const controller = require('../Functions/StarShips/src/controller/StarWarsController.js');

describe('pruebas  Jasmine', function () {     

    var req = {
        nombre: 'prueba',
        modelo: 'abc'
    };

    var objLista =  controller.procesarGet(req);
    var rpta =  Promise.resolve(objLista);
    var exito = null;
    rpta.then((value) => {
        exito = value.body.exito;
        console.log('exito',value.body.exito);
    });

    console.log('procesarGet ');
    console.log('exito ',exito);
    it('busqueda por nombre y modelo que no existen ' , function () {
        console.log('******exito***',exito);
        expect(exito).toBe(false);
        console.log('*****fin***** ');
    });

});