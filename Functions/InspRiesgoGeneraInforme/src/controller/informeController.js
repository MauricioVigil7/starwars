const informeService = require('../service/informeService')
const response = require('../response/index')

const generarInforme = (data) => {
    try{
        let informe = informeService.getInforme(data)
        return response.successResponse("Informe generado", informe)
    } catch(e) {
        return response.errorResponse(e)
    }

}

module.exports = {
    generarInforme: generarInforme
}