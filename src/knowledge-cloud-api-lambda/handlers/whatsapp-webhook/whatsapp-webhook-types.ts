export interface WhatsAppWebhookVerificationRequest {
    hubMode: string;
    hubChallenge: string;
    hubVerifyToken: string;
}


export interface WhatsAppWebhookRequest {
    object: string;
    entry: {
        id: string;
        changes: {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                },
                contacts?: {
                    profile: {
                        name: string;
                    },
                    wa_id: string;
                }[],
                messages?: WhatsAppWebhookMessage[],
                statuses?: WhatsAppWebhookStatus[]
            },
            field: string;
        }[]
    }[]
}

export interface WhatsAppWebhookMessage {
    context?: {
        from: string;
        id: string;
    },
    from: string;
    id: string;
    timestamp: string;
    text: {
        body: string;
    },
    type: string;
}

export interface WhatsAppWebhookStatus {
    id: string;
    status: string;
    timestamp: string;
    recipient_id: string;
    conversation: {
        id: string;
        expiration_timestamp: string;
        origin: {
            type: string;
        }
    },
    pricing: {
        billable: boolean;
        pricing_model: string;
        category: string;
    }
}