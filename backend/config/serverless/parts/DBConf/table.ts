import { AWSPartitial } from '../../types';

export const galleryTableConfig: AWSPartitial = {
  provider: {
    environment: {
      USERS_TABLE_NAME: '${self:custom.tablesNames.UsersTable.${self:provider.stage}}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
              'dynamodb:UpdateItem',
              'dynamodb:BatchGetItem',
              'dynamodb:BatchWriteItem',
            ],
            Resource: [
              'arn:aws:dynamodb:*:*:table/${self:custom.tablesNames.UsersTable.${self:provider.stage}}',
              'arn:aws:dynamodb:*:*:table/${self:custom.tablesNames.UsersTable.${self:provider.stage}}/index/*',
            ],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'partitionKey',
              AttributeType: 'S',
            },
            {
              AttributeName: 'sortKey',
              AttributeType: 'S',
            },
            {
              AttributeName: 'resType',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'partitionKey',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'sortKey',
              KeyType: 'RANGE',
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'ImagesIndex',
              KeySchema: [
                {
                  AttributeName: 'resType',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'partitionKey',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: '${self:custom.tablesNames.UsersTable.${self:provider.stage}}',
          StreamSpecification: {
            StreamViewType: 'NEW_AND_OLD_IMAGES',
          },
        },
      },
    },
  },
  custom: {
    tablesNames: {
      UsersTable: {
        local: 'Alice-Users-local',
        dev: 'Alice-Users-dev',
        test: 'Alice-Users-test',
        prod: 'Alice-Users',
      },
    },
  },
};