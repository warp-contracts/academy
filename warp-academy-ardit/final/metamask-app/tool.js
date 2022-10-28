const {
  WarpFactory,
  defaultCacheOptions,
  LoggerFactory,
} = require('warp-contracts');
const { EvmSignatureVerificationPlugin } = require('warp-signature');

(async () => {
  LoggerFactory.INST.logLevel('debug');

  const warp = WarpFactory.forMainnet({
    ...defaultCacheOptions,
    inMemory: true,
  }).use(new EvmSignatureVerificationPlugin());

  const contract = warp.contract(
    '6ZmyKQhGi5utcPGZtHNpDIwWLK4uKKix32O_sWEctyY'
  );
  const { cachedValue } = await contract.readState();

  console.log(cachedValue.state);
})();
