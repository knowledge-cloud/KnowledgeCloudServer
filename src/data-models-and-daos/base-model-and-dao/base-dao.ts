import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { ZeroArgumentsConstructor } from "@aws/dynamodb-data-marshaller";
import { BaseModel } from "./base-model";
import { DataMapper, ParallelScanOptions, ParallelScanWorkerOptions, ReadConsistency, ScanOptions } from "@nova-odm/mapper";

export const client = new DynamoDB({});
export const mapper = new DataMapper({ client });

export class BaseDAO<T extends BaseModel>{

    async parallelBatchPut(inputItems: T[], batchSize: number = 1000, maxConcurrentSegments: number = 20): Promise<T[]> {
        let startTime = Date.now()
        let items: T[] = []
        items = items.concat(inputItems)
        items = items.map(item => {
            item.modifiedAt = new Date()
            return item
        })
        let maxSegments: T[][][] = []
        let putItems: T[] = []
        while (items.length > 0) {
            let batch = items.splice(0, batchSize * maxConcurrentSegments)
            let segment: T[][] = []
            while (batch.length > 0) {
                segment.push(batch.splice(0, batchSize))
            }
            maxSegments.push(segment)
        }
        for (const segment of maxSegments) {
            let startTime = Date.now()
            let promises: Promise<T[]>[] = []
            console.log(`batch length = ${segment.length}`)
            for (const batch of segment) {
                promises.push(this.batchPut(batch))
            }
            let result = await Promise.all(promises)
            console.log("segment complete")
            result.forEach((res) => {
                putItems = putItems.concat(res)
            })
            console.log(`time for segment put ${Date.now() - startTime}`)
        }
        console.log(`total time for complete parallel put ${Date.now() - startTime}`)
        return putItems
    }

    async parallelBatchDelete(inputItems: T[], batchSize: number = 1000, maxConcurrentSegments: number = 20): Promise<T[]> {
        let startTime = Date.now()
        let items: T[] = []
        items = items.concat(inputItems)
        let maxSegments: T[][][] = []
        let putItems: T[] = []
        while (items.length > 0) {
            let batch = items.splice(0, batchSize * maxConcurrentSegments)
            let segment: T[][] = []
            while (batch.length > 0) {
                segment.push(batch.splice(0, batchSize))
            }
            maxSegments.push(segment)
        }
        for (const segment of maxSegments) {
            let startTime = Date.now()
            let promises: Promise<T[]>[] = []
            console.log(`batch length = ${segment.length}`)
            for (const batch of segment) {
                promises.push(this.batchDelete(batch))
            }
            let result = await Promise.all(promises)
            console.log("segment complete")
            result.forEach((res) => {
                putItems = putItems.concat(res)
            })
            console.log(`time for segment delete ${Date.now() - startTime}`)
        }
        console.log(`total time for complete parallel delete ${Date.now() - startTime}`)
        return putItems
    }

    /**
     * This function has to be used only in the scripts.
     * 
     * @param valueConstructor the model class
     */
    async parallelScan(valueConstructor: ZeroArgumentsConstructor<T>, options?: ParallelScanOptions): Promise<T[]> {
        let items: T[] = []
        for await (const item of mapper.parallelScan(valueConstructor, 4, options)) {
            items.push(item)
            if (items.length % 100000 == 0) {
                console.log("read 100K")
            }
        }
        return items
    }

    async scan(valueConstructor: ZeroArgumentsConstructor<T>, options?: ScanOptions | ParallelScanWorkerOptions): Promise<T[]> {
        let items: T[] = []
        for await (const item of mapper.scan(valueConstructor, options)) {
            items.push(item)
        }

        return items
    }

    async save(item: T): Promise<T> {
        item.modifiedAt = undefined
        const res = await mapper.put(item)
        return res
    }

    async update(item: T): Promise<T> {
        item.modifiedAt = new Date()
        const res = await mapper.update(item, {
            onMissing: "skip"
        })
        return res
    }

    async delete(item: T): Promise<T | undefined> {
        return await mapper.delete(item, { returnValues: "ALL_OLD" })
    }

    async get(item: T, readConsistency: ReadConsistency = "eventual"): Promise<T> {
        const res = await mapper.get(item, {
            readConsistency: readConsistency
        })
        return res
    }

    async batchPut(items: T[]): Promise<T[]> {
        let finalItems: T[] = []
        items = items.map(item => {
            item.modifiedAt = new Date()
            return item
        })
        for await (const item of mapper.batchPut(items)) {
            finalItems.push(item)
        }
        return finalItems
    }

    async batchDelete(items: T[]): Promise<T[]> {
        let deleteItems: T[] = []
        for await (const item of mapper.batchDelete(items)) {
            deleteItems.push(item)
        }
        return deleteItems
    }

    async batchGet(items: T[], readConsistency: ReadConsistency = "eventual"): Promise<T[]> {
        let getItems: T[] = []
        for await (const item of mapper.batchGet(items, {
            readConsistency: readConsistency
        })) {
            getItems.push(item)
        }
        return getItems
    }

    async parallelBatchGet(inputItems: T[], batchSize: number = 1000, maxConcurrentSegments: number = 20, readConsistency?: ReadConsistency ): Promise<T[]> {
        let startTime = Date.now()
        let items: T[] = []
        items = items.concat(inputItems)
        let maxSegments: T[][][] = []
        let resultItems: T[] = []
        while (items.length > 0) {
            let batch = items.splice(0, batchSize * maxConcurrentSegments)
            let segment: T[][] = []
            while (batch.length > 0) {
                segment.push(batch.splice(0, batchSize))
            }
            maxSegments.push(segment)
        }
        for (const segment of maxSegments) {
            let startTime = Date.now()
            let promises: Promise<T[]>[] = []
            console.log(`batch length = ${segment.length}`)
            for (const batch of segment) {
                promises.push(this.batchGet(batch, readConsistency))
            }
            let result = await Promise.all(promises)
            console.log("segment complete")
            result.forEach((res) => {
                resultItems = resultItems.concat(res)
            })
            console.log(`time for segment get ${Date.now() - startTime}`)
        }
        console.log(`total time for complete parallel get ${Date.now() - startTime}`)
        return resultItems
    }

    decode(continuationToken: string | undefined) {
        if (continuationToken) {
            try {
                let lastEvaluatedKey = JSON.parse(Buffer.from(continuationToken, 'base64').toString('utf8'));
                console.log("Incoming Last Evaluted Key " + lastEvaluatedKey);
                return lastEvaluatedKey;
            } catch (error) {
                throw new Error('Invalid continuationToken');
            }
        }
        return undefined
    }

    async encode(lastEvaluatedKey: any): Promise<string> {
        return Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64')
    }
}