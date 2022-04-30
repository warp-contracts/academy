import { balance } from './actions/read/balance';
import { mintTokens } from './actions/write/mintTokens';
import { transferTokens } from './actions/write/transferTokens';
import { ContractResult, PstAction, PstResult, PstState } from './types/types';
import {gpu} from "@/contracts/actions/read/gpu";

declare const ContractError;

export async function handle(state: PstState, action: PstAction): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'mint':
      return await mintTokens(state, action);
    case 'transfer':
      return await transferTokens(state, action);
    case 'balance':
      return await balance(state, action);
    case 'gpu':
      return await gpu(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}
