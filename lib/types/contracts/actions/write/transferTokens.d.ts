import { PstAction, PstState } from '../../../contracts/types/types';
export declare const transferTokens: (state: PstState, { caller, input: { target, qty } }: PstAction) => Promise<{
    state: PstState;
}>;
//# sourceMappingURL=transferTokens.d.ts.map