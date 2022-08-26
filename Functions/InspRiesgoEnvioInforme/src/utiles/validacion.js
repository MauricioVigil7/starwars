
async function validarBoolean(input,campo){
    if (typeof input != 'boolean')
      {
        return {result: false, errores: {codigo:'11',mensaje: input+'no es boolean:'+campo}};
      }
    if(input){
        return {result: true,data:{codigo:'1'}};
    }
    return {result: true,data:{codigo:'0'}};
    
}

async function validarFloat(input){
    if(!isNaN(input)&&parseFloat(input)==input){
        return {result: true};
    }
    return {result: false, errores: {codigo:'10',mensaje:'no es float'}};
}

async function fechaHora(){
    var now = new Date();
    var hora = now.getHours() + ':' + now.getMinutes() ;
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); 
    var yyyy = now.getFullYear();
    var fechaHorahoy = dd + '/' + mm + '/' + yyyy  +' ' + hora;
	console.log('fechaHorahoy',fechaHorahoy);
    return fechaHorahoy;
}

async function fecha(){
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); 
    var yyyy = now.getFullYear();
    var fechahoy = dd + '/' + mm + '/' + yyyy;
	console.log('fechahoy',fechahoy);
    return fechahoy;
}


async function validateDate(valor) {
    
    var dateString = valor;
    var dataSplit = dateString.split('/');
    var dateConverted;

    if (dataSplit[2].split(" ").length > 1) {

        var hora = dataSplit[2].split(" ")[1].split(':');
        dataSplit[2] = dataSplit[2].split(" ")[0];
        dateConverted = new Date(dataSplit[2], dataSplit[1]-1, dataSplit[0], hora[0], hora[1]);

    } else {
        dateConverted = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
    }
    
    var isValidDate = Date.parse(dateConverted);
    if (isNaN(isValidDate)) {
          return {result: false, errores: {codigo:'4',mensaje:'This is not a valid date format.'+ valor}};
    }
    return {result: true};
}

async function validateParametro(valor,nombre) {
    if (typeof valor === "object") {//null
      return {result: false, errores: {codigo:'5',mensaje:'parametro ' + nombre + ' es null '+ valor}};
    }
    if (typeof valor === "undefined") {
      return {result: false, errores: {codigo:'5',mensaje:'parametro ' + nombre + ' es '+ valor}};
    }
    if(valor.length === 0){
      return {result: false, errores: {codigo:'5',mensaje:'parametro ' + nombre + ' es vacio '+ valor}};
    }
    return {result: true};
}

async function validarEmail(valor) {
    
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(valor) ? {result: true} : {result: false, errores: {codigo:'6',mensaje:'La dirección de email '+ valor + ' es incorrecta'}};
}

async function validarNumero(input,name){
    if(!isNaN(input)&&parseInt(input)==input){
        return {result: true};
    }
    return {result: false, errores: {codigo:'9',mensaje: name + ' no es numero o no es entero'}};
}

async function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

async function IsJsonString(valor) {
    try {
        JSON.parse(valor) ;
    } catch (e) {
        return {result: false, errores: {codigo:'8',mensaje:'formato json incorrecto: '+ valor + 'error:'+e}};
    }
    return {result: true};
}

module.exports = {
  fechaHora,validarBoolean,fecha, validarFloat, validarNumero,replaceAll, validateDate,validateParametro,validarEmail,IsJsonString
    
}
