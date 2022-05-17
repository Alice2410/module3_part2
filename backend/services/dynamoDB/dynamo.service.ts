import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommandInput, GetCommand, PutCommandInput, PutCommand, QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getEnv } from 'backend/helper/environment';

const region = getEnv('REGION', true);

export class DynamoDBService {
  private readonly ddbDocClient: DynamoDBDocumentClient;
  
  constructor() {
    const options = {
      marshallOptions: {
        convertEmptyValues: true, 
        removeUndefinedValues: true, 
        convertClassInstanceToMap: true, 
      },
    } 

    const ddbClient = new DynamoDBClient({ region: region });
    this.ddbDocClient = DynamoDBDocumentClient.from(ddbClient, options);
  }

  async getItem(partitionKey: string, sortKey: string, tableName: string){
    console.log('in getItem');
    console.log('pk: ', partitionKey, 'sk: ', sortKey, 'tn: ', tableName);
    
    
    const params: GetCommandInput = {
      TableName: tableName,
      Key: {
        partitionKey: partitionKey,
        sortKey: sortKey,
      },
    };

    try {
      const item = await this.ddbDocClient.send(new GetCommand(params));
      console.log('item: ', item);

      return item;
    } catch(err) {
      console.log(err);
    }
    // const item = await this.ddbDocClient.send(new GetCommand(params));
    // console.log('item: ', item);
    

    
  }

  async putItem(partitionKey: string, sortKey: string, tableName: string, attributes: object){
    const params: PutCommandInput = {
      TableName: tableName,
      Item: {
        partitionKey,
        sortKey,
        ...attributes
      },
    };

    const result = await this.ddbDocClient.send(new PutCommand(params));

    console.log('putItem result: ', result);
    

    return result;
  }

  async query(tableName: string, attributeValues: object, keyCondition: string, filter: string){
    const params: QueryCommandInput = {
      TableName: tableName,
      ExpressionAttributeValues: attributeValues,
      KeyConditionExpression: keyCondition,
      FilterExpression: filter,
    }

    const items = await this.ddbDocClient.send(new QueryCommand(params));

    return items;
  }  
}