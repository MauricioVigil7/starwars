const Buffer = require('buffer').Buffer;

function base64decode(data, text=false) {
    if(text){
        return Buffer.from(data, 'base64').toString('ascii');
    }
    return Buffer.from(data, 'base64');
}

function base64encode(data) {
    return Buffer.from(data).toString('base64');
}

module.exports = {
    base64decode,
    base64encode
}