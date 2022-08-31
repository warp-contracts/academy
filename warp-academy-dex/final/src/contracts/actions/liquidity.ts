import { ContractResult, DexAction, DexState } from '../types/types';

declare const ContractError;

/**
 * Currently, for the simplicity case we don't tokenize liquidity.
 * Therefore, the liquidity could be provided by a single wallet.
 * In order to change the liquidity, the provider will need to withdraw all the funds
 * and redeploy them.
 */
export const mint = async (
  state: DexState,
  { caller, input: { amountIn0, amountIn1 } }: DexAction
): Promise<ContractResult> => {
  if (state.liquidityProvider == null) {
    state.liquidityProvider = caller;
  } else {
    throw new ContractError('Burn liquidity first before adding it again.');
  }

  if (amountIn0 > 0) {
    const token0TransferResult = await SmartWeave.contracts.write(state.token0, {
      function: 'transferFrom',
      from: caller,
      to: SmartWeave.contract.id,
      amount: amountIn0,
    });
    if (token0TransferResult.type == 'ok') {
      state.reserve0 += amountIn0;
    } else {
      throw new ContractError('Token0 transfer failed: ' + token0TransferResult.errorMessage);
    }
  }

  if (amountIn1 > 0) {
    await SmartWeave.contracts.write(state.token1, {
      function: 'transferFrom',
      from: caller,
      to: SmartWeave.contract.id,
      amount: amountIn1,
    });
    state.reserve1 += amountIn1;
  }

  return { state };
};

export const burn = async (state: DexState, { caller }: DexAction): Promise<ContractResult> => {
  if (caller !== state.liquidityProvider) {
    throw new ContractError('Only the liquidity provider may burn and withdraw the liquidity.');
  }

  await SmartWeave.contracts.write(state.token0, {
    function: 'transfer',
    to: caller,
    amount: state.reserve0,
  });
  state.reserve0 = 0;

  await SmartWeave.contracts.write(state.token1, {
    function: 'transfer',
    to: caller,
    amount: state.reserve1,
  });
  state.reserve1 = 0;

  state.liquidityProvider = null;

  return { state };
};
