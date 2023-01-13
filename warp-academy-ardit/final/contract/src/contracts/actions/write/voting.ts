import { ArditAction, ArditState, ContractResult } from '../../types/types';

declare const ContractError;

export const upvoteMessage = (
  state: ArditState,
  { caller, input: { id } }: ArditAction
): ContractResult => {
  const message = state.messages.find((m) => m.id == id);

  if (!message) {
    throw new ContractError(`Message does not exist.`);
  }

  if (caller == message.creator) {
    throw new ContractError(`Message creator cannot vote for they own message.`);
  }

  if (message.votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  message.votes.status++;
  message.votes.addresses.push(caller);

  return { state };
};

export const downvoteMessage = (
  state: ArditState,
  { caller, input: { id } }: ArditAction
): ContractResult => {
  const message = state.messages.find((m) => (m.id = id));

  if (!message) {
    throw new ContractError(`Message does not exist.`);
  }

  if (caller == message.creator) {
    throw new ContractError(`Message creator cannot vote for they own message.`);
  }

  if (message.votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  message.votes.status--;
  message.votes.addresses.push(caller);

  return { state };
};
