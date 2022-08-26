const Paso1Dao = require("../dao/Paso1Dao");
const Paso2Dao = require("../dao/Paso2Dao");
const Paso3Dao = require("../dao/Paso3Dao");
const Paso45Dao = require("../dao/Paso4-5Dao");
const Paso4Dao = require("../dao/Paso4Dao");
const Paso5Dao = require("../dao/Paso5Dao");


async function paso1Ins(params) {
    //console.log('**** paso1Ins service 1****');
    const paso = await Paso1Dao.paso1Ins(params);
    //console.log('**** paso1Ins service 2****');
    return paso;  
}

async function paso1Upd(params) {
    const paso4 = await Paso1Dao.paso1Upd(params);
    return paso4;  
}

async function paso1Get(numtramite,email) {
    //console.log('**** paso1Get service email ********',email);
    const paso4 = await Paso1Dao.paso1Get(numtramite,email);
    return paso4;  
}

async function paso2Ins(params) {
    //console.log('**** paso2Ins service 1****');
    const paso = await Paso2Dao.paso2Ins(params);
    //console.log('**** paso2Ins service 2****');
    return paso;  
}

async function paso2Upd(params) {
    const paso = await Paso2Dao.paso2Upd(params);
    return paso;  
}

async function paso2Get(numtramite,email) {
    //console.info("get Paso2: numtramite " , numtramite); 
    //    console.info("get Paso2: email " , email); 
    const paso = await Paso2Dao.paso2Get(numtramite,email);
    return paso;  
}

async function paso3Ins(params) {
    //console.log('**** paso3Ins service 1****');
    const paso = await Paso3Dao.paso3Ins(params);
    //console.log('**** paso3Ins service 2****');
    return paso;  
}

async function paso3Upd(params) {
    const paso = await Paso3Dao.paso3Upd(params);
    return paso;  
}

async function paso3Get(numtramite,email) {
    const paso = await Paso3Dao.paso3Get(numtramite,email);
    return paso;  
}

async function paso4Ins (data) {
    console.info(" paso4Ins: " , data);
    const paso = await Paso4Dao.paso4Ins(data);
    console.info(" paso4Ins paso: " , paso);
    return paso;  

}

async function paso4Upd (data) {
    console.info(" paso4Upd: " , data);
    const paso = await Paso4Dao.paso4Upd(data);
    console.info(" paso4Upd paso: " , paso);
    return paso;  
}

async function paso4Get (numtramite,email) {
    try {
        //obtener los registros de la tabla maestra
        let paso = await Paso4Dao.paso4Get(numtramite,email)
        //console.log(JSON.stringify(paso))
        return paso;
    } catch (e) {
        console.error("Error getPaso4: " + e)
        return {result: false,errores:{}};
    }
} 

async function paso5Ins (data) {
    //data.codSiniestro=context.awsRequestId;
    let paso = await Paso5Dao.paso5Ins(data)
    return paso;
}


async function paso5Upd (data) {
    let paso = await Paso5Dao.paso5Upd(data)
    return paso;
}

async function paso5Get (numtramite,email) {
    let paso = await Paso5Dao.paso5Get(numtramite,email)
    return paso;
}

module.exports = {
     
   paso1Get,paso1Ins,paso1Upd,   
   paso2Get,paso2Ins,paso2Upd,
   paso3Get,paso3Ins,paso3Upd,
   paso4Get,paso4Ins,paso4Upd,
   paso5Get,paso5Upd,paso5Ins
   
}