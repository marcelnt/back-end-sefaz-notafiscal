export interface XSDLoaderImpl {
    load(filePath: string, firstFile: boolean): Promise<string>;
}
