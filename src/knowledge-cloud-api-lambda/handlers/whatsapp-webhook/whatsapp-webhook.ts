import { secretsManagerHandler } from "../../../aws-handlers/secrets-manager-handler";
import { WhatsApp } from "../../../whatsapp/whatsapp";
import { ErrorObject } from "../../handler-types";
import { WhatsAppWebhookRequest, WhatsAppWebhookVerificationRequest } from "./whatsapp-webhook-types";

class WhatsAppWebhook {
    async verifyWebhook(request: WhatsAppWebhookVerificationRequest): Promise< string| ErrorObject> {
        if (request.hubMode && request.hubVerifyToken) {
            const verifyToken = (await secretsManagerHandler.getSecretValue("whatsapp-verify-token"))["verify-token"];
            if (request.hubMode === "subscribe" && request.hubVerifyToken === verifyToken) {
                console.log("WEBHOOK_VERIFIED");
                return request.hubChallenge
            } else {
                return new ErrorObject(403, "hub_mode or hub_verify_token is incorrect")
            }
        }
        return new ErrorObject(400, "hub_mode or hub_verify_token is missing");
    }


    async handleMessageRequest(request: WhatsAppWebhookRequest): Promise<void> {
        console.log(`Received message from ${JSON.stringify(request, undefined, 2)}`);
    }
}

export const whatsAppWebhook = new WhatsAppWebhook();