export enum KnowledgeBaseIndex {
    UPSC = "UpscIndex"
}

export enum CognitionEngineEventType {
    RETRIEVAL = "RETRIEVAL",
    INGESTION = "INGESTION"
}

export interface CognitionEngineRequest {
    eventType: CognitionEngineEventType.RETRIEVAL,
    data: CognitionEngineRetrievalRequest
}

export interface CognitionEngineRetrievalRequest {
    query: string,
    knowledgeBaseIndex: KnowledgeBaseIndex
}

export interface CognitionEngineResponse {
    statusCode: number,
    body: CognitionEngineSuccessResponse | string
}

export interface CognitionEngineSuccessResponse {
    question: string,
    answer: string
}