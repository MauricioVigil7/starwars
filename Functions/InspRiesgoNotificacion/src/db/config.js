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

module.exports = dynamoDbClient;