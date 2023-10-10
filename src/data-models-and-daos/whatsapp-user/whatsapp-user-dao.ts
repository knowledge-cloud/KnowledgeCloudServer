import { BaseDAO } from "../base-model-and-dao/base-dao";
import { whatsappChatSessionDAO } from "../whatsapp-chat-session/whatsapp-chat-session-dao";
import { WhatsAppUserModel } from "./whatsapp-user-model";

class WhatsAppUserDAO extends BaseDAO<WhatsAppUserModel> {
    async createUser(phoneNumber: string, name?: string): Promise<WhatsAppUserModel> {
        let whatsappUser = new WhatsAppUserModel();
        console.log("phoneNumber", phoneNumber, "name", name);
        whatsappUser.phoneNumber = phoneNumber;
        whatsappUser.name = name;
        const whatsappUserModel =  await this.save(whatsappUser);
        console.log(`Created whatsapp user ${JSON.stringify(whatsappUserModel, undefined, 2)}`)

        await whatsappChatSessionDAO.createActiveSession(phoneNumber);
        return whatsappUserModel;
    }
    async getUser(phoneNumber: string, createIfNotExists: boolean = false): Promise<WhatsAppUserModel> {
        let whatsappUser = new WhatsAppUserModel();
        whatsappUser.phoneNumber = phoneNumber;
        try {
            console.log("Getting whatsapp user", JSON.stringify(whatsappUser, undefined, 2));
            return await this.get(whatsappUser);
        } catch (error) {
            if (createIfNotExists) {
                console.log("Creating whatsapp user", JSON.stringify(whatsappUser, undefined, 2));
                return await this.createUser(phoneNumber);
            }
            throw error;
        }
    }
}

export const whatsappUserDAO = new WhatsAppUserDAO();