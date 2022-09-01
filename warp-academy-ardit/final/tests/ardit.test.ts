import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { LoggerFactory, Warp, WarpFactory, Contract } from 'warp-contracts';
import { ArditState } from '../src/contracts/types/types';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

describe('Testing the Atomic NFT Token', () => {
  let ownerWallet: JWKInterface;
  let owner: string;

  let user2Wallet: JWKInterface;
  let user2: string;

  let user3Wallet: JWKInterface;
  let user3: string;

  let initialState: ArditState;

  let arlocal: ArLocal;
  let warp: Warp;
  let ardit: Contract<ArditState>;

  let contractSrc: string;

  let contractId: string;

  beforeAll(async () => {
    arlocal = new ArLocal(1820, false);
    await arlocal.start();

    LoggerFactory.INST.logLevel('error');
    //LoggerFactory.INST.logLevel('debug', 'WasmContractHandlerApi');

    warp = WarpFactory.forLocal(1820);

    ({jwk: ownerWallet, address: owner} = await warp.testing.generateWallet());

    ({jwk: user2Wallet, address: user2} = await warp.testing.generateWallet());

    ({jwk: user3Wallet, address: user3} = await warp.testing.generateWallet());

    initialState = {
      messages: [],
    };

    contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

    ({ contractTxId: contractId } = await warp.createContract.deploy({
      wallet: ownerWallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    }));
    console.log('Deployed contract: ', contractId);
    ardit = warp.contract<ArditState>(contractId).connect(ownerWallet);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('should properly deploy contract', async () => {
    const contractTx = await warp.arweave.transactions.get(contractId);

    expect(contractTx).not.toBeNull();
  });

  it('should read Ardit state', async () => {
    expect((await ardit.readState()).cachedValue.state).toEqual(initialState);
  });

  it('should properly post message', async () => {
    await ardit.writeInteraction({ function: 'postMessage', content: 'Hello world!' });

    const { cachedValue } = await ardit.readState();
    expect(cachedValue.state.messages[0]).toEqual({
      id: 1,
      creator: owner,
      content: 'Hello world!',
      votes: { addresses: [], status: 0 },
    });
  });

  it('should not post message with no content', async () => {
    await expect(ardit.writeInteraction({ function: 'postMessage' }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Creator must provide a message content.'
    );
  });

  it('should not be possible for creator to vote for they message', async () => {
    await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Message creator cannot vote for they own message.'
    );

    await expect(ardit.writeInteraction({ function: 'downvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Message creator cannot vote for they own message.'
    );
  });

  it('should not be possible to vote for non-existing message', async () => {
    ardit = warp.contract<ArditState>(contractId).connect(user2Wallet);

    await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 5 }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Message does not exist.'
    );
  });

  it('should properly upvote message', async () => {
    ardit = warp.contract<ArditState>(contractId).connect(user2Wallet);

    await ardit.writeInteraction({ function: 'upvoteMessage', id: 1 });

    const { cachedValue } = await ardit.readState();
    expect(cachedValue.state.messages[0].votes.status).toEqual(1);
  });

  it('should not be possible to vote for the same message twice', async () => {
    ardit = warp.contract<ArditState>(contractId).connect(user2Wallet);

    await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Caller has already voted.'
    );

    await expect(ardit.writeInteraction({ function: 'downvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
      'Caller has already voted.'
    );
  });

  it('should properly downvote message', async () => {
    ardit = warp.contract<ArditState>(contractId).connect(user3Wallet);

    await ardit.writeInteraction({ function: 'downvoteMessage', id: 1 });

    const { cachedValue } = await ardit.readState();
    expect(cachedValue.state.messages[0].votes.status).toEqual(0);
  });

  it('should properly view message', async () => {
    const { result } = await ardit.viewState({ function: 'readMessage', id: 1 });

    expect(result).toEqual({
      id: 1,
      creator: owner,
      content: 'Hello world!',
      votes: { addresses: [user2, user3], status: 0 },
    });
  });
});
