import { whatsappAxiosClient } from "../axios/whatsapp-axios-client";
import { ErrorObject } from "../knowledge-cloud-api-lambda/handler-types";
import {WhatAppTextMessageResponse, WhatsAppTemplate, WhatsAppTemplateMessageAPIRequest, WhatsAppTextMessageAPIRequest, WhatsAppTextMessageAPIResponse } from "./whatsapp-types";

export class WhatsApp {
    public static async sendTemplateMessage(template: WhatsAppTemplate, phoneNumber: string): Promise<WhatAppTextMessageResponse | ErrorObject> {
        const body: WhatsAppTextMessageAPIRequest = {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "template",
            template: {
                name: template,
                language: {
                    code: "en_US",
                }
            }
        }
        const res = await whatsappAxiosClient.post<WhatsAppTextMessageAPIResponse>("/messages", body);
        if (res instanceof ErrorObject) {
            return res;
        } else {
            return {
                messageId: res.messages[0].id,
            }
        }
    }

    public static async sendTextMessage(message: string, phoneNumber: string): Promise<WhatAppTextMessageResponse | ErrorObject> {
        const body: WhatsAppTextMessageAPIRequest = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: phoneNumber,
            type: "text",
            text: {
                preview_url: false,
                body: message,
            }
        }
        const res = await whatsappAxiosClient.post<WhatsAppTextMessageAPIResponse>("/messages", body)
        if (res instanceof ErrorObject) {
            return res;
        } else {
            return {
                messageId: res.messages[0].id,
            }
        }
    }
}