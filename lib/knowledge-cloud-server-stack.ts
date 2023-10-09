import { Duration, Stack } from 'aws-cdk-lib';
import { Architecture, CfnPermission, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { AppRegistryResource, KnowledgeCloudServerStackProps } from './props-types';
import { app } from '../src/knowledge-cloud-api-lambda/app';
import { IResource, LambdaIntegration, LambdaIntegrationOptions, Method, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';


class LambdaIntegrationNoPermission extends LambdaIntegration {
  constructor(handler: IFunction, options?: LambdaIntegrationOptions) {
    super(handler, options);
  }

  bind(method: Method) {
    const integrationConfig = super.bind(method);
    const permissions = method.node.children.filter(c => c instanceof CfnPermission);
    permissions.forEach(permission => method.node.tryRemoveChild(permission.node.id));
    return integrationConfig;
  }
}

export class KnowledgeCloudServerStack extends Stack {
  constructor(scope: Construct, id: string, props: KnowledgeCloudServerStackProps) {
    super(scope, id, props);
    const kcApiFunction = new NodejsFunction(this, "KnowledgeCloudAPILambda", {
      memorySize: 1024,
      functionName: "KnowledgeCloudAPILambda",
      timeout: Duration.seconds(300),
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      handler: "apiHandler",
      entry: join(__dirname, '../src/knowledge-cloud-api-lambda/index.ts'),
      bundling: {
        externalModules: ["aws-sdk"]
      },
      environment: {
        example: "example"
      },
      awsSdkConnectionReuse: true,
    })

    // add secrest manager permission
    kcApiFunction.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["secretsmanager:GetSecretValue"],
      resources: [props.whatsAppVerifyTokenSecretArn, props.whatsAppAuthTokenSecretArn]
    }))
    // add all dynamodb permission
    kcApiFunction.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:*"],
      resources: [
        props.whatsAppUserTableArn,
        `${props.whatsAppUserTableArn}/*`,
         props.whatsAppChatSessionTableArn,
        `${props.whatsAppChatSessionTableArn}/*`
      ]
    }))

    //Cognition Engine lambda invoke permission
    kcApiFunction.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["lambda:InvokeFunction"],
      resources: [props.cognitionEngineLambdaArn]
    }))


    const appRegistry = this.getAppRegistry()

    const api = new RestApi(this, 'KnowledgeCloudApi', {
      deployOptions: {
        stageName: props.stage,
      },
      defaultIntegration: new LambdaIntegrationNoPermission(kcApiFunction)
    });
    const apiRootResource = api.root;
    this.addChildResources(apiRootResource, appRegistry)
    kcApiFunction.addPermission("API Gateway Permission", {
      principal: new ServicePrincipal("apigateway.amazonaws.com"),
      sourceArn: api.arnForExecuteApi()
    })
  }
  
  addChildResources(resource: IResource, appRegistryResource: AppRegistryResource) {
    console.log(`********** ${resource.path}`)
    let methodOptions: MethodOptions = {}
    appRegistryResource.methods.forEach(methodResource => {
      resource.addMethod(methodResource.method, undefined, methodOptions)
    })

    Object.entries(appRegistryResource.childResources).forEach(([path, childAppRegistryResource]) => {
      const res = resource.addResource(path)
      this.addChildResources(res, childAppRegistryResource)
    })
  }

  getAppRegistry(): AppRegistryResource {
    let apiResource: AppRegistryResource = {
      childResources: {},
      methods: []
    }
    Object.entries(app.APIS).forEach(([method, handlerMap]) => {
      Object.entries(handlerMap).forEach(([path, _handler]) => {
        let pathTree = path.split("/").filter(e => e)
        var resource = apiResource.childResources
        for (let i = 0; i < pathTree.length; i++) {
          let path = pathTree[i]
          if (resource[path]) {
            if (i == (pathTree.length - 1)) {
              resource[pathTree[i]].methods!.push({ method, options: _handler.options })
            }
          } else {
            resource[path] = {
              childResources: {},
              methods: []
            }
            if (i == (pathTree.length - 1)) {
              resource[path].methods.push({ method, options: _handler.options })
            }
          }
          resource = resource[path].childResources
        }
      })
    })

    return apiResource
  }
}
