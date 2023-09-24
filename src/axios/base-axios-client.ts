import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ErrorObject } from "../knowledge-cloud-api-lambda/handler-types";

export abstract class BaseAxiosClient {
    client: AxiosInstance;
    clientName: string;
    constructor(baseUrl: string, clientName: string) {
        this.client = axios.create({
            baseURL: baseUrl,
        } as CreateAxiosDefaults);
        this.clientName = clientName;
    }

    // Set the authentication header for the client here
    abstract setClientAuthentication(): Promise<void>;
    // Example: this.client.defaults.headers.common["Authorization"] = /* <-Token-> */

    async get<CResponse /*Custom Response*/>(path: string, params: { [key: string]: any }): Promise<CResponse | ErrorObject> {
        let requestTimeLogger = `${this.clientName} Request time logger method:GET path: ${path} `
        let startTime = Date.now()
        await this.setClientAuthentication();
        try {
            const response = await this.client.get<CResponse>(path, { params } as AxiosRequestConfig);
            this.logSuccessRequest(this.clientName, "GET", path, response.status, params);
            console.log(requestTimeLogger, (Date.now() - startTime))
            return response.data;
        } catch (error) {
            console.log(requestTimeLogger, (Date.now() - startTime))
            return this.handleError(error);
        }
    }

    async post<CResponse /*Custom Response*/>(path: string, body: { [key: string]: any }): Promise<CResponse | ErrorObject> {
        let requestTimeLogger = `${this.clientName} Request time logger method:POST path: ${path} `
        let startTime = Date.now()
        await this.setClientAuthentication();
        try {
            const response = await this.client.post<CResponse>(path, body);
            this.logSuccessRequest(this.clientName, "POST", path, response.status, body);
            console.log(requestTimeLogger, (Date.now() - startTime))
            return response.data;
        } catch (error) {
            console.log(error);
            console.log(requestTimeLogger, (Date.now() - startTime))
            return this.handleError(error);
        }
    }

    async put<CResponse /*Custom Response*/>(path: string, body: { [key: string]: any }): Promise<CResponse | ErrorObject> {
        let requestTimeLogger = `${this.clientName} Request time logger method:PUT path: ${path} `
        let startTime = Date.now()
        await this.setClientAuthentication();
        try {
            const response = await this.client.put<CResponse>(path, body);
            this.logSuccessRequest(this.clientName, "PUT", path, response.status, body);
            console.log(requestTimeLogger, (Date.now() - startTime))
            return response.data;
        } catch (error) {
            console.log(requestTimeLogger, (Date.now() - startTime))
            return this.handleError(error);
        }

    }

    async delete(path: string): Promise<{ success: boolean } | ErrorObject> {
        let requestTimeLogger = `${this.clientName} Request time logger method:DELETE path: ${path} `
        let startTime = Date.now()
        await this.setClientAuthentication();
        try {
            await this.client.delete(path);
            this.logSuccessRequest(this.clientName, "DELETE", path, 200);
            console.log(requestTimeLogger, (Date.now() - startTime))
            return { success: true };
        } catch (error) {
            console.log(requestTimeLogger, (Date.now() - startTime))
            return this.handleError(error);
        }
    }

    private logSuccessRequest(clientName: string, method: string, path: string, responseStatus: number, params?: any) {
        let logData: { [key: string]: any } = { clientName, method, path, responseStatus };
        if (params) {
            if (method === "GET") {
                logData.queryParams = params;
            } else {
                logData.body = params;
            }
        }
        console.log(`Client API Log: ${JSON.stringify(logData, undefined, 2)}`);
    }

    private handleError(error: any): ErrorObject {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`${JSON.stringify({
                "clientName": this.clientName,
                "error.response.data": error.response.data,
                "error.response.status": error.response.status,
                "error.response.headers": error.response.headers
            }, undefined, 2)}`);

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error(`${JSON.stringify({
                "clientName": this.clientName,
                "error.request": error.request
            }, undefined, 2)}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error(`${JSON.stringify({
                "clientName": this.clientName,
                "error.message": error.message
            }, undefined, 2)}`);
        }
        console.log(error.config);
        return new ErrorObject(500, `Error in ${this.clientName} API client, for more details check the logs`);
    }
}