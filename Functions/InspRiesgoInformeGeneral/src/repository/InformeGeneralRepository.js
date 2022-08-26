const dynamoDbClient = require('../db/config');

const ARCHIVO_TABLE = process.env.ARCHIVO_TABLE;
const INSPECCION_TABLE = process.env.INSPECCION_TABLE;
const ENTREVISTADO_TABLE = process.env.ENTREVISTADO_TABLE;
const MATRIZ_TABLE = process.env.MATRIZ_TABLE;
const RIESGO_TABLE = process.env.RIESGO_TABLE;
const PERDIDA_TABLE = process.env.PERDIDA_TABLE;
const EDIFICACION_TABLE = process.env.EDIFICACION_TABLE;
const ACTIVIDAD_TABLE = process.env.ACTIVIDAD_TABLE;
const ALMACENAMIENTO_TABLE = process.env.ALMACENAMIENTO_TABLE;
const INCENDIO_TABLE = process.env.INCENDIO_TABLE;
const RAMOS_TABLE = process.env.RAMOS_TABLE;
const ROBO_TABLE = process.env.ROBO_TABLE;
const SINIESTRO_TABLE = process.env.SINIESTRO_TABLE;
const ENLACE_TABLE = process.env.ENLACE_TABLE;

async function guardarStep4(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
            des_direccion: req.datosNivelRiesgo.direccion,
            fec_inspeccion: req.datosNivelRiesgo.fechaInspeccion,
            hor_inspeccion: req.datosNivelRiesgo.horaInspeccion,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Item: {
                num_archivo: req.id,
                num_tramite: req.claveTramite,
                num_archivo: arc.archivo.codArchivo,
                cod_tip_archivo: arc.archivo.tipoArchivo,
                nom_archivo: arc.archivo.nomArchivo,
            },
        };

        try {
            await dynamoDbClient.put(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function guardarStep5(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
            nom_razsocial: req.datosNivelRiesgo.razonSocial,
            actividad_local: req.datosNivelRiesgo.actividadLocal,
            hor_inspeccion: req.datosNivelRiesgo.horaInspeccion,
            num_piso: req.informacionSBS.numeroPisos,
            num_sotano: req.informacionSBS.numeroSotanos,
            cod_estructura: req.informacionSBS.codTipoEstructura,
            cod_uso: req.informacionSBS.codTipoUso,
            num_latitud: req.informacionSBS.coordLatitud,
            num_longitud: req.informacionSBS.coordLongitud,
            mto_edificacion: req.valoresDeclarados.montoEdificacion,
            mto_maquinaria: req.valoresDeclarados.montoMaquinaria,
            mto_existencia: req.valoresDeclarados.montoExistencias,
            mto_lucro: req.valoresDeclarados.montoLucroCesante,
            mto_total: req.valoresDeclarados.total,
            des_observacion: req.valoresDeclarados.observacion,
            porcen_pml: req.perdidaMaximaProbable.montoMaximoSujeto.pml,
            porcen_eml: req.perdidaMaximaProbable.montoMaximoSujeto.eml,
            des_garantia: req.estCunplGarantiaDadaPoliza.garantia,
            cod_estatus: req.estCunplGarantiaDadaPoliza.estatus,
            des_justificacion: req.estCunplGarantiaDadaPoliza.justificacion,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const entrevistado of req.listaEntrevistados) {
        const paramsEntrevistado = {
            TableName: ENTREVISTADO_TABLE,
            Item: {
                num_entrevistado: req.id,
                num_tramite: req.claveTramite,
                nom_entrevistado: entrevistado.nombreEntrevistado,
                des_cargo: entrevistado.cargo,
            },
        };

        try {
            await dynamoDbClient.put(paramsEntrevistado).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ENTREVISTADO_TABLE}
        }
    }

    const paramsMatriz = {
        TableName: MATRIZ_TABLE,
        Item: {
            num_matriz: req.id,
            num_tramite: req.claveTramite,
            cod_cord_matriz: req.evalRiesgoPerdida.coordenadaMatriz,
            cod_tip_riesgo: req.evalRiesgoPerdida.valorMatriz,
        },
    };

    try {
        await dynamoDbClient.put(paramsMatriz).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + MATRIZ_TABLE};
    }

    const paramsRiesgo = {
        TableName: RIESGO_TABLE,
        Item: {
            num_riesgo: req.id,
            num_tramite: req.claveTramite,
            des_incendio: req.riesgoPropPerdidaBeneficio.riesgoPropiedad.incendio,
            des_rot_maq: req.riesgoPropPerdidaBeneficio.riesgoPropiedad.roturaMaquina,
            des_robo: req.riesgoPropPerdidaBeneficio.riesgoPropiedad.robo3D,
            des_perd_ben: req.riesgoPropPerdidaBeneficio.riesgoPropiedad.perdidaBeneficio,
            des_huelga_cc: req.riesgoPropPerdidaBeneficio.riesgoPolitico.huelgaCc,
        },
    };

    try {
        await dynamoDbClient.put(paramsRiesgo).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + RIESGO_TABLE};
    }

    for (const perdida of req.listDeterEscenarioPerdida) {
        const paramsPerdida = {
            TableName: PERDIDA_TABLE,
            Item: {
                num_perdida: req.id,
                num_tramite: req.claveTramite,
                num_id: perdida.deterEscenarioPerdida.id,
                des_escenario: perdida.deterEscenarioPerdida.escenario,
                des_perdida: perdida.deterEscenarioPerdida.afectacion,
            },
        };

        try {
            await dynamoDbClient.put(paramsPerdida).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + PERDIDA_TABLE}
        }
    }

    return {result: true, data: []};
}

async function guardarStep6(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsEdificacion = {
        TableName: EDIFICACION_TABLE,
        Item: {
            num_edificacion: req.id,
            num_tramite: req.claveTramite,
            des_interna: req.descripcionInterna.descripcion,
            num_latitud: req.descripcionInterna.latitud,
            num_longitud: req.descripcionInterna.longitud,
            des_sepa_riesg: req.descripcionInterna.separacionRiesgo,
            des_ent_colinda: req.entorno.colindantes,
            des_natural: req.entorno.naturaleza,
        },
    };

    try {
        await dynamoDbClient.put(paramsEdificacion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + EDIFICACION_TABLE};
    }

    const paramsActividad = {
        TableName: ACTIVIDAD_TABLE,
        Item: {
            num_actividad: req.id,
            num_tramite: req.claveTramite,
            des_actividad: req.actividadDesarrollada.descripcion,
            des_personal: req.actividadDesarrollada.personal,
        },
    };

    try {
        await dynamoDbClient.put(paramsActividad).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + ACTIVIDAD_TABLE};
    }

    const paramsAlmacenamiento = {
        TableName: ALMACENAMIENTO_TABLE,
        Item: {
            num_almacenamiento: req.id,
            num_tramite: req.claveTramite,
            nom_almacen: req.almacenes.nombreAlmacen,
            des_mercaderia: req.almacenes.mercaderiaAlmacenada,
            des_caracteristica: req.almacenes.caracteristicasAlm,
            des_inventario: req.almacenes.inventarios,
        },
    };

    try {
        await dynamoDbClient.put(paramsAlmacenamiento).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + ALMACENAMIENTO_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Item: {
                num_archivo: req.id,
                num_tramite: req.claveTramite,
                num_archivo: arc.archivo.codArchivo,
                cod_tip_archivo: arc.archivo.tipoArchivo,
                nom_archivo: arc.archivo.nomArchivo,
            },
        };

        try {
            await dynamoDbClient.put(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    return {result: true, data: []};
}

async function guardarStep7(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsIncendio = {
        TableName: INCENDIO_TABLE,
        Item: {
            num_incendio: req.id,
            num_tramite: req.claveTramite,
            des_proc_prop: req.incendio.medidasIncendio.procPropioPlanSeg,
            des_briga_contr: req.incendio.medidasIncendio.brigadaIncendio,
            des_distr_extin: req.incendio.medidasIncendio.distribucionExtintores,
            cod_bomberos: req.incendio.medidasIncendio.codBombero,
            des_detec_ince: req.incendio.deteccionIncendio.descripcion,
            des_sis_cont_ince_nfpa72: req.incendio.sistemaContraIndendioNFPA72.descripcion,
            des_sis_cont_ince_nfpa: req.incendio.sistemaContraIndendioNFPA.descripcion,
        },
    };

    try {
        await dynamoDbClient.put(paramsIncendio).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INCENDIO_TABLE};
    }

    return {result: true, data: []};
}

async function guardarStep8(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramRamos = {
        TableName: RAMOS_TABLE,
        Item: {
            num_ramos: req.ramos.codRamos,
            num_tramite: req.claveTramite,
            des_maquina: req.ramos.detalleMaquina.descripcion,
            des_agua_desague: req.ramos.serviciosGenerales.aguaDesague,
            des_electricidad: req.ramos.serviciosGenerales.electricidad,
            des_aire_compri: req.ramos.serviciosGenerales.airecomprimido,
            des_calor_vapor: req.ramos.serviciosGenerales.calorVapor,
            des_combustible: req.ramos.serviciosGenerales.combustibles,
            des_pozo_tierra: req.ramos.serviciosGenerales.pozoTierra,
            des_sistema_frio: req.ramos.serviciosGenerales.sistemaFrio,
            des_otro_servic: req.ramos.serviciosGenerales.otrosServicios,
            des_plan_mant: req.ramos.gestionActivos.planMtto,
            des_repuestos: req.ramos.gestionActivos.repuestos,
        },
    };

    try {
        await dynamoDbClient.put(paramRamos).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + RAMOS_TABLE};
    }

    return {result: true, data: []};
}

async function guardarStep9(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsROBO = {
        TableName: ROBO_TABLE,
        Item: {
            num_robo: req.id,
            num_tramite: req.claveTramite,
            des_accesos: req.roboAsalto.accesoPrevio.accesos,
            des_primero: req.roboAsalto.accesoPrevio.perimetro,
            des_vig_guard: req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
            des_alar_instrus: req.roboAsalto.proteccionContraRobo.alarmasIntrucion,
            des_sist_cctv: req.roboAsalto.proteccionContraRobo.sistemaCCTV,
            des_pol_valor: req.roboAsalto.politicaManejoValores.descripcion,
        },
    };

    try {
        await dynamoDbClient.put(paramsROBO).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + ROBO_TABLE};
    }

    return {result: true, data: []};
}

async function guardarStep10(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const sin of req.listSiniestro) {
        const paramsSiniestro = {
            TableName: SINIESTRO_TABLE,
            Item: {
                num_siniestro: req.id,
                num_tramite: req.claveTramite,
                fec_siniestro: sin.siniestro.fecha,
                des_siniestro: sin.siniestro.descripcion,
                des_tie_paral: sin.siniestro.tiempoParalizacion,
            },
        };

        try {
            await dynamoDbClient.put(paramsSiniestro).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + SINIESTRO_TABLE}
        }
    }

    return {result: true, data: []};
}

async function guardarStep11(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Item: {
                num_archivo: req.id,
                num_tramite: req.claveTramite,
                num_archivo: arc.archivo.codArchivo,
                cod_tip_archivo: arc.archivo.tipoArchivo,
                nom_archivo: arc.archivo.nomArchivo,
                des_archivo: arc.archivo.comentario,
            },
        };

        try {
            await dynamoDbClient.put(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    for (const enl of req.listEnlace) {
        const paramsEnlace = {
            TableName: ENLACE_TABLE,
            Item: {
                num_enlace: req.id,
                num_tramite: req.claveTramite,
                cod_enlace: enl.enlace.cod_enlace,
                des_enlace: enl.enlace.des_enlace,
            },
        };

        try {
            await dynamoDbClient.put(paramsEnlace).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ENLACE_TABLE}
        }
    }

    return {result: true, data: []};
}

async function guardarStep12(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        Item: {
            num_tramite: req.claveTramite,
            cod_tipinforme: req.codTipoTramite,
            correo_insp: req.email,
            fec_actualizacion: req.fechaRegistro,
            des_garantia: req.propuestasGarantia,
            cod_estado: req.codEstadoTramite,
        },
    };

    try {
        await dynamoDbClient.put(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    return {result: true, data: []};
}

async function actualizarStep4(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion" +
            ", des_direccion=:des_direccion" +
            ", fec_inspeccion=:fec_inspeccion" +
            ", hor_inspeccion=:hor_inspeccion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
            ":des_direccion": req.datosNivelRiesgo.direccion,
            ":fec_inspeccion": req.datosNivelRiesgo.fechaInspeccion,
            ":hor_inspeccion": req.datosNivelRiesgo.horaInspeccion,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Key: {
                num_tramite: req.claveTramite,
            },
            UpdateExpression: "SET num_archivo=:num_archivo, cod_tip_archivo=:cod_tip_archivo, nom_archivo=:nom_archivo, ind_del=:ind_del",
            ExpressionAttributeValues: {
                ":num_archivo": arc.archivo.codArchivo,
                ":cod_tip_archivo": arc.archivo.tipoArchivo,
                ":nom_archivo": arc.archivo.nomArchivo,
                ":ind_del": arc.archivo.eliminado,
            },
        };

        try {
            await dynamoDbClient.update(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep5(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion" +
            ", des_direccion=:des_direccion" +
            ", fec_inspeccion=:fec_inspeccion" +
            ", hor_inspeccion=:hor_inspeccion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
            ":des_direccion": req.datosNivelRiesgo.direccion,
            ":fec_inspeccion": req.datosNivelRiesgo.fechaInspeccion,
            ":hor_inspeccion": req.datosNivelRiesgo.horaInspeccion,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Key: {
                num_tramite: req.claveTramite,
            },
            UpdateExpression: "SET num_archivo=:num_archivo, cod_tip_archivo=:cod_tip_archivo, nom_archivo=:nom_archivo, ind_del=:ind_del",
            ExpressionAttributeValues: {
                ":num_archivo": arc.archivo.codArchivo,
                ":cod_tip_archivo": arc.archivo.tipoArchivo,
                ":nom_archivo": arc.archivo.nomArchivo,
                ":ind_del": arc.archivo.eliminado,
            },
        };

        try {
            await dynamoDbClient.update(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep6(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsEdificacion = {
        TableName: EDIFICACION_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET des_interna=:des_interna" +
            ", num_latitud=:num_latitud" +
            ", num_longitud=:num_longitud" +
            ", des_sepa_riesg=:des_sepa_riesg" +
            ", des_ent_colinda=:des_ent_colinda" +
            ", des_natural=:des_natural",
        ExpressionAttributeValues: {
            ":des_interna": req.descripcionInterna.descripcion,
            ":num_latitud": req.descripcionInterna.latitud,
            ":num_longitud": req.descripcionInterna.longitud,
            ":des_sepa_riesg": req.descripcionInterna.separacionRiesgo,
            ":des_ent_colinda": req.entorno.colindantes,
            ":des_natural": req.entorno.naturaleza,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsEdificacion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + EDIFICACION_TABLE};
    }

    const paramsActividad = {
        TableName: ACTIVIDAD_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET des_actividad=:des_actividad" +
            ", des_personal=:des_personal",
        ExpressionAttributeValues: {
            ":des_actividad": req.actividadDesarrollada.descripcion,
            ":des_personal": req.actividadDesarrollada.personal,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsActividad).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + ACTIVIDAD_TABLE};
    }

    const paramsAlmacenes = {
        TableName: ALMACENAMIENTO_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET nom_almacen=:nom_almacen" +
            ", des_mercaderia=:des_mercaderia" +
            ", des_caracteristica=:des_caracteristica" +
            ", des_inventario=:des_inventario",
        ExpressionAttributeValues: {
            ":nom_almacen": req.almacenes.nombreAlmacen,
            ":des_mercaderia": req.almacenes.mercaderiaAlmacenada,
            ":des_caracteristica": req.almacenes.caracteristicasAlm,
            ":des_inventario": req.almacenes.inventarios,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsAlmacenes).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + ALMACENAMIENTO_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Key: {
                num_tramite: req.claveTramite,
            },
            UpdateExpression: "SET num_archivo=:num_archivo, cod_tip_archivo=:cod_tip_archivo, nom_archivo=:nom_archivo, ind_del=:ind_del",
            ExpressionAttributeValues: {
                ":num_archivo": arc.archivo.codArchivo,
                ":cod_tip_archivo": arc.archivo.tipoArchivo,
                ":nom_archivo": arc.archivo.nomArchivo,
                ":ind_del": arc.archivo.eliminado,
            },
        };

        try {
            await dynamoDbClient.update(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep7(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsIncendio = {
        TableName: INCENDIO_TABLE,
        Key: {
            num_tramite: req.claveTramite,
            num_incendio: req.incendio.codIncendio,
        },
        UpdateExpression: "SET des_proc_prop=:des_proc_prop" +
            ", des_briga_contr=:des_briga_contr" +
            ", des_distr_extin=:des_distr_extin" +
            ", cod_bomberos=:cod_bomberos" +
            ", des_detec_ince=:des_detec_ince" +
            ", des_sis_cont_ince_nfpa72=:des_sis_cont_ince_nfpa72" +
            ", des_sis_cont_ince_nfpa=:des_sis_cont_ince_nfpa",
        ExpressionAttributeValues: {
            ":des_proc_prop": req.medidasIncendio.procPropioPlanSeg,
            ":des_briga_contr": req.medidasIncendio.brigadaIncendio,
            ":des_distr_extin": req.medidasIncendio.distribucionExtintores,
            ":cod_bomberos": req.medidasIncendio.codBombero,
            ":des_detec_ince": req.deteccionIncendio.descripcion,
            ":des_sis_cont_ince_nfpa72": req.sistemaContraIndendioNFPA72.descripcion,
            ":des_sis_cont_ince_nfpa": req.sistemaContraIndendioNFPA.descripcion,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsIncendio).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INCENDIO_TABLE};
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep8(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsRamos = {
        TableName: RAMOS_TABLE,
        Key: {
            num_tramite: req.claveTramite,
            num_ramos: req.ramos.codRamos,
        },
        UpdateExpression: "SET des_maquina=:des_maquina" +
            ", des_agua_desague=:des_agua_desague" +
            ", des_electricidad=:des_electricidad" +
            ", des_aire_compri=:des_aire_compri" +
            ", des_calor_vapor=:des_calor_vapor" +
            ", des_combustible=:des_combustible" +
            ", des_pozo_tierra=:des_pozo_tierra" +
            ", des_sistema_frio=:des_sistema_frio" +
            ", des_otro_servic=:des_otro_servic" +
            ", des_plan_mant=:des_plan_mant" +
            ", des_repuestos=:des_repuestos",
        ExpressionAttributeValues: {
            ":des_maquina": req.ramos.detalleMaquina.descripcion,
            ":des_agua_desague": req.ramos.serviciosGenerales.aguaDesague,
            ":des_electricidad": req.ramos.serviciosGenerales.electricidad,
            ":des_aire_compri": req.ramos.serviciosGenerales.airecomprimido,
            ":des_calor_vapor": req.ramos.serviciosGenerales.calorVapor,
            ":des_combustible": req.ramos.serviciosGenerales.combustibles,
            ":des_pozo_tierra": req.ramos.serviciosGenerales.pozoTierra,
            ":des_sistema_frio": req.ramos.serviciosGenerales.sistemaFrio,
            ":des_otro_servic": req.ramos.serviciosGenerales.otrosServicios,
            ":des_plan_mant": req.ramos.gestionActivos.planMtto,
            ":des_repuestos": req.ramos.gestionActivos.repuestos,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsRamos).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + RAMOS_TABLE};
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep9(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    const paramsRobo = {
        TableName: ROBO_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET des_accesos=:des_accesos" +
            ", des_primero=:des_primero" +
            ", des_vig_guard=:des_vig_guard" +
            ", des_alar_instrus=:des_alar_instrus" +
            ", des_sist_cctv=:des_sist_cctv" +
            ", des_pol_valor=:des_pol_valor",
        ExpressionAttributeValues: {
            ":des_accesos": req.roboAsalto.accesoPrevio.accesos,
            ":des_primero": req.roboAsalto.accesoPrevio.perimetro,
            ":des_vig_guard": req.roboAsalto.proteccionContraRobo.vigilanciaGuardiania,
            ":des_alar_instrus": req.roboAsalto.proteccionContraRobo.alarmasIntrucion,
            ":des_sist_cctv": req.roboAsalto.proteccionContraRobo.sistemaCCTV,
            ":des_pol_valor": req.roboAsalto.politicaManejoValores.descripcion
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsRobo).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + ROBO_TABLE};
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep10(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const sin of req.listSiniestro) {
        const paramsSiniestro = {
            TableName: SINIESTRO_TABLE,
            Key: {
                num_tramite: req.claveTramite,
            },
            UpdateExpression: "SET num_siniestro=:num_siniestro" +
                ", fec_siniestro=:fec_siniestro" +
                ", des_siniestro=:des_siniestro" +
                ", des_tie_paral=:des_tie_paral" +
                ", ind_del=:ind_del",
            ExpressionAttributeValues: {
                ":num_siniestro": arc.siniestro.codSiniestro,
                ":fec_siniestro": arc.siniestro.fecha,
                ":des_siniestro": arc.siniestro.descripcion,
                ":des_tie_paral": arc.siniestro.tiempoParalizacion,
                ":ind_del": arc.siniestro.eliminado,
            },
        };

        try {
            await dynamoDbClient.update(paramsSiniestro).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + SINIESTRO_TABLE}
        }
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep11(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    for (const arc of req.listArchivo) {
        const paramsArchivo = {
            TableName: ARCHIVO_TABLE,
            Key: {
                num_tramite: req.claveTramite,
            },
            UpdateExpression: "SET num_archivo=:num_archivo, cod_tip_archivo=:cod_tip_archivo, nom_archivo=:nom_archivo, des_archivo=:des_archivo, ind_del=:ind_del",
            ExpressionAttributeValues: {
                ":num_archivo": arc.archivo.codArchivo,
                ":cod_tip_archivo": arc.archivo.tipoArchivo,
                ":nom_archivo": arc.archivo.nomArchivo,
                ":des_archivo": arc.archivo.comentario,
                ":ind_del": arc.archivo.eliminado,
            },
        };

        try {
            await dynamoDbClient.update(paramsArchivo).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ARCHIVO_TABLE}
        }
    }

    for (const enl of req.listEnlace) {
        const paramsEnlace = {
            TableName: ENLACE_TABLE,
            Key: {
                num_tramite: req.claveTramite,
            },
            UpdateExpression: "SET cod_enlace=:cod_enlace, des_enlace=:des_enlace, ind_del=:ind_del",
            ExpressionAttributeValues: {
                ":cod_enlace": arc.enlace.codEnlace,
                ":des_enlace": arc.enlace.nomEnlace,
                ":ind_del": arc.enlace.eliminado,
            },
        };

        try {
            await dynamoDbClient.update(paramsEnlace).promise();
        } catch (error) {
            console.log(error);
            return {result: false, data: 'Could not insert to ' + ENLACE_TABLE}
        }
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function actualizarStep12(req) {
    const paramsInspeccion = {
        TableName: INSPECCIONES_TABLE,
        Key: {
            num_tramite: req.claveTramite,
        },
        UpdateExpression: "SET cod_tipinforme=:cod_tipinforme" +
            ", correo_insp=:correo_insp" +
            ", fec_actualizacion=:fec_actualizacion" +
            ", des_garantia=:des_garantia" +
            ", cod_estado=:cod_estado",
        ExpressionAttributeValues: {
            ":cod_tipinforme": req.codTipoTramite,
            ":correo_insp": req.email,
            ":fec_actualizacion": req.fechaRegistro,
            ":des_garantia": req.propuestasGarantia,
            ":cod_estado": req.codEstadoTramite,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await dynamoDbClient.update(paramsInspeccion).promise();
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not insert to ' + INSPECCION_TABLE};
    }

    return {result: true, data: paramsInspeccion.Item};
}

async function obtenerStep4(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    const paramsArchivo = {
        TableName: ARCHIVO_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    try {
        const inspeccion = await dynamoDbClient.query(paramsInspeccion).promise();
        const archivo = await dynamoDbClient.query(paramsArchivo).promise();
        if (inspeccion.Items.length > 0) {
            return {result: true, data: {inspeccion: inspeccion.Items, archivo: archivo.Items}};
        } else {
            return {result: false, data: 'Could not find Inspeccion with provided "claveTramite"'};
        }
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not retreive ' + INSPECCION_TABLE};
    }
}

async function obtenerStep5(req) {
    const paramsInspeccion = {
        TableName: INSPECCION_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    const paramsEntrevistado = {
        TableName: ENTREVISTADO_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    const paramsMatriz = {
        TableName: MATRIZ_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    const paramsRiesgo = {
        TableName: RIESGO_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    const paramsPerdida = {
        TableName: PERDIDA_TABLE,
        KeyConditionExpression: "num_tramite = :num_tramite",
        ExpressionAttributeValues: {
            ":num_tramite": req.claveTramite,
        }
    };

    try {
        const inspeccion = await dynamoDbClient.query(paramsInspeccion).promise();
        const entrevistado = await dynamoDbClient.query(paramsEntrevistado).promise();
        const matriz = await dynamoDbClient.query(paramsMatriz).promise();
        const riesgo = await dynamoDbClient.query(paramsRiesgo).promise();
        const perdida = await dynamoDbClient.query(paramsPerdida).promise();
        if (inspeccion.Items.length > 0) {
            return {
                result: true, data: {
                    inspeccion: inspeccion.Items,
                    entrevistado: entrevistado.Items,
                    matriz: matriz.Items,
                    riesgo: riesgo.Items,
                    perdida: perdida.Items,
                }
            };
        } else {
            return {result: false, data: 'Could not find Inspeccion with provided "claveTramite"'};
        }
    } catch (error) {
        console.log(error);
        return {result: false, data: 'Could not retreive ' + INSPECCION_TABLE};
    }
}

module.exports = {
    guardarStep4,
    guardarStep5,
    guardarStep6,
    guardarStep7,
    guardarStep8,
    guardarStep9,
    guardarStep10,
    guardarStep11,
    guardarStep12,
    actualizarStep4,
    actualizarStep5,
    actualizarStep6,
    actualizarStep7,
    actualizarStep8,
    actualizarStep9,
    actualizarStep10,
    actualizarStep11,
    actualizarStep12,
    obtenerStep4,
}