import { XSDLoaderImpl } from './protocols';
export declare class XSDLoader implements XSDLoaderImpl {
    private schemaAttributes;
    private extractSchemaAttributes;
    private mergeSchemaAttributes;
    getSchemaAttributes(): {
        [key: string]: string;
    };
    load(filePath: string, firstFile: boolean): Promise<string>;
}
