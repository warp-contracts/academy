/* eslint-disable no-undef */
export async function handle(state, action) {

  const COLORS = ["green", "red", "yellow", "blue", "black", "brown", "pink", "orange", "purple", "gray"];
  const MATERIALS = ["gold", "wood", "silver", "fire", "diamond", "platinum", "palladium", "bronze", "lithium", "titanium"];
  const ITEMS = ["sword", "shield", "robe", "stone", "crown", "katana", "dragon", "ring", "axe", "hammer"];

  function bigIntFromBytes(byteArr) {
    let hexString = "";
    for (const byte of byteArr) {
      hexString += byte.toString(16).padStart(2, '0');
    }
    return BigInt("0x" + hexString);
  }

  // This function calculates a pseudo-random int value,
  // which is less then the `max` argument.
  // Note! To correctly generate several random numbers in
  // a single contract interaction, you should pass different
  // values for the `uniqueValue` argument
  async function getRandomIntNumber(max, uniqueValue = "") {
    const pseudoRandomData = SmartWeave.arweave.utils.stringToBuffer(
      SmartWeave.block.height
      + SmartWeave.block.timestamp
      + SmartWeave.transaction.id
      + action.caller
      + uniqueValue
    );
    const hashBytes = await SmartWeave.arweave.crypto.hash(pseudoRandomData);
    const randomBigInt = bigIntFromBytes(hashBytes);
    return Number(randomBigInt % BigInt(max));
  }

  const {input:{ 'function': contractHandleFunction}} = action;
  switch (contractHandleFunction) {

    case "name": {
      return { result: state.name };
    }

    case "generatedAssets": {
      return { result: Object.keys(state.assets) };
    }

    case "assetsLeft": {
      const allAssetsCount = COLORS.length * MATERIALS.length * ITEMS.length;
      const generatedAssetsCount = Object.keys(state.assets).length;
      const assetsLeftCount = allAssetsCount - generatedAssetsCount;
      return { result: assetsLeftCount };
    }

    case "getOwner": {
      const {input:{ data: {asset}}} = action;
      if (!state.assets[asset]) {
         throw new ContractError(`The asset "${asset}" doesn't exist yet`);
      }
      return { result: state.assets[asset] };
    }

    case "generate": {
      const {caller} = action;
      const colorIndexPromise = getRandomIntNumber(COLORS.length, "color");
      const materialIndexPromise = getRandomIntNumber(MATERIALS.length, "material");
      const itemIndexPromise = getRandomIntNumber(ITEMS.length, "item");
      const [colorIndex, materialIndex, itemIndex] = await Promise.all([colorIndexPromise, materialIndexPromise, itemIndexPromise]);
      const asset = `${COLORS[colorIndex]} ${MATERIALS[materialIndex]} ${ITEMS[itemIndex]}`
      if (state.assets[asset]) {
        throw new ContractError(
          `Generated item (${asset}) is already owned by: ${state.assets[asset]}`);
      }
      return {state: {...state, assets: {...state.assets, [asset]: caller}}};
    }
      

    case "transfer": {
      const {input:{ data: {asset, to: toAddress}}, caller} = action;
      if (state.assets[asset] !== caller) {
        throw new ContractError("A sender must own the transferred asset");
      }
      return { state: {...state, assets: {...state.assets, [asset]: toAddress}} };
    }
    
    default: {
      throw new ContractError (
        `Unsupported contract function: ${contractHandleFunction}`);
    }

  }
}
