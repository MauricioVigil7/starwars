const dynamoDbClient = require('../db/config')
const { v4: uuidv4 } = require('uuid')

const DATOS_TRAMITE_TABLE = process.env.DATOS_TRAMITE_TABLE;//referencia a la tabla inspeccion dentro de ello la idTarea
const GRUPO_RAMOS_TABLE = process.env.GRUPO_RAMOS_TABLE;
const CONTACTO_CLIENTE_TABLE = process.env.CONTACTO_CLIENTE_TABLE;
const VALORES_DECLARADOS_TABLE = process.env.VALORES_DECLARADOS_TABLE;

async function insertSolicitud(req) {
    try {
        let paramsDatosTramite = {
            TableName: DATOS_TRAMITE_TABLE,
            Item: {
                num_tramite: req.DatosTramite.claveTramite, //requerido
                num_informe: req.DatosTramite.claveTramiteGeneral,
                codEstadoTramite: req.DatosTramite.codEstadoTramite,
                nombreEstadoTramite: req.DatosTramite.nombreEstadoTramite,
                codTipoCotizacion: req.DatosTramite.codTipoCotizacion,
                tipoCotizacion: req.DatosTramite.tipoCotizacion,
                codTipoDocumento: req.DatosTramite.codTipoDocumento,
                tipoDocumento: req.DatosTramite.tipoDocumento,
                numeroDocumento: req.DatosTramite.numeroDocumento,
                codAgente: req.DatosTramite.codAgente, //requerido
                nombreAgente: req.DatosTramite.nombreAgente,
                codUsuario: req.DatosTramite.codUsuario,
                codInspector: req.DatosTramite.codInspector, //requerido
                nombreUsuarioInspector: req.DatosTramite.nombreUsuarioInspector,
                correo_insp: req.DatosTramite.correoInspector,
                fechaSolicitud: req.DatosTramite.fechaSolicitud,
                fechaEfecto: req.DatosTramite.fechaEfecto,
                fechaActualizacion: req.DatosTramite.fechaActualizacion,
                fechaInspeccion: req.DatosTramite.fechaInspeccion,
                fechaCarga: req.DatosTramite.fechaCarga,
                fechaVencimiento: req.DatosTramite.fechaVencimiento,
                oficina: req.DatosTramite.oficina,
                idTarea: req.idTarea
            },
        }

        const resultDatosTramite = await dynamoDbClient.put(paramsDatosTramite).promise();
        console.info(`Insert Data_Tramite: ${JSON.stringify(resultDatosTramite)}`)
        for (let i = 0, n=req.grupoRamos.length; i < n; i++) {
            if (req.grupoRamos[i].codigo || req.grupoRamos[i].descripcion) {
                const paramsGrupoRamos = {
                    TableName: GRUPO_RAMOS_TABLE,
                    Item: {
                        num_tramite: req.DatosTramite.claveTramite,
                        num_ramos: uuidv4(),
                        codigo: req.grupoRamos[i].codigo,
                        descripcion: req.grupoRamos[i].descripcion,
                    },
                };
                const resultGrupoRamos = await dynamoDbClient.put(paramsGrupoRamos).promise();
                console.log(`Insrt Ramos_tabla: ${JSON.stringify(resultGrupoRamos)}`)
            }
        }
        if (req.contactoCliente.nombre ||
            req.contactoCliente.direccion ||
            req.contactoCliente.direccion ||
            req.contactoCliente.telefono ||
            req.contactoCliente.email ||
            req.contactoCliente.valorizacion) {

            const paramsContactoCliente = {
                TableName: CONTACTO_CLIENTE_TABLE,
                Item: {
                    num_tramite: req.DatosTramite.claveTramite,
                    nombre: req.contactoCliente.nombre,
                    direccion: req.contactoCliente.direccion,
                    telefono: req.contactoCliente.telefono,
                    email: req.contactoCliente.email,
                    valorizacion: req.contactoCliente.valorizacion,
                },
            };

            const resultContactoCliente = await dynamoDbClient.put(paramsContactoCliente).promise();
            console.log(`Insert Contacto_cliente: ${JSON.stringify(resultContactoCliente)}`)
        }

        if (req.valoresDeclarados.conceptEdificacion ||
            req.valoresDeclarados.contenido ||
            req.valoresDeclarados.existencias ||
            req.valoresDeclarados.equiposMaquinaria) {
            const paramsValoresDeclarados = {
                TableName: VALORES_DECLARADOS_TABLE,
                Item: {
                    num_tramite: req.DatosTramite.claveTramite,
                    conceptEdificacion: req.valoresDeclarados.conceptEdificacion,
                    contenido: req.valoresDeclarados.contenido,
                    existencias: req.valoresDeclarados.existencias,
                    equiposMaquinaria: req.valoresDeclarados.equiposMaquinaria
                },
            };

            const resultValoresDeclarados = await dynamoDbClient.put(paramsValoresDeclarados).promise();
            console.log(`Insert Valores_Declarados: ${JSON.stringify(resultValoresDeclarados)}`)
        }
        return { result: true };
    } catch (error) {
        console.log(error);
        return { result: false, data: 'Could not insert' };
    }
}

module.exports = {
    insertSolicitud
}