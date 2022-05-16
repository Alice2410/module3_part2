import type { AWS } from '@serverless/typescript';
import { galleryConfig } from './config/serverless/parts/galleryConf/gallery'; 
import { authConfig } from './config/serverless/parts/authConf/auth';
import { joinParts } from './config/serverless/utils';
import { galleryTableConfig } from './config/serverless/parts/DBConf/table';


const CLIENT = '${file(./env.yml):${self:provider.stage}.CLIENT}';
const SERVICE_NAME = `Alice-template-sls`;
const STAGE = '${opt:stage, "dev"}'; 
const REGION = '${file(./env.yml):${self:provider.stage}.REGION}';
const PROFILE = '${file(./env.yml):${self:provider.stage}.PROFILE}';

const masterConfig: AWS = {
  service: SERVICE_NAME,
  configValidationMode: 'warn',
  variablesResolutionMode: '20210326',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: STAGE,
    lambdaHashingVersion: '20201221',
    // @ts-ignore
    region: REGION,
    profile: PROFILE,
    environment: {
      STAGE,
    },
    tags: {
      client: CLIENT,
    },
    logs: {
      httpApi: true,
    },
    httpApi: {
      useProviderTags: true,
      payload: '2.0',
      cors: true,
    },
  },
  package: {
    individually: true,
    patterns: ['bin/*', '.env'],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      metafile: false,
      // If you want to debug the output than turn this on.
      // In other cases keep it off because serverless-esbuild
      // dont update extra files if they already exists in .esbuild folder.
      // Extra files are files that you define in package.patterns settings.
      keepOutputDirectory: false,
      packager: 'npm',
      inject: ['loadenv.ts'],
      plugins: 'esbuild-plugins.js',
      watch: {
        pattern: ['api/**/*.ts', 'helper/**/*.ts', 'interfaces/**/*.ts', 'models/**/*.ts', 'services/**/*.ts'],
      },
    },
    prune: {
      automatic: true,
      number: 3,
    },
    envFiles: ['env.yml'],
    envEncryptionKeyId: {
      local: '${file(./kms_key.yml):local}',
      dev: '${file(./kms_key.yml):dev}', 
      // test: '${file(./kms_key.yml):test}',
      // prod: '${file(./kms_key.yml):prod}',
    },
    'serverless-offline': {
      ignoreJWTSignature: true,
    },
    // s3: {
    //   host: '0.0.0.0',
    //   port: 8001,
    //   directory: '/tmp',
    // },
    // capacities: [
    //   {
    //     table: 'UsersTable',
    //     read: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //     write: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //   },
    //   {
    //     table: 'JobsTable',
    //     index: ['ProducerIdGlobalIndex', 'CrewIdGlobalIndex'],
    //     read: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //     write: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //   },
    // ],
    // 'serverless-offline-sns': {
    //   port: 4002,
    //   debug: false,
    // },
    // 'serverless-offline-sqs': {
    //   autoCreate: true,
    //   apiVersion: '2012-11-05',
    //   endpoint: 'http://0.0.0.0:9324',
    //   region: '${file(./env.yml):${self:provider.stage}.REGION}',
    //   accessKeyId: 'root',
    //   secretAccessKey: 'root',
    //   skipCacheInvalidation: false,
    // },
  },
  plugins: [
    '@redtea/serverless-env-generator',
    'serverless-esbuild',
    'serverless-offline',
    'serverless-prune-plugin',
  ],
};

module.exports = joinParts(masterConfig, [
  authConfig,
  galleryConfig,
  galleryTableConfig
]);
