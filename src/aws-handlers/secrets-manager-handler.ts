import { SecretsManager } from "@aws-sdk/client-secrets-manager";

class SecretsManagerHandler {
    client = new SecretsManager();
    
    async getSecretValue(secretID: string){
        const secretValueString = await this.client.getSecretValue({ SecretId: secretID });
        const secretValue = JSON.parse(secretValueString.SecretString!);
        return secretValue;
    }

}

export const secretsManagerHandler = new SecretsManagerHandler();