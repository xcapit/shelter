export interface Command{
    bodyResponse(): Promise<string>;   
    destinationNumber(): string;
}
