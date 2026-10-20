import { MergeStrategy } from './MergeStrategies/MergeStrategy';
import { XSDPropertyMergerImpl } from './protocols';
export declare class XSDPropertyMerger implements XSDPropertyMergerImpl {
    private strategy;
    constructor(strategy: MergeStrategy);
    mergeProperties(schemaContent: string): string;
}
