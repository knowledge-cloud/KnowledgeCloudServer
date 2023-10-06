import { BaseDAO, mapper } from "../base-model-and-dao/base-dao";
import { PHONE_NUMBER_STATUS_INDEX, WhatsAppChatSessionModel, WhatsAppChatSessionStatus } from "./whatsapp-chat-session-model";


class WhatsAppChatSessionDAO extends BaseDAO<WhatsAppChatSessionModel> {
    async getSession(sessionId: string): Promise<WhatsAppChatSessionModel> {
        let whatsappChatSession = new WhatsAppChatSessionModel();
        whatsappChatSession.sessionId = sessionId;
        return await this.get(whatsappChatSession);
    }

    async getActiveSession(phoneNumber: string): Promise<WhatsAppChatSessionModel> {

        // query for active session
        for await (const whatsappChatSession of mapper.query(WhatsAppChatSessionModel, {
            phoneNumber,
            chatSessionStatus: WhatsAppChatSessionStatus.ACTIVE
        }, {indexName: PHONE_NUMBER_STATUS_INDEX})) {
            return whatsappChatSession;
        }
        throw new Error(`No active session found for phone number ${phoneNumber}, to create a new session set createIfNotExists to true`);
    }

}

export const whatsappChatSessionDAO = new WhatsAppChatSessionDAO();