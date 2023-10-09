import { attribute, hashKey, table } from "@nova-odm/annotations";
import { BaseModel } from "../base-model-and-dao/base-model";

export const WHATSAPP_USER_TABLE = "WhatAppUsers";

@table(WHATSAPP_USER_TABLE)
export class WhatsAppUserModel extends BaseModel{
    @hashKey({
        type: "String"
    })
    phoneNumber: string;

    @attribute()
    name?: string;

    @attribute()
    sessionsConsumed: number;
}