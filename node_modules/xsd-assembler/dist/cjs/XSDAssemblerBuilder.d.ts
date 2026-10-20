import { XSDAssemblerBuilderImpl } from '@Protocols/XSDAssemblerBuilderImpl';
export declare class XSDAssemblerBuilder implements XSDAssemblerBuilderImpl {
    private loader;
    private resolver;
    private merger?;
    constructor();
    private setMergeStrategy;
    assemble(filePath: string): Promise<string>;
}
