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
                contacts: {
                    profile: {
                        name: string;
                    },
                    wa_id: string;
                }[],
                messages: {
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
                }[]
            },
            field: string;
        }[]
    }[]
}