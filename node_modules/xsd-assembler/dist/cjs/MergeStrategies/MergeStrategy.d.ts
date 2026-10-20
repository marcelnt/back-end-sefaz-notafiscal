export interface MergeStrategy {
    merge(mainSchema: string, includedSchema: string): string;
}
