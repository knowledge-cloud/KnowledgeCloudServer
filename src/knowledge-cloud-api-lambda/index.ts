import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { app } from './app';
import { AuthorizerContext, ErrorObject } from './handler-types';
import { APIOptions } from './types';

export const apiHandler: APIGatewayProxyHandler = async (event, context) => {
    let apiHandler = app.getHandler(event.httpMethod, event.resource);
    console.log("API Gateway event = ", JSON.stringify(event, undefined, 2))
    if (apiHandler) {
        try {
            let startTime = Date.now()
            let authResult = await authorizeRequest(event, apiHandler.options)
            console.log(`authorize time for request ${event.resource}= ${Date.now() - startTime}`)
            if (authResult instanceof ErrorObject) {
                return {
                    statusCode: authResult.statusCode,
                    body: JSON.stringify({ message: authResult.message })
                }
            }
            let authorizerContext = authResult as AuthorizerContext
            let request = apiHandler.requestMapper.requestMapper(event);
            startTime = Date.now()
            let result = await apiHandler.handler(request, authorizerContext, context);
            console.log(`handler time for request ${event.resource}= ${Date.now() - startTime}`)
            if (result instanceof ErrorObject) {
                return {
                    statusCode: result.statusCode,
                    body: JSON.stringify({ message: result.message })
                }
            }
            return {
                statusCode: 200,
                body: result
            }

        } catch (error) {
            console.error("The api has an error", error)
            return handleError(error);
        }
    }
    return {
        statusCode: 404,
        body: `There is no handler registered for this ${event.resource}.`
    }
}

async function authorizeRequest(event: APIGatewayProxyEvent, options: APIOptions): Promise<AuthorizerContext | ErrorObject> {
    let userId;
    let clientId;

    if (event.requestContext.authorizer!) {
        userId = event.requestContext.authorizer!.claims.sub
        clientId = event.requestContext.authorizer!.claims.client_id
    }

    let authorizerContext: AuthorizerContext = {
        clientId: clientId,
        userId: userId,
    }

    return authorizerContext;
}

function handleError(error: unknown | Error): APIGatewayProxyResult {
    if (error instanceof Error) {
        return {
            statusCode: 500,
            body: "Internal Server Error."
        }
    }
    return {
        statusCode: 404,
        body: "Not found"
    }
}
