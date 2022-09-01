const fs = require('fs');
const path = require('path');
const {default: ArLocal} = require('arlocal');
const {LoggerFactory, WarpFactory} = require('warp-contracts');

describe('Testing the Loot contract', () => {
  let contractSrc,
    initialState,
    wallet,
    arlocal,
    warp,
    contract,
    walletAddress;

  let asset = '';

  const MOCK_ADDRESS = '0x1234',
    MOCK_ADDRESS_2 = '0x5678';

  beforeAll(async () => {
    arlocal = new ArLocal(1985, false);
    await arlocal.start();

    LoggerFactory.INST.logLevel('error');

    // note: creating a "Warp" instance for local testing environment.
    warp = WarpFactory.forLocal(1985);

    // note: warp.testing.generateWallet() automatically adds funds to the wallet
    ({jwk: wallet, address: walletAddress} = await warp.testing.generateWallet());

    contractSrc = fs.readFileSync(
      path.join(__dirname, '../../src/contracts/loot/contract.js'),
      'utf8'
    );
    initialState = fs.readFileSync(
      path.join(__dirname, '../../src/contracts/loot/initial-state.json'),
      'utf8'
    );

    const {contractTxId} = await warp.createContract.deploy({
      wallet,
      initState: initialState,
      src: contractSrc,
    });

    contract = warp.contract(contractTxId)
      .setEvaluationOptions({
        allowBigInt: true
      })
      .connect(wallet);

    // note: we need to mine block in ArLocal - so that contract deployment transaction was mined.
    await warp.testing.mineBlock();
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('Should have no assets right after deployment', async () => {
    await warp.testing.mineBlock();
    const {cachedValue} = await contract.readState();
    expect(cachedValue.state.assets).toEqual({});
  });

  it('Should generate an asset', async () => {
    // note: if Warp instance is created with 'forLocal' - the writeInteraction method
    // automatically mines a new block - so that you won't have to do it manually in your tests.
    // if you want to switch off automatic mining - set evaluationOptions.mineArLocalBlocks to false, e.g.
    // contract.setEvaluationOptions({ mineArLocalBlocks: false })
    await contract.writeInteraction({
      function: 'generate',
    });

    const {result: assets} = await contract.viewState({
      function: 'generatedAssets',
    });
    expect(assets).toBeInstanceOf(Array);
    asset = assets[0];

    const {result: owner} = await contract.viewState({
      function: 'getOwner',
      data: {asset},
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

    const {result: owner} = await contract.viewState({
      function: 'getOwner',
      data: {asset},
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

    const {result: owner} = await contract.viewState({
      function: 'getOwner',
      data: {asset},
    });
    expect(owner).toBe(MOCK_ADDRESS);
  });
});

