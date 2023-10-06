import { attribute } from "@nova-odm/annotations";


export class BaseModel {
    @attribute({
        type: "Date",
        defaultProvider: () => new Date()
    })
    createdAt?: Date;

    @attribute({
        type: "Date",
        defaultProvider: () => new Date()
    })
    modifiedAt?: Date;
}