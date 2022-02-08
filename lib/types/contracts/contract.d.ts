import { PstAction, PstResult, PstState } from './types/types';
declare type ContractResult = {
    state: PstState;
} | {
    result: PstResult;
};
export declare function handle(state: PstState, action: PstAction): Promise<ContractResult>;
export {};
//# sourceMappingURL=contract.d.ts.map