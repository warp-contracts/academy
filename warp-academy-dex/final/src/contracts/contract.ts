import { mint, burn } from './actions/liquidity';
import { getAmountOutForAmountIn, swap } from './actions/swap';
import { ContractResult, DexState, DexAction } from './types/types';

declare const ContractError;

export async function handle(state: DexState, action: DexAction): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'mint':
      return await mint(state, action);
    case 'burn':
      return await burn(state, action);
    case 'swap':
      return await swap(state, action);
    case 'getAmountOutForAmountIn':
      return await getAmountOutForAmountIn(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}