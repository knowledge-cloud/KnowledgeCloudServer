import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { PHONE_NUMBER_STATUS_INDEX } from "../src/data-models-and-daos/whatsapp-chat-session/whatsapp-chat-session-model";

export class WhatsAppStack extends Stack {
    whatsAppUserTable: Table;
    whatsAppChatSessionTable: Table;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.whatsAppUserTable = new Table(this, "WhatsAppUserTable", {
            tableName: "WhatAppUsers",
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "phoneNumber",
                type: AttributeType.STRING
            }
        });

        this.whatsAppChatSessionTable = new Table(this, "WhatsAppChatSessionTable", {
            tableName: "WhatsAppChatMessage",
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "sessionId",
                type: AttributeType.STRING
            }
        });

        this.whatsAppChatSessionTable.addGlobalSecondaryIndex({
            indexName: PHONE_NUMBER_STATUS_INDEX,
            partitionKey: {
                name: "phoneNumber",
                type: AttributeType.STRING
            },
            sortKey: {
                name: "chatSessionStatus",
                type: AttributeType.STRING
            }
        })
    }
}