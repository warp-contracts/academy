import { ContractResult, ArditAction, ArditResult, ArditState } from './types/types';
import { downvoteMessage, upvoteMessage } from './actions/write/voting';
import { postMessage } from './actions/write/postMessage';
import { readMessage } from './actions/read/readMessage';

declare const ContractError;

export function handle(state: ArditState, action: ArditAction): ContractResult {
  const input = action.input;

  switch (input.function) {
    case 'postMessage':
      return postMessage(state, action);
    case 'upvoteMessage':
      return upvoteMessage(state, action);
    case 'downvoteMessage':
      return downvoteMessage(state, action);
    case 'readMessage':
      return readMessage(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}
