import { XSDLoader } from './XSDLoader';
import { XSDIncludeResolver } from './XSDIncludeResolver';
import { XSDPropertyMerger } from './XSDPropertyMerger';
import { XSDAssemblerImpl } from '@Protocols';
export declare class XSDAssembler implements XSDAssemblerImpl {
    private loader;
    private resolver;
    private merger;
    constructor(loader: XSDLoader, resolver: XSDIncludeResolver, merger: XSDPropertyMerger);
    assemble(filePath: string): Promise<string>;
    private normalizeRegexPatterns;
}
