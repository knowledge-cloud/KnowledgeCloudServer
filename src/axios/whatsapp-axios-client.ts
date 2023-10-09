import { secretsManagerHandler } from "../aws-handlers/secrets-manager-handler";
import { BaseAxiosClient } from "./base-axios-client";

class WhatsAppAxiosClient extends BaseAxiosClient {
    async setClientAuthentication(): Promise<void> {
        this.client.defaults.headers.common['Authorization'] = await this.getTokenFromSecretsManager();
    }

    private async getTokenFromSecretsManager(): Promise<string> {
        console.log("Getting auth token from secrets manager");
        let secret = await secretsManagerHandler.getSecretValue("whatsapp-auth-token");
        console.log("Got auth token from secrets manager");
        return `Bearer ${secret.auth_token}`;
    }
}

export const whatsappAxiosClient = new WhatsAppAxiosClient("https://graph.facebook.com/v17.0/122175597651517", "WhatsApp");