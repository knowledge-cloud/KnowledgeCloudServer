export enum WhatsAppTemplate {
    "HELLO_WORLD" = "hello_world",
}

export interface WhatsAppTextMessageAPIRequest {
    messaging_product: string;
    to: string;
    type: "text" | "template";
    recipient_type?: string; // mandatory for custom text messages
    text?: {
        preview_url: boolean;
        body: string;
    },
    template?: {
        name: string;
        language: {
            code: string;
        }
    }
}

export interface WhatsAppTextMessageAPIResponse {
    messaging_product: string;
    contacts: {
        input: string;
        wa_id: string;
    }[];
    messages: {
        id: string;
    }[];
}

export interface WhatAppTextMessageResponse {
    messageId: string;
}

export interface WhatsAppTemplateMessageAPIRequest {
    messaging_product: string;
    to: string;
    type: string;
    template: {
        name: string;
        language: {
            code: string;
        }
    }
}
