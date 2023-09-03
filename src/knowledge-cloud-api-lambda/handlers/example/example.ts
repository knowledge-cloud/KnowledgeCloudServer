import { ExampleRequest } from "./example-types";

class ExampleAPI {
    public async createExample(request: ExampleRequest): Promise<{"message": string, yourExample: string}> {
        return {
            message: 'Hello World!',
            yourExample: request.example
        }
    }
}

export const exampleAPI = new ExampleAPI();