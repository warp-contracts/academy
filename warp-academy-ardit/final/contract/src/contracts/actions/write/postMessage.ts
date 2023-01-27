import { ArditAction, ArditState, ContractResult } from '../../types/types';

declare const ContractError;

export const postMessage = (
  state: ArditState,
  { caller, input: { content } }: ArditAction
): ContractResult => {
  const messages = state.messages;
  if (!content) {
    throw new ContractError(`Creator must provide a message content.`);
  }

  const id = messages.length + 1;

  state.messages.push({
    id,
    creator: caller,
    content,
    votes: {
      addresses: [],
      status: 0,
    },
  });

  return { state };
};
