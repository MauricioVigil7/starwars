const Paso4Dao = require("../dao/Paso4Dao");
const Paso5Dao = require("../dao/Paso5Dao");
const Paso6Dao = require("../dao/Paso6Dao");
const Paso7Dao = require("../dao/Paso7Dao");
const Paso8Dao = require("../dao/Paso8Dao");
const Paso9Dao = require("../dao/Paso9Dao");
const Paso10Dao = require("../dao/Paso10Dao");
const Paso11Dao = require("../dao/Paso11Dao");
const Paso12Dao = require("../dao/Paso12Dao");

async function paso4Ins(params) {
    //console.log('**** paso4Ins service 1****');
    const paso = await Paso4Dao.paso4Ins(params);
    //console.log('**** paso4Ins service 2****');
    return paso;  
}

async function paso4upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso4 = await Paso4Dao.paso4Upd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso4;  
}

async function paso4Get(numtramite,email) {
    //console.log('**** paso4Get service 4****');
    const paso4 = await Paso4Dao.paso4Get(numtramite,email);
    //console.log('**** paso4Get service 4****');
    return paso4;  
}

async function paso5Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso5Dao.paso5Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}

async function paso5Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso = await Paso5Dao.paso5Upd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso;  
}

async function paso5Get(numtramite,email) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso = await Paso5Dao.paso5Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}


async function paso6Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
  
    const paso = await Paso6Dao.paso6Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}
async function paso6Upd(params) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso6Dao.paso6Upd(params);
    ////console.log('**** checkListEmpresarial service 2****');
    return paso;  
}
async function paso6Get(numtramite,email) {
    ////console.log('**** checkListEmpresarial service 6****');
    const paso = await Paso6Dao.paso6Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}


async function paso7Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso7Dao.paso7Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}
async function paso7Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso = await Paso7Dao.paso7Upd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}
async function paso7Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 6****');
    const paso = await Paso7Dao.paso7Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}


async function paso8Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso8Dao.paso8Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}
async function paso8Upd(params) {
    //console.log('**** checkListEmpresarial service 1****'); 
    const paso = await Paso8Dao.paso8Upd(params);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}
async function paso8Get(numtramite,email,codTipoTramite) {
    //console.log('**** checkListEmpresarial service 6****');
    const paso = await Paso8Dao.paso8Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}

async function paso9Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso9Dao.paso9Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}

async function paso9Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso = await Paso9Dao.paso9Upd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso;  
}

async function paso9Get(numtramite,email) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso = await Paso9Dao.paso9Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}

async function paso10Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso10Dao.paso10Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}

async function paso10Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso = await Paso10Dao.paso10Upd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso;  
}

async function paso10Get(numtramite,email) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso = await Paso10Dao.paso10Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}

async function paso11Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso11Dao.paso11Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}

async function paso11Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso = await Paso11Dao.paso11Upd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso;  
}

async function paso11Get(numtramite,email) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso = await Paso11Dao.paso11Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}

async function paso12Ins(params,context) {
    //console.log('**** checkListEmpresarial service 1****');
    const paso = await Paso12Dao.paso12Ins(params,context);
    //console.log('**** checkListEmpresarial service 2****');
    return paso;  
}

async function paso12Upd(params) {
    //console.log('**** checkListEmpresarial service 3****');
    const paso = await Paso12Dao.paso12Upd(params);
    //console.log('**** checkListEmpresarial service 4****');
    return paso;  
}

async function paso12Get(numtramite,email) {
    //console.log('**** checkListEmpresarial service 5****');
    const paso = await Paso12Dao.paso12Get(numtramite,email);
    //console.log('**** checkListEmpresarial service 6****');
    return paso;  
}


module.exports = {
    
    paso12Get,paso12Upd,paso12Ins,
    paso11Get,paso11Upd,paso11Ins,
    paso10Ins, paso10Upd, paso10Get,
    paso9Upd,paso9Get,paso9Ins,
   paso8Upd,paso8Get,paso8Ins,
   paso7Get,paso7Upd,
   paso6Upd,paso6Get,paso4Get, 
   paso4Ins,paso4upd,paso5Get,
   paso5Upd,paso5Ins,
   paso6Ins,paso7Ins
}