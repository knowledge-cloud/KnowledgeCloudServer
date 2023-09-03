import { app } from "./app";
import { exampleAPI } from "./handlers/example/example";
import { ExampleMapper } from "./request-mappers";

export function registerAPIHandlers() {

    /**
        * - Example of a handler which allows guest access
        *       app.<method>("<path>", <mapper>, <handler>,  { authType: "ALLOW_UNAUTHENTICATED" })
    
        * - Example of a handler which allows only specific clients
        *       app.<method>("<path>", <mapper>, <handler>,  { authType: "ALLOW_SPECIFIC_CLIENTS", allowedClients: [SPA_CLIENT_ID] })
    */

    // example of a api
    app.post("/example", new ExampleMapper(), exampleAPI.createExample)
}