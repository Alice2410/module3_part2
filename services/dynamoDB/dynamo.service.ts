import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommandInput, GetCommand, PutCommandInput, PutCommand, QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getEnv } from '@helper/environment';

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

  async getItem(primaryKey: string, sortKey: string, tableName: string){
    const params: GetCommandInput = {
      TableName: tableName,
      Key: {
        primaryKey,
        sortKey,
      },
    };

    const item = await this.ddbDocClient.send(new GetCommand(params));

    return item;
  }

  async putItem(primaryKey: string, sortKey: string, tableName: string, attributes: object){
    const params: PutCommandInput = {
      TableName: tableName,
      Item: {
        primaryKey,
        sortKey,
        ...attributes
      },
    };

    const result = await this.ddbDocClient.send(new PutCommand(params));

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