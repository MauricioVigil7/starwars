const AWS = require('aws-sdk');


const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

async function initInspecciones() {
    const INSPECCIONES_TABLE = process.env.INSPECCIONES_TABLE;

    const params = {
        AttributeDefinitions: [
            {
                AttributeName: 'num_tramite',
                AttributeType: 'S'
            },
            {
                AttributeName: 'cod_inspector',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'num_tramite',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'cod_inspector',
                KeyType: 'RANGE'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        },
        TableName: INSPECCIONES_TABLE,
        StreamSpecification: {
            StreamEnabled: false
        }
    };

    ddb.createTable(params, function(err, data) {
        if (err) {
            if (err.code === "ResourceInUseException" && err.message === "Cannot create preexisting table") {
            } else {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            }

        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

module.exports = {
    initInspecciones,
}