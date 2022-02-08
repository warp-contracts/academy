import { balance } from './actions/read/balance';
import { mintTokens } from './actions/write/mintTokens';
import { transferTokens } from './actions/write/transferTokens';
export async function handle(state, action) {
    const input = action.input;
    switch (input.function) {
        case 'mint':
            return await mintTokens(state, action);
        case 'transfer':
            return await transferTokens(state, action);
        case 'balance':
            return await balance(state, action);
        default:
            throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
    }
}
//# sourceMappingURL=contract.js.map