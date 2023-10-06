#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { KnowledgeCloudServerStack } from '../lib/knowledge-cloud-server-stack';
import { Env, getEnvVariables } from './env-constants';
import { WhatsAppStack } from '../lib/whatsapp-stack';

const app = new cdk.App();
let env = app.node.tryGetContext('env') as Env
export const ENV_CONSTANTS = getEnvVariables(env);

const whatsAppStack = new WhatsAppStack(app, 'WhatsAppStack', {});

new KnowledgeCloudServerStack(app, 'KnowledgeCloudServerStack', {
  stage: ENV_CONSTANTS.stage,
  whatsAppVerifyTokenSecretArn: ENV_CONSTANTS.whatsAppVerifyTokenSecretArn,
  whatsAppUserTableArn: whatsAppStack.whatsAppUserTable.tableArn,
  whatsAppChatSessionTableArn: whatsAppStack.whatsAppChatSessionTable.tableArn,
});