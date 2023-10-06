import { attribute, hashKey, table } from "@nova-odm/annotations";
import { BaseModel } from "../base-model-and-dao/base-model";

@table("WhatAppUsers")
export class WhatsAppUserModel extends BaseModel{
    @hashKey({
        type: "String"
    })
    phoneNumber: string;

    @attribute()
    name: string;

    @attribute()
    sessionsConsumed: number;
}