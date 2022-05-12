// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import * as AWS from "aws-sdk";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"

// Create an Amazon DynamoDB service client object.
const ddb = new AWS.DynamoDB();
const ddbClient = new AWS.DynamoDB.DocumentClient({ region: REGION });

//-----------------CREATE TABLE--------------------------------

const params = {
  AttributeDefinitions: [
    {
      AttributeName: "User", //ATTRIBUTE_NAME_1
      AttributeType: "S", //ATTRIBUTE_TYPE
    },
    {
      AttributeName: "Properties", //ATTRIBUTE_NAME_2
      AttributeType: "S", //ATTRIBUTE_TYPE
    },
  ],
  KeySchema: [
    {
      AttributeName: "User", //ATTRIBUTE_NAME_1
      KeyType: "HASH",
    },
    {
      AttributeName: "Properties", //ATTRIBUTE_NAME_2
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: "Gallery", //TABLE_NAME
  StreamSpecification: {
    StreamEnabled: false,
  },
};

const run = async () => {
  try {
    const data = await ddb.createTable(params).promise();
    console.log("Table Created");

    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

run();

//---------------------WRITE ITEM---------------------------------


// Create a service client module using ES6 syntax.
// const marshallOptions = {
//   // Whether to automatically convert empty strings, blobs, and sets to `null`.
//   convertEmptyValues: false, // false, by default.
//   // Whether to remove undefined values while marshalling.
//   removeUndefinedValues: false, // false, by default.
//   // Whether to convert typeof object to map attribute.
//   convertClassInstanceToMap: false, // false, by default.
// };

// const unmarshallOptions = {
//   // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
//   wrapNumbers: false, // false, by default.
// };

// const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB document client.

const putItem = async () => {
  // Set the parameters.
  const params = {
    TableName: "Gallery",
    Item: {
      User: "user@gmail.com",
      Properties: "PROFILE#user@gmail.com",
      Password: '***secret***',
      Salt: 'user_salt',
    },
  };

  try {
    const data = await ddbClient.put(params, (err) => {
      if (err) {
        console.log(err.message);
      }
    }).promise();

    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
};

putItem();

//--------------------------READ ITEM-------------------------------------

const readItem = async () => {
  const params = {
    TableName: 'Gallery',
    Key: {
      'User': 'user@gmail.com'
    },
  }

  try {
    const data = await ddbClient.get(params, (err) => {
      if (err) {
        console.log(err.message);
      }
    }).promise();

    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
}

// возвращает 

// {
//   Items: [{},{},...],
//   'Count': number,
//   'ScannedCount': number,
// }









