import { ArditAction, ArditState, ContractResult } from '../../types/types';

declare const ContractError;

export const readMessage = async (state: ArditState, { input: { id } }: ArditAction): Promise<ContractResult> => {
  const message = state.messages.find((m) => m.id == id);

  if (!message) {
    throw new ContractError(`Message with id: ${id} does not exist`);
  }

  return { result: message };
};
