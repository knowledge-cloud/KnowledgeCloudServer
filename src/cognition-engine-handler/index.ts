import { InvocationResponse, lambdaInvocationHandler } from "../aws-handlers/lambda-invocation-handler";
import { ErrorObject } from "../knowledge-cloud-api-lambda/handler-types";
import { CognitionEngineEventType, CognitionEngineRequest, CognitionEngineResponse, CognitionEngineRetrievalRequest, CognitionEngineSuccessResponse } from "./cognition-engine-handler-types";

export class CognitionEngineHandler {
    static async retrieval(request: CognitionEngineRetrievalRequest): Promise<CognitionEngineSuccessResponse | ErrorObject> {
        const payload: CognitionEngineRequest = {
            eventType: CognitionEngineEventType.RETRIEVAL,
            data: request
        }
        console.log(`Sending payload to Cognition Engine Lambda: ${JSON.stringify(payload, undefined, 2)}`);
        let res = await lambdaInvocationHandler.invoke("CognitionEngineLambda", JSON.stringify(payload));
        console.log(`Received response from Cognition Engine Lambda: ${JSON.stringify(res, undefined, 2)}`);
        if (res.statusCode !== 200) {
            return new ErrorObject(res.statusCode, res.payload as string);
        }
        let responsePayload = res.payload as CognitionEngineResponse;
        if (responsePayload.statusCode !== 200) {
            return new ErrorObject(responsePayload.statusCode, responsePayload.body as string);
        }
        return responsePayload.body as CognitionEngineSuccessResponse;
    }
}