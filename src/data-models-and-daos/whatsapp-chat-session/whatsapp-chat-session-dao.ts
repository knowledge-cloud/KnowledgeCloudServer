import { BaseDAO, mapper } from "../base-model-and-dao/base-dao";
import { PHONE_NUMBER_STATUS_INDEX, WhatsAppChatMessage, WhatsAppChatSessionModel, WhatsAppChatSessionStatus } from "./whatsapp-chat-session-model";


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
    async createSession(phoneNumber: string, status: WhatsAppChatSessionStatus): Promise<WhatsAppChatSessionModel> {
        console.log(`Creating session for phone number ${phoneNumber} with status ${status}`);
        const whatsappChatSession = new WhatsAppChatSessionModel();
        whatsappChatSession.phoneNumber = phoneNumber;
        whatsappChatSession.chatSessionStatus = status;
        return await this.save(whatsappChatSession);
    }

    async createActiveSession(phoneNumber: string): Promise<WhatsAppChatSessionModel> {
        try {
            const res = await this.getActiveSession(phoneNumber);
            return res;
        } catch (error) {
            console.log(`No active session found for phone number ${phoneNumber}, creating a new session`);
            return await this.createSession(phoneNumber, WhatsAppChatSessionStatus.ACTIVE);
        }
    }

    async createNewActiveSession(phoneNumber: string): Promise<WhatsAppChatSessionModel> {
        const whatsappChatSession = await this.getActiveSession(phoneNumber);
        console.log(`Found active session for phone number ${phoneNumber}, checking if it has any messages`);
        if (whatsappChatSession.chatHistory.messages.length > 0) {
            await this.deactivateSession(whatsappChatSession.sessionId);
            return await this.createSession(phoneNumber, WhatsAppChatSessionStatus.ACTIVE);
        }
        return whatsappChatSession;
    }

    async deactivateSession(sessionId: string): Promise<WhatsAppChatSessionModel> {
        console.log(`Deactivating session ${sessionId}`);
        const whatsappChatSession = new WhatsAppChatSessionModel();
        whatsappChatSession.sessionId = sessionId;
        whatsappChatSession.markSessionInactive();
        return await this.update(whatsappChatSession);
    }

}

export const whatsappChatSessionDAO = new WhatsAppChatSessionDAO();