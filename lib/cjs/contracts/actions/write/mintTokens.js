"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintTokens = void 0;
const mintTokens = async (state, { caller, input: { qty } }) => {
    const balances = state.balances;
    console.log('test', balances[caller]);
    if (qty <= 0) {
        throw new ContractError('Invalid token mint');
    }
    if (!Number.isInteger(qty)) {
        throw new ContractError('Invalid value for "qty". Must be an integer');
    }
    balances[caller] ? (balances[caller] += qty) : (balances[caller] = qty);
    return { state };
};
exports.mintTokens = mintTokens;
//# sourceMappingURL=mintTokens.js.map