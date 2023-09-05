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
            }
        default:
            logEnv(env);
            throw new Error("Invalid environment");
    }
}


export interface EnvConstants {
    stage: string;
}

export function logEnv(env: string) {
    console.table({
        "ENVIROMENT": "GAMMA",
        "commnad": "cdk deploy  --context env=GAMMA"
    });
}