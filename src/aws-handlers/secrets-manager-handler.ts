import { SecretsManager } from 'aws-sdk';

class SecretsManagerHandler {
    client = new SecretsManager();
    
    async getSecretValue(secretID: string){
        const secretValueString = await this.client.getSecretValue({ SecretId: secretID }).promise();
        const secretValue = JSON.parse(secretValueString.SecretString!);
        return secretValue;
    }

}

export const secretsManagerHandler = new SecretsManagerHandler();