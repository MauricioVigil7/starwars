const https = require('https');

const TOKEN_VALIDATE_API_HOST = process.env.TOKEN_VALIDATE_API_HOST;
const TOKEN_VALIDATE_API_PATH = process.env.TOKEN_VALIDATE_API_PATH;

module.exports.validateToken = accessToken => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({accessToken});

        const options = {
            hostname: TOKEN_VALIDATE_API_HOST,
            path: TOKEN_VALIDATE_API_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};