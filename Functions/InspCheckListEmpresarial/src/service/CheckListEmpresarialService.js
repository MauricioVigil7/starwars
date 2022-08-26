const checkListEmpresarialPaso4Dao = require("../dao/CheckListEmpresarialPaso4Dao");
const checkListEmpresarialPaso5Dao = require("../dao/CheckListEmpresarialPaso5Dao");
const checkListEmpresarialPaso6Dao = require("../dao/CheckListEmpresarialPaso6Dao");
const checkListEmpresarialPaso7Dao = require("../dao/CheckListEmpresarialPaso7Dao");
const checkListEmpresarialPaso8Dao = require("../dao/CheckListEmpresarialPaso8Dao");
const checkListEmpresarialPaso9Dao = require("../dao/CheckListEmpresarialPaso9Dao");
const checkListEmpresarialPaso10Dao = require("../dao/CheckListEmpresarialPaso10Dao");
const checkListEmpresarialPaso11Dao = require("../dao/CheckListEmpresarialPaso11Dao");
const checkListEmpresarialPaso12Dao = require("../dao/CheckListEmpresarialPaso12Dao");
const checkListEmpresarialPaso13Dao = require("../dao/CheckListEmpresarialPaso13Dao");

async function paso4Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
  
    const paso4 = await checkListEmpresarialPaso4Dao.paso4DatosNivelRiesgo(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso4;  
}

async function paso4Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso4 = await checkListEmpresarialPaso4Dao.paso4DatosNivelRiesgoUpd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso4;  
}

async function paso4Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso4 = await checkListEmpresarialPaso4Dao.paso4DatosNivelRiesgoGet(numtramite,email,codTipoTramite);
    //console.log('**** checkListEmpresarial service 6****');
    return paso4;  
}

async function paso5Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso5 = await checkListEmpresarialPaso5Dao.paso5InformacionGeneral(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso5;  
}

async function paso5Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso5 = await checkListEmpresarialPaso5Dao.paso5InformacionGeneralUpd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso5;  
}

async function paso5Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso5 = await checkListEmpresarialPaso5Dao.paso5InformacionGeneralGet(numtramite,email,codTipoTramite);
    //console.log('**** checkListEmpresarial service 5 fin ****',paso5);
    return paso5;  
}


async function paso6Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
  
    const paso6 = await checkListEmpresarialPaso6Dao.paso6Edificacion(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso6;  
}
async function paso6Upd(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso6 = await checkListEmpresarialPaso6Dao.paso6EdificacionUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso6;  
}
async function paso6Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 6****');
    const paso6 = await checkListEmpresarialPaso6Dao.paso6ListaGet(numtramite,email,codTipoTramite);
    //console.log('**** checkListEmpresarial service 6****');
    return paso6;  
}


async function paso7Ins(params) {
   // console.log('**** checkListEmpresarial service 1****');
  
    const paso7 = await checkListEmpresarialPaso7Dao.paso7ActividadDesarrollada(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso7;  
}
async function paso7Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso7 = await checkListEmpresarialPaso7Dao.paso7ActividadDesarrolladaUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso7;  
}
async function paso7Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 6****');
    const paso7 = await checkListEmpresarialPaso7Dao.paso7ActividadDesarrolladaGet(numtramite,email,codTipoTramite);
    //console.log('**** checkListEmpresarial service 6****');
    return paso7;  
}


async function paso8Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
  
    const paso8 = await checkListEmpresarialPaso8Dao.paso8Almacenamiento(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso8;  
}
async function paso8Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso8 = await checkListEmpresarialPaso8Dao.paso8AlmacenamientoUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso8;  
}
async function paso8Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 6****');
    const paso8 = await checkListEmpresarialPaso8Dao.paso8AlmacenamientoGet(numtramite,email,codTipoTramite);
    //console.log('**** checkListEmpresarial service 6****');
    return paso8;  
}

async function paso9Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso9 = await checkListEmpresarialPaso9Dao.paso9Incendio(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso9;  
}
async function paso9Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    //console.log('**** checkListEmpresarial :',params);
    const paso9 = await checkListEmpresarialPaso9Dao.paso9IncendioUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso9;  
}
async function paso9Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 6****');
    const paso9 = await checkListEmpresarialPaso9Dao.paso9IncendioGet(numtramite,email,codTipoTramite);
    //console.log('**** checkListEmpresarial service 6****');
    return paso9;  
}

async function paso10Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso10 = await checkListEmpresarialPaso10Dao.paso10RamosTecnicos(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso10;  
}
async function paso10Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso10 = await checkListEmpresarialPaso10Dao.paso10RamosTecnicosUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso10;  
}
async function paso10Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 service************');
    const paso10 = await checkListEmpresarialPaso10Dao.paso10RamosTecnicosGet(numtramite,email,codTipoTramite);
    return paso10;  
}

async function paso11Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso11 = await checkListEmpresarialPaso11Dao.paso11Robo(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso11;  
}
async function paso11Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso11 = await checkListEmpresarialPaso11Dao.paso11RoboUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso11;  
}
async function paso11Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 service************');
    const paso11 = await checkListEmpresarialPaso11Dao.paso11RoboGet(numtramite,email,codTipoTramite);
    return paso11;  
}

async function paso12Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso12 = await checkListEmpresarialPaso12Dao.paso12Siniestro(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso12;  
}
async function paso12Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso12 = await checkListEmpresarialPaso12Dao.paso12SiniestroUpd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso12;  
}
async function paso12Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 service************');
    const paso12 = await checkListEmpresarialPaso12Dao.paso12SiniestroGet(numtramite,email,codTipoTramite);
    return paso12;  
}   

async function paso13Ins(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso12 = await checkListEmpresarialPaso13Dao.paso13EnlaceArchivo(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso12;  
}
async function paso13Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso12 = await checkListEmpresarialPaso13Dao.paso13Upd(params);
    //console.log('**** checkListEmpresarial service 2****');
    //console.log('*******paso13************',paso12);
    return paso12;  
}
async function paso13Get(numtramite,email,codTipoTramite) {
    //console.log('*******paso10RamosTecnicosGet 1 service************');
    const paso12 = await checkListEmpresarialPaso13Dao.paso13EnlaceArchivoGet(numtramite,email,codTipoTramite);
    return paso12;  
}   

module.exports = {
    paso13Upd,paso13Get,paso13Ins,
    paso12Get,paso12Upd,paso12Ins,
    paso11Get,paso11Upd,paso11Ins,
    paso10Ins, paso10Upd, paso10Get,
    paso9Upd,paso9Get,paso9Ins,
   paso8Upd,paso8Get,paso8Ins,
   paso7Get,paso7Upd,
   paso6Upd,paso6Get,paso4Get, 
   paso4Ins,paso4Upd,paso5Get,
   paso5Upd,paso5Ins,
   paso6Ins,paso7Ins
}