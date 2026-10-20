import { MergeStrategy } from './MergeStrategy';
export declare class PreserveDuplicates implements MergeStrategy {
    merge(mainSchema: string, includedSchema: string): string;
}
