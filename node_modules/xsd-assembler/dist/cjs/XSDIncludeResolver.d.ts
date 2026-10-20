import { XSDLoader } from './XSDLoader';
import { XSDIncludeResolverImpl } from './protocols';
export declare class XSDIncludeResolver implements XSDIncludeResolverImpl {
    private loader;
    constructor(loader: XSDLoader);
    private applySchemaAttributes;
    private reorderSchemaDirectives;
    resolveIncludes(filePath: string, firstFile?: boolean, basePath?: string): Promise<string>;
}
