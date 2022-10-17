(() => {
  // src/contracts/actions/write/voting.ts
  var upvoteMessage = async (state, { caller, input: { id } }) => {
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
  var downvoteMessage = async (state, { caller, input: { id } }) => {
    const message = state.messages.find((m) => m.id = id);
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

  // src/contracts/actions/write/postMessage.ts
  var postMessage = async (state, { caller, input: { content } }) => {
    const messages = state.messages;
    if (!content) {
      throw new ContractError(`Creator must provide a message content.`);
    }
    const id = messages.length == 0 ? 1 : messages.length + 1;
    state.messages.push({
      id,
      creator: caller,
      content,
      votes: {
        addresses: [],
        status: 0
      }
    });
    return { state };
  };

  // src/contracts/actions/read/readMessage.ts
  var readMessage = async (state, { input: { id } }) => {
    const message = state.messages.find((m) => m.id == id);
    if (!message) {
      throw new ContractError(`Message with id: ${id} does not exist`);
    }
    return { result: message };
  };

  // src/contracts/contract.ts
  async function handle(state, action) {
    const input = action.input;
    switch (input.function) {
      case "postMessage":
        return await postMessage(state, action);
      case "upvoteMessage":
        return await upvoteMessage(state, action);
      case "downvoteMessage":
        return await downvoteMessage(state, action);
      case "readMessage":
        return await readMessage(state, action);
      default:
        throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
    }
  }
})();
