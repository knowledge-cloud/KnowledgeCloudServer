import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export interface InvocationResponse {
    statusCode: number,
    payload: any,
}

class LambdaInvocationHandler {
    private lambdaClient: LambdaClient = new LambdaClient();
    
    async invoke(functionName: string, payload: string): Promise<InvocationResponse> {

        const command = new InvokeCommand({
            FunctionName: functionName,
            InvocationType: "RequestResponse",
            Payload: payload,
        });

        const response = await this.lambdaClient.send(command);
        return {
            statusCode: response.StatusCode!,
            payload: JSON.parse(Buffer.from(response.Payload!).toString())
        }
    }
}

export const lambdaInvocationHandler = new LambdaInvocationHandler();
