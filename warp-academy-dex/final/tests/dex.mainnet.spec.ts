import ArLocal from 'arlocal';
import fs from 'fs';
import path from 'path';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { getTag, LoggerFactory, Warp, WarpFactory, SmartWeaveTags, Contract, EvalStateResult } from 'warp-contracts';

import { connectERC20, deployERC20, ERC20Contract, ERC20State } from 'erc20/bindings/erc20-js-binding';
import { ContractResult, DexResult, DexState } from '../src/contracts/types/types';

jest.setTimeout(120000);

describe('Testing the Staking Logic', () => {
  let ownerWallet: JWKInterface;
  let owner: string;
  let user1Wallet: JWKInterface;
  let user1: string;
  let initialERC20State: ERC20State;

  let arlocal: ArLocal;
  let warp: Warp;

  let token0: ERC20Contract;
  let token1: ERC20Contract;
  let dex: Contract<DexState>;


  beforeAll(async () => {
    // note: each tests suit (i.e. file with tests that Jest is running concurrently
    // with another files has to have ArLocal set to a different port!)
    //arlocal = new ArLocal(1822, false);
    //await arlocal.start();

    LoggerFactory.INST.logLevel('error');
    //LoggerFactory.INST.logLevel('debug', 'WASM:Rust');
    //LoggerFactory.INST.logLevel('debug', 'WasmContractHandlerApi');

    //warp = WarpFactory.forLocal(1822);
    warp = WarpFactory.forMainnet();

    ownerWallet = await warp.arweave.wallets.generate();
    owner = await warp.arweave.wallets.jwkToAddress(ownerWallet);

    user1Wallet = await warp.arweave.wallets.generate();
    user1 = await warp.arweave.wallets.jwkToAddress(user1Wallet);

  });

  it('should properly deploy token0 ERC20 contract', async () => {
    initialERC20State = {
      settings: null,
      symbol: 'tkn0',
      name: 'Token 0',
      decimals: 18,
      totalSupply: 1000000,
      balances: {
        [owner]: 1000000,
        [user1]: 100
      },
      allowances: {},
      owner: owner,
      canEvolve: true,
      evolve: '',
    };

    let deployedERC20Contract = await deployERC20(warp, initialERC20State, ownerWallet);
    const token0TxId = deployedERC20Contract[1].contractTxId;
    console.log('Deployed ERC20 contract: ', deployedERC20Contract);
    token0 = await connectERC20(warp, token0TxId, ownerWallet);

  });

  it('should properly deploy token1 ERC20 contract', async () => {
    const token1State = initialERC20State = {
      settings: null,
      symbol: 'tkn1',
      name: 'Token 1',
      decimals: 18,
      totalSupply: 1000000,
      balances: {
        [owner]: 1000000,
        [user1]: 100,
      },
      allowances: {},
      owner: owner,
      canEvolve: true,
      evolve: '',
    };

    let deployedERC20Contract = await deployERC20(warp, token1State, ownerWallet);
    const token1TxId = deployedERC20Contract[1].contractTxId;
    console.log('Deployed ERC20 contract: ', deployedERC20Contract);
    token1 = await connectERC20(warp, token1TxId, ownerWallet);

  });

  it('should properly deploy contract ERC20 contract', async () => {
    const initialDexState = {
      name: "DEX",
      liquidityProvider: null,
      token0: token0.txId(),
      token1: token1.txId(),
      reserve0: 0,
      reserve1: 0,
    };

    const contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');
    
    const deployedDex = await warp.createContract.deploy({
      wallet: ownerWallet,
      initState: JSON.stringify(initialDexState),
      src: contractSrc,
    });

    const dexContractTxId = deployedDex.contractTxId;
    console.log("Deployed DEX: " + dexContractTxId);
    dex = warp.contract(dexContractTxId);
    dex.setEvaluationOptions({internalWrites: true});
    dex.connect(ownerWallet);

    let evalResult = await dex.readState();
    expect(evalResult.state.token0).toEqual(token0.txId());
    expect(evalResult.state.token1).toEqual(token1.txId());   
  });

  it('should provide/mint dex liquidity', async () => {
    //Approve tokens
    await token0.approve({
      spender: dex.txId(),
      amount: 1000000
    });
    
    await token1.approve({
      spender: dex.txId(),
      amount: 1000000
    });

    await dex.writeInteraction({
      function: 'mint',
      amountIn0: 1000,
      amountIn1: 2000
    });

    let evalResult = await dex.readState();

    expect(evalResult.state.reserve0).toEqual(1000);
    expect((await token0.balanceOf(dex.txId())).balance).toEqual(1000);

    expect(evalResult.state.reserve1).toEqual(2000);
    expect((await token1.balanceOf(dex.txId())).balance).toEqual(2000);
   
  });

  it('should correctly calculate amoutOut (price) for amountIn0', async () => {
    
    const { result: amountOut1 }  = await dex.viewState({
      function: 'getAmountOutForAmountIn',
      amountIn0: 100,
      amountIn1: 0
    });

    expect(amountOut1).toEqual(182);

    const { result: amountOut2 }  = await dex.viewState({
      function: 'getAmountOutForAmountIn',
      amountIn0: 200,
      amountIn1: 0
    });

    expect(amountOut2).toEqual(333);

    const { result: amountOut3 }  = await dex.viewState({
      function: 'getAmountOutForAmountIn',
      amountIn0: 300,
      amountIn1: 0
    });

    expect(amountOut3).toEqual(462);
   
  });

  it('should correctly calculate amoutOut (price) for amountIn1', async () => {
    
    const { result: amountOut1 }  = await dex.viewState({
      function: 'getAmountOutForAmountIn',
      amountIn0: 0,
      amountIn1: 100
    });

    expect(amountOut1).toEqual(48);

    const { result: amountOut2 }  = await dex.viewState({
      function: 'getAmountOutForAmountIn',
      amountIn0: 0,
      amountIn1: 200
    });

    expect(amountOut2).toEqual(91);

    const { result: amountOut3 }  = await dex.viewState({
      function: 'getAmountOutForAmountIn',
      amountIn0: 0,
      amountIn1: 300
    });

    expect(amountOut3).toEqual(130);
   
  });

  it('should swap an amount of token0 for token1', async () => {
    //Approve tokens to swap
    const userToken0 = token0.connect(user1Wallet) as ERC20Contract;
    await userToken0.approve({
      spender: dex.txId(),
      amount: 10
    });
    
    await dex.connect(user1Wallet).writeInteraction({
      function: 'swap',
      amountIn0: 10,
      amountIn1: 0
    });

    expect((await token0.balanceOf(dex.txId())).balance).toEqual(1010);
    expect((await token1.balanceOf(dex.txId())).balance).toEqual(1980);
    
    expect((await token0.balanceOf(user1)).balance).toEqual(90);
    expect((await token1.balanceOf(user1)).balance).toEqual(120);

    let evalResult = await dex.readState();
    expect(evalResult.state.reserve0).toEqual(1010);
    expect(evalResult.state.reserve1).toEqual(1980);
   
  });

  it('should swap an amount of token1 for token0', async () => {
    //Approve tokens to swap
    await (token1.connect(user1Wallet) as ERC20Contract).approve({
      spender: dex.txId(),
      amount: 20
    });
    
    await dex.connect(user1Wallet).writeInteraction({
      function: 'swap',
      amountIn0: 0,
      amountIn1: 20
    });

    expect((await token0.balanceOf(dex.txId())).balance).toEqual(1000);
    expect((await token1.balanceOf(dex.txId())).balance).toEqual(2000);
    
    expect((await token0.balanceOf(user1)).balance).toEqual(100);
    expect((await token1.balanceOf(user1)).balance).toEqual(100);

    let evalResult = await dex.readState();
    expect(evalResult.state.reserve0).toEqual(1000);
    expect(evalResult.state.reserve1).toEqual(2000);   
  });

  it('should withdraw/burn dex liquidity', async () => {

    dex.connect(ownerWallet);

    await dex.writeInteraction({
      function: 'burn'
    });

    let evalResult = await dex.readState();

    expect(evalResult.state.reserve0).toEqual(0);
    expect((await token0.balanceOf(dex.txId())).balance).toEqual(0);

    expect(evalResult.state.reserve1).toEqual(0);
    expect((await token1.balanceOf(dex.txId())).balance).toEqual(0);
   
  });



  // it('should not stake more than owned', async () => {
  //   expect((await erc20.balanceOf(user1)).balance).toEqual(100);
  //   expect((await erc20.balanceOf(stakingContractTxId)).balance).toEqual(0);
  //   expect((await erc20.allowance(user1, stakingContractTxId)).allowance).toEqual(120);

  //   await expect(staking.stake(110)).rejects.toThrow(
  //     'Cannot create interaction: [CE:FailedTokenTransfer [CE:CallerBalanceNotEnough 100]]'
  //   );
  // });
  
});
