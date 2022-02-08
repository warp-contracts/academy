"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const balance_1 = require("./actions/read/balance");
const mintTokens_1 = require("./actions/write/mintTokens");
const transferTokens_1 = require("./actions/write/transferTokens");
async function handle(state, action) {
    const input = action.input;
    switch (input.function) {
        case 'mint':
            return await (0, mintTokens_1.mintTokens)(state, action);
        case 'transfer':
            return await (0, transferTokens_1.transferTokens)(state, action);
        case 'balance':
            return await (0, balance_1.balance)(state, action);
        default:
            throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
    }
}
exports.handle = handle;
//# sourceMappingURL=contract.js.map