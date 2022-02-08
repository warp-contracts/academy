"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.balance = void 0;
const balance = async (state, { input: { target } }) => {
    const ticker = state.ticker;
    const balances = state.balances;
    if (typeof target !== 'string') {
        throw new ContractError('Must specify target to get balance for');
    }
    if (typeof balances[target] !== 'number') {
        throw new ContractError('Cannot get balance, target does not exist');
    }
    return { result: { target, ticker, balance: balances[target] } };
};
exports.balance = balance;
//# sourceMappingURL=balance.js.map