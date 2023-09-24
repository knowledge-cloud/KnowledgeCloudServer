#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { KnowledgeCloudServerStack } from '../lib/knowledge-cloud-server-stack';
import { Env, getEnvVariables } from './env-constants';

const app = new cdk.App();
let env = app.node.tryGetContext('env') as Env
export const ENV_CONSTANTS = getEnvVariables(env);

new KnowledgeCloudServerStack(app, 'KnowledgeCloudServerStack', {
  stage: ENV_CONSTANTS.stage,
  whatsAppVerifyTokenSecretArn: ENV_CONSTANTS.whatsAppVerifyTokenSecretArn
});