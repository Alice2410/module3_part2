import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommandInput, GetCommand, PutCommandInput, PutCommand, QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { HttpInternalServerError } from "@floteam/errors";
import { getEnv } from '../../helper/environment';

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

  async query(tableName: string, attributeValues: object, keyCondition: string){
    const params: QueryCommandInput = {
      TableName: tableName,
      ExpressionAttributeValues: attributeValues,
      KeyConditionExpression: keyCondition,
    }

    const items = await this.ddbDocClient.send(new QueryCommand(params));
    console.log('query items: ', items);
    

    return items;
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
    console.log('putItem params: ', params);
    
    try {
      let putCommand = new PutCommand(params);
      console.log('put: ', putCommand);
      
      // this.ddbDocClient.send(putCommand);
      
      return this.ddbDocClient.send(putCommand);
    } catch(err) {
      console.log('putItem error: ', err);
      throw new HttpInternalServerError(err.message)
    }
  }

    
}