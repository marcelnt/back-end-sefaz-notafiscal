export interface XSDAssemblerImpl {
    assemble(filePath: string): Promise<string>;
}
