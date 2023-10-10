import { StackProps } from "aws-cdk-lib"
import { APIOptions } from "../src/knowledge-cloud-api-lambda/types"

export interface AppRegistryResource {
    childResources: {
      [path: string]: AppRegistryResource
    },
    methods: {
      method: string,
      options: APIOptions
    }[]
  }

  export interface KnowledgeCloudServerStackProps extends StackProps {
    stage: string
    whatsAppVerifyTokenSecretArn: string
    whatsAppAuthTokenSecretArn: string
    whatsAppUserTableArn: string
    whatsAppChatSessionTableArn: string
    cognitionEngineLambdaArn: string
  }