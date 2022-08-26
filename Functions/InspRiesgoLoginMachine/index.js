const AWS = require("aws-sdk");
const DB = new AWS.DynamoDB.DocumentClient();

const getQuery = (email) => {
  let params = {
    TableName: "Inspeccion",
    KeyConditionExpression: "#correo_insp = :correo_insp",
    ExpressionAttributeNames: {
      "#correo_insp": "correo_insp",
    },
    ExpressionAttributeValues: {
      ":correo_insp": email,
    },
  };

  return DB.query(params).promise();
};

exports.handler = async function (event, context) {
  console.log(`event: ${JSON.stringify(event)}`);
  let email = event.email;

  try {
    let result = await getQuery(email);
    console.log(`Result: ${JSON.stringify(result)}`)
    let count = 0;
    let query = {};
    result.Items.forEach((element) => {
      count = count + 1;
    });
    query.Count = count;
    query.Items = result.Items;
    return query;
  } catch (error) {
    throw new Error(error);
  }
};
