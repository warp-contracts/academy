import {ContractResult, PstAction, PstState} from '../../../contracts/types/types';
import {GPU, IKernelRunShortcut, KernelFunction} from 'gpu.js';

export const gpu = async (
  state: PstState,
  {input: {target}}: PstAction
): Promise<ContractResult> => {
  const gpu = new GPU();

  const kernelFunction: KernelFunction = function (anInt: number, anArray: number[], aNestedArray: number[][]) {
    const x = .25 + anInt + anArray[this.thread.x] + aNestedArray[this.thread.x][this.thread.y];
    return x;
  };

  const kernel: IKernelRunShortcut = gpu.createKernel(kernelFunction)
    .setOutput([1]);

  const result = kernel(1, [.25], [[1.5]]);
  return {result: {gpu: result[0]}};
};
