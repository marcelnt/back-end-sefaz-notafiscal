export interface XSDIncludeResolverImpl {
    resolveIncludes(filePath: string, firstFile?: boolean, basePath?: string): Promise<string>;
}
