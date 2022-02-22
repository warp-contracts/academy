import { PstAction, PstState } from '../../../contracts/types/types';

declare const ContractError;

export const mintTokens = async (
  state: PstState,
  { caller, input: { qty } }: PstAction
) => {
  const balances = state.balances;

  if (qty <= 0) {
    throw new ContractError('Invalid token mint');
  }

  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }

  balances[caller] ? (balances[caller] += qty) : (balances[caller] = qty);
  return { state };
};
