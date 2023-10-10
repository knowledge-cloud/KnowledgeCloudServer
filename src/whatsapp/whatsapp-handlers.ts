import { CognitionEngineHandler } from "../cognition-engine-handler";
import { CognitionEngineSuccessResponse, KnowledgeBaseIndex } from "../cognition-engine-handler/cognition-engine-handler-types";
import { whatsappChatSessionDAO } from "../data-models-and-daos/whatsapp-chat-session/whatsapp-chat-session-dao";
import { WhatsAppChatMessage, WhatsAppChatMessageSender } from "../data-models-and-daos/whatsapp-chat-session/whatsapp-chat-session-model";
import { whatsappUserDAO } from "../data-models-and-daos/whatsapp-user/whatsapp-user-dao";
import { ErrorObject } from "../knowledge-cloud-api-lambda/handler-types";
import { WhatsAppWebhookMessage, WhatsAppWebhookStatus } from "../knowledge-cloud-api-lambda/handlers/whatsapp-webhook/whatsapp-webhook-types";
import { WhatsApp } from "./whatsapp";

export class WhatsAppMessageHandler extends WhatsApp {
    public async handleMessageRequest(request: WhatsAppWebhookMessage): Promise<void> {
        console.log(`Received message from ${JSON.stringify(request, undefined, 2)}`);
        const phoneNumber = request.from;
        const message = request.text.body;
        const messageId = request.id;
        let userModel = await whatsappUserDAO.getUser(phoneNumber, true);
        let session = await whatsappChatSessionDAO.createNewActiveSession(phoneNumber,);

        let userMessage: WhatsAppChatMessage = new WhatsAppChatMessage({
            message,
            messageId,
            sentAt: new Date(parseInt(request.timestamp)),
            sender: WhatsAppChatMessageSender.USER
        });
        userMessage.sentAt = new Date(parseInt(request.timestamp));

        session.addMessage(userMessage);
        session = await whatsappChatSessionDAO.save(session);
        
        
        const cognitionEngineResponse = await CognitionEngineHandler.retrieval({
            knowledgeBaseIndex: KnowledgeBaseIndex.UPSC,
            query: message
        })

        let userResponse = "";
        if (cognitionEngineResponse instanceof ErrorObject) {
            console.error(`Error from Cognition Engine Lambda: ${JSON.stringify(cognitionEngineResponse, undefined, 2)}`);
            userResponse = "Sorry, Our servers are down. Please try again later."
        } else {
            userResponse = cognitionEngineResponse.answer;
        }

        const whatsappResponse = await this.sendReplyTextMessage(phoneNumber, userResponse, messageId);
        if (whatsappResponse instanceof ErrorObject) {
            console.log(`Error sending message to ${phoneNumber}`);
            console.log(JSON.stringify(whatsappResponse, undefined, 2));
            return;
        }

        let botMessage: WhatsAppChatMessage = new WhatsAppChatMessage({
            message: userResponse,
            messageId: whatsappResponse.messageId,
            sentAt: new Date(),
            sender: WhatsAppChatMessageSender.BOT
        });
        botMessage.sentAt = new Date();
        
        session.addMessage(botMessage);
        await whatsappChatSessionDAO.save(session);
        return;
    }

    public async handleStatusRequest(request: WhatsAppWebhookStatus): Promise<void> {
        console.log(`Received status from ${JSON.stringify(request, undefined, 2)}`);

    }
}

export const whatsAppMessageHandler = new WhatsAppMessageHandler();