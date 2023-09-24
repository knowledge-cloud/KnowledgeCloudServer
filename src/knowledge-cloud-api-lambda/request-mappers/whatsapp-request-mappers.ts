import { APIGatewayProxyEvent } from "aws-lambda"
import { RequestMapper } from "../types"
import { WhatsAppWebhookRequest, WhatsAppWebhookVerificationRequest } from "../handlers/whatsapp-webhook/whatsapp-webhook-types"


export class WhatsAppWebhookVerificationMapper implements RequestMapper<WhatsAppWebhookVerificationRequest>{
    requestMapper = (event: APIGatewayProxyEvent): WhatsAppWebhookVerificationRequest => {
        const hubMode = event.queryStringParameters!["hub.mode"]!;
        const hubChallenge = event.queryStringParameters!["hub.challenge"]!;
        const hubVerifyToken = event.queryStringParameters!["hub.verify_token"]!;
        return {
            hubChallenge,
            hubMode,
            hubVerifyToken,
        }
    }
}

export class WhatsAppWebhookMessageMapper implements RequestMapper<WhatsAppWebhookRequest>{
    requestMapper = (event: APIGatewayProxyEvent): WhatsAppWebhookRequest => {
        return {
            ...JSON.parse(event.body!)
        }
    }
}