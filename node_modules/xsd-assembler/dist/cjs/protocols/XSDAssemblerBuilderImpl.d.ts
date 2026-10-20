export interface XSDAssemblerBuilderImpl {
    assemble(filePath: string): Promise<string>;
}
