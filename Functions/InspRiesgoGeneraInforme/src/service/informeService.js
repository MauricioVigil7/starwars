const AWS = require('aws-sdk')
const Docxtemplater = require("docxtemplater")
//const ImageModule = require("docxtemplater-image-module")
const PizZip = require("pizzip")
const fs = require("fs")

const repository = require('../repository/database')
const filesystem = require('../repository/filesystem')

const BUCKET_TEMPLATE = process.env.BUCKET_TEMPLATE
const BUCKET_INFORME = process.env.BUCKET_INFORME
const INFORME_1 = process.env.PATH_INFORME_1
const INFORME_2 = process.env.PATH_INFORME_2
const INFORME_3 = process.env.PATH_INFORME_3


/**
 * Función para obtener la plantilla a utilizar
 * @param {String} tipoInforme Tipo de Informe 
 * @returns 
 */
const getTemplate = async (tipoInforme) => {

    try {

        let params = {
            bucket: BUCKET_TEMPLATE,
        }

        if (parseInt(tipoInforme) === 1) {
            params.key = INFORME_1

        } else if (parseInt(tipoInforme) === 2) {
            params.key = INFORME_2

        } else if (parseInt(tipoInforme) === 3) {
            params.key = INFORME_3
        }

        console.log(`Params getTemplate: ${JSON.stringify(params)}`)

        return await filesystem.getObject(params)

    } catch (e) {
        throw new Error("Error al obtener la Plantilla")
    }

}

/**
 * Función para subir un archivo al S3
 * @param {String} key Nombre del archivo 
 * @param {Object} content Contenido en bytes del archivo
 * @returns 
 */
const uploadInforme = (key, content) => {
    let params = {
        bucket: BUCKET_INFORME,
        key: key,
        file: content
    }
    console.debug(`params uploadInforme: ${JSON.stringify(params)}`)
    return filesystem.putObjet(params)
}

/**
 * Función que genera el Informe
 * @param {Object} data Objeto que tiene el Email y la Clave del trámite 
 * @returns 
 */
const getInforme = async (data) => {

    try {

        //Obtener los datos de la inspeccion
        let inspeccion = await repository.getInspeccion(data)
        console.log(`Inspeccion: ${JSON.stringify(inspeccion)}`)

        //obtener el tipo de informe
        let tipoInforme = inspeccion.Item.cod_tipinforme
        console.debug(`Tipo de Informe: ${tipoInforme}`)

        if (!tipoInforme) {
            throw new Error("No existe el tipo de Informe")
        }

        let template = await getTemplate(tipoInforme)
        console.debug(`Template obtenido`)

        if (!template.Body) {
            throw new Error("No existe la plantilla del Informe tipo:  " + tipoInforme)
        }

        const zip = new PizZip(template.Body.toString('binary'))

        const imageOpts = {
            centered: false,
            getImage: function (tagValue, tagName) {
                return fs.readdirSync("/home/furth/Imágenes/logo-login.png")
            },
            getSize: function (img, tagValue, tagName) {
                // it also is possible to return a size in centimeters, like this : return [ "2cm", "3cm" ];
                return [30, 30];
            }
        };

        const Opts = {
            paragraphLoop: true,
            linebreaks: true,
            //modules: [new ImageModule(imageOpts)]
          
        };

        const doc = new Docxtemplater(zip, Opts)

        console.debug(`Plantilla para renderizar`)

        //obtener la data para renderizar el documento
        let dataRender = {}

        if (parseInt(tipoInforme) === 1) {

            //dataRender = await dataInformeCheckList(inspeccion.Item.num_tramite, inspeccion.Item)
            dataRender = await dataInformeConstruccion(inspeccion.Item.num_tramite, inspeccion.Item)

        } else if (parseInt(tipoInforme) === 2) {
            dataRender = await dataInformeRRGG(inspeccion.Item.num_tramite, inspeccion.Item)

        } else if (parseInt(tipoInforme) === 3) {
            dataRender = await dataInformeConstruccion(inspeccion.Item.num_tramite, inspeccion.Item)
        }
        console.log(`DataRender: ${JSON.stringify(dataRender)}`)
        doc.render(dataRender)
        console.debug(`Objeto renderizado`)

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        })

        data = []
        let responseFile = await uploadInforme('informe.docx', buf)
        data.push(responseFile)

        return { result: true, data: data };

    } catch (e) {
        throw new Error("Error general")
    }

}

/**
 * Método que generar el JSON para el informe tipo I
 * @param {String} num_tramite Numero del trámite 
 * @param {Object} inspeccion Objeto de la Inspección
 * @returns 
 */
const dataInformeConstruccion = async (num_tramite, inspeccion) => {
    let data = {}

    if (!num_tramite) {
        throw new Error("Falta el Número de Trámite")
    }
    //asignar dato de la Inspeccion
    data.Inspeccion = inspeccion

    //asignar valores del entrevistado
    let entrevistado = await repository.getEntrevistado(num_tramite)
    let entrevis = []
    entrevistado.Items.forEach(element => {
        entrevis.push(element)
    });
    data.Entrevistado = entrevis

    //asignar valores del riesgo
    let riesgo = await repository.getRiesgo(num_tramite)
    let ries = []
    riesgo.Items.forEach(element => {
        ries.push(element)
    });
    data.Riesgo = ries

    //asignar vlaores del siniestro
    let siniestro = await repository.getSiniestro(num_tramite)
    let sin = []
    siniestro.Items.forEach(element => {
        sin.push(element)
    });
    data.Siniestros = sin

    //cargar las imagenes
    let imagenes = await repository.getArchivo(num_tramite)
    let tipo1 = {}
    let tipo2 = {}
    let otros = []
    imagenes.Items.forEach(element => {
        if (element.tip_archivo == 1) {
            tipo1 = element
        } else if (element.tip_archivo == 2) {
            tipo2 = element
        } else {
            otros.push(element)
        }
    })
    /*
    data.Archivo.Tipo1 = tipo1
    data.Archivo.Tipo2 = tipo2
    data.Archivo.Otros = otros
    */

    data.Archivo = {
        Tipo1: "iVBORw0KGgoAAAANSUhEUgAAARwAAACxCAMAAAAh3/JWAAAAflBMVEUAAAD+/v7///94eHiRkZHz8/Pv7+/Gxsbl5eVkZGTT09MaGhpYWFg7Ozunp6exsbFFRUUmJiYfHx+EhIS5ublubm7f39/Nzc3AwMAvLy+JiYkRERFRUVFMTEzx8fGenp40NDR9fX2hoaFnZ2cLCwtycnKYmJhBQUGGhoY5OTmyM5sYAAAITklEQVR4nO2Ya3fiOAyGFUEoECAkFNpwKZdSKP//D67k3OSQsGV2ztnb6w8zVLEl+Ykky6Hgnz342emygJ9c1DnoN+n5Tw7AeTAA58EAnAejhMPMrpRx8ZsrAdf1rfrdLWs8qZ+xp7exsHrcVNO07i1/OM/33X/c6VNgHKnhcP6k+hkYsT/aTgJ+9LBb/ITi9id8L/qto4SzJOoxE9E7D6kYI+ab+zEuWPeJtko2FNlbIfsiWqpsILIhv8u/xYMgVxLqwx7RJ/O5VDxU2VFl9bwPPhHNnQtxoUwefqsXub5VuXpernrnF7dQ/twSHYt5b27SlVUm41UfG7dCt1B+zFTGk1LrWyFLmTOiNVs44v43c0L0UsNZMu88OJfcVQ6jWnZUqhUc8XZTwolqOAuiL2c0HwOVrYuFFUTxbMKc6n4qOP0cvQdn4iI/UlffSgOjcj8Bj92kLausBCFwkhJOqgvlR+zgjEqt40I2ZZ4T9ZtwFoADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOIADOP9WOOcSzqaGc/z9cDa/Cif6a3A2mRtJj3mSyI9NCWKfJksH55BUsnWaLhycJDsLnCjJSjg3XZv7vk6ToxhNcsWRg9NP02MOxwl9OOcsdXAuadIr4ZRuufcj2jcCZ5OlzsAySfslnE0+ib+c7w7Oyya5lnDcQgWhruaTZJx/CKce+oaKH/ms8meLLJ9nHgRmqafMLKinyTBw7iYFzdVBZa5jnud783GHTz+AE/w9w8L5u1wAnAcu/AiOl1pm8Z3EhGlTej/rsawVTpfBP5d1ut++PP//J3B4EL/mI15ZR+Nttp0FVjMHs102ie+shbH3+pnfR9n1Enqy4Ww5PYyqtS1wpA6Jxdjf4WAxPXytfFlwanqRa5/ExlteVbv68JcP4zf+OZzq2KSTUTOhaJqfpLVXO0qn1XFby7/Ko7NWfz3TZmBc1ZbomuXNQRecLUXXhkVxLbsRWWIcXimZ5p1BKZID/Wy1q2xf7arB9iaNxs/hDC57HaelcUKcl+N4ENmqJJ3Pmnl4LrueUix9xcF6f6KRRM2S5mbp+2Il4fxSd0x3cGSZWkzprXYiSMUl7W9sSK9lM0qtlvHbUbXLPLN2nO9qdnM9lN1EwfW5mjOlOhN4ojplCzPj1k4niHY/iT4oOhs42g8Geu4mxtUi0SXGXjvhjJz2mf+GRqrpZoNVuktVv3YNn6/9aEOs2NSHF4oaZOlTcAph31O91Gcy0bow0ffOn3bTblPvkYUzzrciII7N2i14uyNnqXrFYu2TOK5OnCQ16mrCV40ZycHVnfat71lh0QYOBwd6eR6OBOXIannXln5MB1vjXrWOvNh0cSaOgU0rUbTg3Mi8eaa8UtZZc8TiZiUW6/Kld42BZBrtpiaTZWXyIZMnd+fCC2VBU+a9cfn7m2arp+GIC5F/vMgNqU9nP1+XcqmhaGAhDinlkPzIcS0/H2jjaQxsoWgryF8Ni6I7cTEy+DQBLLccOq8pCZscVs3S64CPvA28idFfgLNrllnxIb80Wtm2uPvVkrms8+HIBV3L46UxVfdq7LX0Oc6ieRuyjat0FOJ7o5hcvTwrpIOzLQGFzH/jWg4Hz8ORrfQbKdCnNKGrFyUSlElKc2NP6oEcYArH9Hevon02of7U5ygHkcnilshZq8V53ZVIDM5Fd6QfQSycHmUbmjSiMkzvem39zOCXx54efgqHH8CR9JBjs7jiB+4dHRr95UXSJ5xqetcySanwIzERnb/bHI5Z+6KfK2L20ipnU29cquzOuRDX72czCBM6W+2ZlPs3ljPAxFePpsEwoquNHZaFzbhRGwuPzbt+l8nhcP5+Es3+4vtHCSfnapZNm0k11ADn4GZyVpNa6mOY1f2X6i/Hpw38INRCagoyB0nXRY6txfBQH9vaJLyqMXm7VQRoNyPKw4i+bSrf7rXrdyK/wf+svT3d+0KV9+UFPv9zrG/RU7zPv02tjH5JNEUskzeVaHzRIRl4ujRuEO4YM+5/UuNi4LugFo93FlNXtwQSVQEsqX1hdzRtjPal7cdK4cXNNIJXdXa/oN2+72LBd4GaCqpt+2o0g/a6MDzXdaMoi+pq7b4bId1arnfe+avHRNst8M5iYLV/u5Ik6TCtNRVeSFj4xelOe94Q+T6xS6tjqxtdcHrNYiZFNZVXJmlTn0MSCgfVv5cw8yd7p1XpxNq2pqbf6KAjFhNdGJs2SsNIvTjYknNxZU4UTqxsdq+dI//iUCvttfrwczjBlDb7uOfdVqRsRLP4kxr1SeFk1qkV9eN4Tpktx+sy2b+64IjFaB8vybt0SJGexVMPs1SbbBaPvLvVuqXwBbxphzN+Ek5/2ixnHC7V2MHKeeA+UN+aPTqHW6+5zr/ZH71zfL/burHrd8CRdHUWb54necVfeAExdF5czRvi07zQvrYTJ/NBa+RM233ogHP3tcqJPlarYfP70b2sZbnc3FersOvTU4cLOiW8187BavXRVDVozuv8Wtdup92HLjgdzrZi6N7d09N+1eIvqv+T8RSc/9sAnAeDGKNzAM6DATgPBuA8GH8A3VivlIMUd2oAAAAASUVORK5CYII"
    }


    return data
}

const dataInformeCheckList = async (num_tramite, inspeccion) => {
    let data = {}

    if (!num_tramite) {
        throw new Error("Falta el Número de Trámite")
    }
    //asignar dato de la Inspeccion
    data.Inspeccion = inspeccion

    //asignar valores del entrevistado
    let entrevistado = await repository.getEntrevistado(num_tramite)
    let entrevis = []
    entrevistado.Items.forEach(element => {
        entrevis.push(element)
    });
    data.Entrevistado = entrevis

    //asignar valores de Edificacion
    let edificaciones = await repository.getEdificacion(num_tramite)
    let edificacion = []
    edificaciones.Items.forEach(element => {
        edificacion.push(element)
    });
    data.Edificacion = edificacion

    //asignar valores de Actividad
    let actividades = await repository.getActividad(num_tramite)
    let actividad = []
    actividades.Items.forEach(element => {
        actividad.push(element)
    });
    data.Actividad = actividad

    //asignar valores de Almacenamiento
    let almacenamientos = await repository.getAlmacenamiento(num_tramite)
    let almacenamiento = []
    almacenamientos.Items.forEach(element => {
        almacenamiento.push(element)
    })
    data.Almacenamiento = almacenamiento

    //asignar valores de Incendio
    let incendios = await repository.getIncendio(num_tramite)
    let incendio = []
    incendios.Items.forEach(element => {
        incendio.push(element)
    })
    data.Incendio = incendio

    //asignar valores de Ramos
    let ramos = await repository.getRamos(num_tramite)
    let ramo = []
    ramos.Items.forEach(element => {
        ramo.push(element)
    })
    data.Ramos = ramo

    //asignar valroes de Robo
    let robos = await repository.getRobo(num_tramite)
    let robo = []
    robos.Items.forEach(element => {
        robo.push(element)
    })
    data.Robo = robo

    //asignar valores de Siniestro
    let siniestros = await repository.getSiniestro(num_tramite)
    let siniestro = []
    siniestros.Items.forEach(element => {
        siniestro.push(element)
    })
    data.Siniestro = siniestro

    //console.debug(`Data Informe II: ${JSON.stringify(data)}`)

    return data
}

const dataInformeRRGG = async (num_tramite, inspeccion) => {
    let data = {}

    if (!num_tramite) {
        throw new Error("Falta el Número de Trámite")
    }
    //asignar dato de la Inspeccion
    data.Inspeccion = inspeccion

    //asignar Riesgos
    let riesgos = await repository.getRiesgo(num_tramite)
    let riesgo = []
    riesgos.Items.forEach(element => {
        riesgo.push(element)
    })
    data.Riesgo = riesgo

    //asignar Perdidas
    let perdidas = await repository.getPerdida(num_tramite)
    let perdida = []
    perdidas.Items.forEach(element => {
        perdida.push(element)
    })
    data.Perdida = perdida

    //asignar valores de la edificación
    let edificaciones = await repository.getEdificacion(num_tramite)
    let edificacion = []
    edificaciones.Items.forEach(element => {
        edificacion.push(element)
    })
    data.Edificacion = edificacion

    //asiganar valores de Almacenamiento
    let almacenamientos = await repository.getAlmacenamiento(num_tramite)
    let almacenamiento = []
    almacenamientos.Items.forEach(element => {
        almacenamiento.push(element)
    })
    data.Almacenamiento = almacenamiento

    //asignar valores de Incendio
    let incendios = await repository.getIncendio(num_tramite)
    let incendio = []
    incendios.Items.forEach(element => {
        incendio.push(element)
    })
    data.Incendio = incendio


    //asignar valores de Ramos
    let ramos = await repository.getRamos(num_tramite)
    let ramo = []
    ramos.Items.forEach(element => {
        ramo.push(element)
    })
    data.Ramos = ramo

    //asignar valores de Robo
    let robos = await repository.getRobo(num_tramite)
    let robo = []
    robos.Items.forEach(element => {
        robo.push(element)
    })
    data.Robo = robo

    //console.debug(`Data Informe I: ${JSON.stringify(data)}`)

    return data
}

module.exports = {
    getInforme: getInforme
}