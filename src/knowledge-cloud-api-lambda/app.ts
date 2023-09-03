import { registerAPIHandlers } from "./api-registry";
import { Handler } from "./handler-types";
import { APIHandlerMap, APIMap, APIOptions, RequestMapper } from "./types";

class App {
    APIS: {
        GET: APIHandlerMap,
        POST: APIHandlerMap,
        PUT: APIHandlerMap,
        DELETE: APIHandlerMap
    } = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
    get(path: string, requestMapper: RequestMapper<any>, handler: Handler<any, any>, options: APIOptions = { authType: "ALLOW_AUTHENTICATED_CLIENTS"}) {
        this.APIS.GET[path] = { handler, requestMapper, options };
    }

    post(path: string, requestMapper: RequestMapper<any>, handler: Handler<any, any>, options: APIOptions = { authType: "ALLOW_AUTHENTICATED_CLIENTS"}) {
        this.APIS.POST[path] = { handler, requestMapper, options };
    }
    put(path: string, requestMapper: RequestMapper<any>, handler: Handler<any, any>, options: APIOptions = { authType: "ALLOW_AUTHENTICATED_CLIENTS"}) {
        this.APIS.PUT[path] = { handler, requestMapper, options };
    }
    delete(path: string, requestMapper: RequestMapper<any>, handler: Handler<any, any>, options: APIOptions = { authType: "ALLOW_AUTHENTICATED_CLIENTS"}) {
        this.APIS.DELETE[path] = { handler, requestMapper, options };
    }

    getHandler(method: string, path: string): undefined | APIMap {
        switch (method.toUpperCase()) {
            case "GET":
                return this.APIS.GET[path];
            case "POST":
                return this.APIS.POST[path];
            case "PUT":
                return this.APIS.PUT[path];
            case "DELETE":
                return this.APIS.DELETE[path];
            default:
                return undefined;
        }
    }
}

export const app = new App();

registerAPIHandlers();