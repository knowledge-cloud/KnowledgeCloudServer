import { app } from "./app";
import { whatsAppWebhook } from "./handlers/whatsapp-webhook/whatsapp-webhook";
import { WhatsAppWebhookMessageMapper, WhatsAppWebhookVerificationMapper } from "./request-mappers";

export function registerAPIHandlers() {

    /**
        * - Example of a handler which allows guest access
        *       app.<method>("<path>", <mapper>, <handler>,  { authType: "ALLOW_UNAUTHENTICATED" })
    
        * - Example of a handler which allows only specific clients
        *       app.<method>("<path>", <mapper>, <handler>,  { authType: "ALLOW_SPECIFIC_CLIENTS", allowedClients: [CLIENT_ID] })
    */

    // whatsapp webhook
    app.get("/whatsapp/webhook", new WhatsAppWebhookVerificationMapper(), whatsAppWebhook.verifyWebhook, { stringifyResponse: false })
    app.post("/whatsapp/webhook", new WhatsAppWebhookMessageMapper(), whatsAppWebhook.handleMessageRequest)
}