import { Context } from "aws-lambda";
import { AWSError } from "aws-sdk/lib/error";

export class ErrorObject {
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode
        this.message = message
        console.error(`ErrorObject: ${JSON.stringify(this, undefined, 2)}`)
    }

    static getErrorObjectFromError(error: unknown): ErrorObject {
        console.error("Returning becuase of an error", error)
        if (error instanceof Error) {
            let awsError = error as AWSError;
            if (awsError.statusCode) {
                return new ErrorObject(awsError.statusCode!, error.message)
            } else {
                return new ErrorObject(500, error.message)
            }
        }
        return new ErrorObject(500, "Internal server error.")
    }
}

export interface AuthorizerContext {
    clientId: string
    userId: string
}

export type Handler<TRequest, TResponse> = (event: TRequest, authorizerContext: AuthorizerContext, context: Context) => Promise<TResponse | ErrorObject>
export interface LambdaHandler<TRequest, TResponse> {
    handler: Handler<TRequest, TResponse | ErrorObject>;
}

export interface GenericBooleanResponse {
    success: boolean;
}


