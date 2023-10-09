enum envOptions {
    GAMMA = "GAMMA"
}
export declare type Env = keyof typeof envOptions;

export function getEnvVariables(env: Env) : EnvConstants {

    switch (env) {
        case envOptions.GAMMA as Env:
            logEnv(env);
            return {
                stage: "gamma",
                whatsAppVerifyTokenSecretArn: "arn:aws:secretsmanager:ap-south-1:869693743363:secret:whatsapp-verify-token-CoVgEl",
                whatsAppAuthTokenSecretArn: "arn:aws:secretsmanager:ap-south-1:869693743363:secret:whatsapp-auth-token-P0Z6K5",
                cognitionEngineLambdaArn: "arn:aws:lambda:ap-south-1:869693743363:function:CognitionEngineLambda"
            }
        default:
            logEnv(env);
            throw new Error("Invalid environment");
    }
}


export interface EnvConstants {
    stage: string;
    whatsAppVerifyTokenSecretArn: string;
    whatsAppAuthTokenSecretArn: string;
    cognitionEngineLambdaArn: string;
}

export function logEnv(env: string) {
    console.table({
        "ENVIROMENT": "GAMMA",
        "commnad": "cdk deploy <command>  --context env=GAMMA"
    });
}