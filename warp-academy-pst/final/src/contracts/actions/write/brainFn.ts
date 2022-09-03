import {ContractResult, PstAction, PstState} from '../../../contracts/types/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const brain = require('brain.js');

export const brainFn = async (
  state: PstState,
  {input: {target}}: PstAction
): Promise<ContractResult> => {
  const net = new brain.recurrent.LSTMTimeStep({
    inputSize: 2,
    hiddenLayers: [10],
    outputSize: 2,
  });

// Same test as previous, but combined on a single set
  const trainingData = [
    [
      [1, 5],
      [2, 4],
      [3, 3],
      [4, 2],
      [5, 1],
    ],
  ];

  net.train(trainingData, { log: true, errorThresh: 0.09 });

  const closeToFiveAndOne = net.run([
    [1, 5],
    [2, 4],
    [3, 3],
    [4, 2],
  ]);

  console.log(closeToFiveAndOne);

// now we're cookin' with gas!
  const forecast = net.forecast(
    [
      [1, 5],
      [2, 4],
    ],
    3
  );

  console.log('next 3 predictions', forecast);
  return {result: {forecast: forecast}};
};