import { BaseAxiosClient } from "./base-axios-client";

class WhatsAppAxiosClient extends BaseAxiosClient {
    async setClientAuthentication(): Promise<void> {
        this.client.defaults.headers.common['Authorization'] = `Bearer <TOKEN>`;
    }
}

export const whatsappAxiosClient = new WhatsAppAxiosClient("https://graph.facebook.com/v17.0/122175597651517", "WhatsApp");