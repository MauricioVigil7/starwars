const AWS = require("aws-sdk");

const dynamoDbClientParams = {};

const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

module.exports = dynamoDbClient;