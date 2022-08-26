const inspeccionesService = require("../service/InspeccionesService");
const response = require("../response");

async function test(req) {
    return response.successResponse("success");
}
async function fechaHora(){
    var now = new Date();
    var hora = now.getHours() + ':' + now.getMinutes() ; 
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); 
    var yyyy = now.getFullYear();
    var fechaHorahoy = dd + '/' + mm + '/' + yyyy  +' ' + hora;
	////console.log('**** fechaHora****');
    return fechaHorahoy;
}

async function getInspecciones(params) {
    var fechaConsulta = await fechaHora();
    ////console.log('**** getInspecciones********  ',params);
    const inspecciones = await inspeccionesService.getInspecciones(params); 
    ////console.log('inspecciones.status',inspecciones.status);
    if(inspecciones.status == 200) {
        ////console.log('*********inspecciones.status*********',inspecciones.status);
        var repta = response.successResponse("success", {
            coordX:inspecciones.data.coordX,
            coordY: inspecciones.data.coordY 
        });
        ////console.log('***********repta***********',repta);
        return repta;
    } 
    if(inspecciones.status != 200) {
        return response.errorResponse("error", {
            errores: inspecciones.errores,
            statusCode:inspecciones.status
        });
    }
}

async function insertInspecciones(params) {
    // var fechaConsulta = await fechaHora();
     ////console.log('**** getInspecciones********  ',params);
    const inspecciones = await inspeccionesService.insertInspecciones(params);
    ////console.log('**** inspecciones********  ',inspecciones);
    if(inspecciones.status == 200) {
        ////console.log('*********inspecciones.status*********',inspecciones.status);
        var repta = response.successResponse("success", 
            { 
                codigo: inspecciones.data.codigo, 
                mensaje: inspecciones.data.mensaje
            }
            );
            //console.log('***********repta***********',repta);
            return repta;

    } 

    if(inspecciones.status != 200) {
        return response.errorResponse("error", {
            errores: inspecciones.errores,
            statusCode:inspecciones.status
        });
    }

}

async function updateInspecciones(params) {
    //console.log('**** getInspecciones********  ',params);
    const inspecciones = await inspeccionesService.updateInspecciones(params);
    //var fechaConsulta = await fechaHora();
    if(inspecciones.status == 200) {
        var repta = response.successResponse("success", 
            { 
                codigo: inspecciones.data.codigo, 
                mensaje: inspecciones.data.mensaje
            }
            );
            //console.log('***********repta***********',repta);
            return repta;
    } 

    if(inspecciones.status != 200) {
        return response.errorResponse("error", {
            errores: inspecciones.errores,
            statusCode:inspecciones.status
        });
    }
}

module.exports = {
    test, getInspecciones, insertInspecciones, updateInspecciones
}