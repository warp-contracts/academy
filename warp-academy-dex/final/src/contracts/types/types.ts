export interface DexState {
    name: string; 
    token0: string;
    token1: string;
    reserve0: number;
    reserve1: number;
    liquidityProvider: string;
  }
  
  export interface DexAction {
    input: DexInput;
    caller: string;
  }
  
  export interface DexInput {
    function: DexFunction;
    amountIn0: number;
    amountIn1: number;
  }
  
  export interface DexResult {
     amountOut: number;
  }
  
  export type DexFunction = 'swap' | 'mint' | 'burn' | 'getAmountOutForAmountIn';
  
  export type ContractResult = { state: DexState } | { result: number };