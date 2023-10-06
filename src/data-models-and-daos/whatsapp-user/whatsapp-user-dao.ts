import { BaseDAO } from "../base-model-and-dao/base-dao";
import { WhatsAppUserModel } from "./whatsapp-user-model";

class WhatsAppUserDAO extends BaseDAO<WhatsAppUserModel> {
    async createWhatsAppUser(phoneNumber: string, name?: string): Promise<WhatsAppUserModel> {
        let whatsappUser = new WhatsAppUserModel();
        console.log("phoneNumber", phoneNumber, "name", name);
        whatsappUser.phoneNumber = phoneNumber;
        if (name) {
            whatsappUser.name = name;
        }
        console.log(`Creating whatsapp user ${JSON.stringify(whatsappUser, undefined, 2)}`)
        return await this.save(whatsappUser);
    }
    async getWhatsAppUser(phoneNumber: string): Promise<WhatsAppUserModel> {
        let whatsappUser = new WhatsAppUserModel();
        whatsappUser.phoneNumber = phoneNumber;
        return await this.get(whatsappUser);
    }
}

export const whatsappUserDAO = new WhatsAppUserDAO();