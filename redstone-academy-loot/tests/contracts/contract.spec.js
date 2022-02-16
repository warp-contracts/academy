const fs = require('fs');
const path = require('path');
const { default: ArLocal } = require('arlocal');
const Arweave = require('arweave');
const { LoggerFactory, SmartWeaveNodeFactory } = require('redstone-smartweave');

describe('Testing the Loot contract', () => {
  let contractSrc,
    initialState,
    wallet,
    arweave,
    arlocal,
    smartweave,
    contract,
    walletAddress;
  let asset = '';
  const MOCK_ADDRESS = '0x1234',
    MOCK_ADDRESS_2 = '0x5678';

  beforeAll(async () => {
    arlocal = new ArLocal(1985, false);
    await arlocal.start();

    arweave = Arweave.init({
      host: 'localhost',
      port: 1985,
      protocol: 'http',
    });

    LoggerFactory.INST.logLevel('error');

    smartweave = SmartWeaveNodeFactory.memCachedBased(arweave).build();
    wallet = await arweave.wallets.generate();
    walletAddress = await arweave.wallets.jwkToAddress(wallet);

    await addFunds(arweave, wallet);

    contractSrc = fs.readFileSync(
      path.join(__dirname, '../../src/contracts/loot/contract.js'),
      'utf8'
    );
    initialState = fs.readFileSync(
      path.join(__dirname, '../../src/contracts/loot/initial-state.json'),
      'utf8'
    );

    const contractTxId = await smartweave.createContract.deploy({
      wallet,
      initState: initialState,
      src: contractSrc,
    });

    contract = smartweave.contract(contractTxId);
    contract.connect(wallet);

    await mineBlock(arweave);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('Should have no assets right after deployment', async () => {
    const { state } = await contract.readState();
    expect(state.assets).toEqual({});
  });

  it('Should generate an asset', async () => {
    await contract.writeInteraction({
      function: 'generate',
    });
    await mineBlock(arweave);
  });

  it('User should have a new asset', async () => {
    await mineBlock(arweave);

    const { result: assets } = await contract.viewState({
      function: 'generatedAssets',
    });
    expect(assets).toBeInstanceOf(Array);
    asset = assets[0];

    const { result: owner } = await contract.viewState({
      function: 'getOwner',
      data: { asset },
    });
    expect(owner).toBe(walletAddress);
  });

  it('Should transfer asset to the new address', async () => {
    await contract.writeInteraction({
      function: 'transfer',
      data: {
        to: MOCK_ADDRESS,
        asset,
      },
    });
    await mineBlock(arweave);
    const { result: owner } = await contract.viewState({
      function: 'getOwner',
      data: { asset },
    });
    expect(owner).toBe(MOCK_ADDRESS);
  });

  it('Should not transfer asset that does not belong to sender', async () => {
    await contract.writeInteraction({
      function: 'transfer',
      data: {
        to: MOCK_ADDRESS_2,
        asset,
      },
    });
    await mineBlock(arweave);

    const { result: owner } = await contract.viewState({
      function: 'getOwner',
      data: { asset },
    });
    expect(owner).toBe(MOCK_ADDRESS);
  });
});

async function addFunds(arweave, wallet) {
  const walletAddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
}

async function mineBlock(arweave) {
  await arweave.api.get('mine');
}
