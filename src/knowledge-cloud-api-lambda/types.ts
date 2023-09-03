import { Handler } from "./handler-types"
import { RequestMapper } from "./request-mapper"
import { APIGatewayProxyEvent } from "aws-lambda";


export interface RequestMapper<TRequest> {
    requestMapper: (event: APIGatewayProxyEvent) => TRequest;
}

export type APIMap = {
    handler: Handler<any, any>,
    requestMapper: RequestMapper<any>,
    options: APIOptions
}

export type APIHandlerMap = {
    [key: string]: APIMap
}

declare const APIGatewayAuthZTypes: {
    ALLOW_UNAUTHENTICATED: string, // No authentication required, you can authorize the request in the lambda if you want
    ALLOW_AUTHENTICATED_CLIENTS: string, // Basically all registered clients
    ALLOW_SPECIFIC_CLIENTS: string // Need to pass allowedClients(client_ids) in options
    ALLOW_ADMIN: string // TODO: Only admins can access this (Not implemented yet)
}

export type APIGatewayAuthZType = keyof typeof APIGatewayAuthZTypes

export type APIOptions = {
    authType: APIGatewayAuthZType,
    allowedClients?: string[]
}