import fs from 'fs';
import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import path from 'path';
import {
  PstContract,
  PstState,
  Warp,
  LoggerFactory,
  InteractionResult, WarpFactory,
} from 'warp-contracts';

describe('Testing the Profit Sharing Token', () => {
  let contractSrc: string;

  let wallet: JWKInterface;
  let walletAddress: string;

  let initialState: PstState;

  let arlocal: ArLocal;
  let warp: Warp;
  let pst: PstContract;

  beforeAll(async () => {
    arlocal = new ArLocal(1820);
    await arlocal.start();

    LoggerFactory.INST.logLevel('error');

    warp = WarpFactory.forLocal(1820);
    ({ jwk: wallet, address: walletAddress } = await warp.testing.generateWallet());

    contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');
    const stateFromFile: PstState = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../dist/contracts/initial-state.json'), 'utf8')
    );

    initialState = {
      ...stateFromFile,
      ...{
        owner: walletAddress,
      },
    };

    const {contractTxId} = await warp.createContract.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });

    pst = warp.pst(contractTxId);
    pst.connect(wallet);

    await warp.testing.mineBlock();
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('should read pst state and balance data', async () => {
    expect(await pst.currentState()).toEqual(initialState);
    expect((await pst.currentBalance('GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI')).balance).toEqual(1000);
    expect((await pst.currentBalance('33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA')).balance).toEqual(230);
  });

  it('should properly mint tokens', async () => {
    await pst.writeInteraction({
      function: 'mint',
      qty: 2000,
    });

    expect((await pst.currentState()).balances[walletAddress]).toEqual(2000);
  });

  it('should properly transfer tokens', async () => {
    await pst.transfer({
      target: 'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI',
      qty: 555,
    });

    expect((await pst.currentState()).balances[walletAddress]).toEqual(2000 - 555);
    expect((await pst.currentState()).balances['GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI']).toEqual(1000 + 555);
  });

  it('should properly perform dry write with overwritten caller', async () => {
    const { address: overwrittenCaller } = await warp.testing.generateWallet();
    await pst.transfer({
      target: overwrittenCaller,
      qty: 1000,
    });

    const result: InteractionResult<PstState, unknown> = await pst.dryWrite(
      {
        function: 'transfer',
        target: 'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI',
        qty: 333,
      },
      overwrittenCaller
    );

    expect(result.state.balances[walletAddress]).toEqual(2000 - 555 - 1000);
    expect(result.state.balances['GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI']).toEqual(1000 + 555 + 333);
    expect(result.state.balances[overwrittenCaller]).toEqual(1000 - 333);
  });
});
