import { MergeStrategy } from './MergeStrategy';
export declare class OverwriteDuplicates implements MergeStrategy {
    merge(mainSchema: string, includedSchema: string): string;
}
