import { PstAction, PstState } from '../../../contracts/types/types';
export declare const balance: (state: PstState, { input: { target } }: PstAction) => Promise<{
    result: {
        target: string;
        ticker: string;
        balance: number;
    };
}>;
//# sourceMappingURL=balance.d.ts.map