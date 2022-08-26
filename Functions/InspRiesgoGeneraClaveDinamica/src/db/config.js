const AWS = require("aws-sdk");

const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
    AWS.config.update({
        region: "us-east-1",
        endpoint: "http://localhost:8000"
    });
    dynamoDbClientParams.region = 'localhost'
    dynamoDbClientParams.endpoint = 'http://localhost:8000'
}

const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

//const AWSpass = require("aws-sdk");
const region = "us-east-1";
const endpoint = "https://secretsmanager.us-east-1.amazonaws.com";
const caracteres="!&*^#@(')$%+-,.:;<=>^[]_{|}?~" + '"`' + "/" ;


module.exports = dynamoDbClient;