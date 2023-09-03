import { APIGatewayProxyEvent } from "aws-lambda"
import { RequestMapper } from "../types"
import { ExampleRequest } from "../handlers/example/example-types"


export class ExampleMapper implements RequestMapper<ExampleRequest>{
    requestMapper = (event: APIGatewayProxyEvent) => {
        const body = JSON.parse(event.body!)
        return {
            ...body
        }
    }
}