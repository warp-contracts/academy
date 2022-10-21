const sigUtil = require('@metamask/eth-sig-util');
const axios = require('axios');
const ethers = require('ethers');

axios.get('https://d1o5nlqr4okus2.cloudfront.net/gateway/interactions?contractId=kv1bAQsbBXCpuwovhZsd3DHUGuCm83yDzWJpCxCRnT4')
    .then(response => {
        let interactions = response.data.interactions;
        console.log(interactions[0].interaction);
        //TODO: Remove tx.signature and tx.id
        //then compare tx.owner == recoveredAddress
});


//Hardcoded tx data from: https://sonar.warp.cc/#/app/interaction/MERn-ovV6Gr6yAGXNQo8O-VLRNc4vLfAgxbMWL7fCaI
//TODO: Currently the data is compatible with the example from frontend
// but we shoud consider removing the empty id and signature parameters
// and probably also remove last_tx and data_root 
// leaving only the necessary elements  
const data = '{"format":2,"id":"","last_tx":"p7vc1iSP6bvH_fCeUFa9LqoV5qiyW-jdEKouAT0XMoSwrNraB9mgpi29Q10waEpO","owner":"","tags":[{"name":"QXBwLU5hbWU","value":"U21hcnRXZWF2ZUFjdGlvbg"},{"name":"QXBwLVZlcnNpb24","value":"MC4zLjA"},{"name":"U0RL","value":"V2FycA"},{"name":"Q29udHJhY3Q","value":"a3YxYkFRc2JCWENwdXdvdmhac2QzREhVR3VDbTgzeUR6V0pwQ3hDUm5UNA"},{"name":"SW5wdXQ","value":"eyJmdW5jdGlvbiI6InBvc3RNZXNzYWdlIiwiY29udGVudCI6InJlcmUifQ"},{"name":"U2lnbmF0dXJlLXNjaGVtYQ==","value":"RVZN"}],"target":"","quantity":"0","data":"MDI4MQ","data_size":"4","data_root":"kx1fv6GvY1Wkx_pmlRx-CckC0Y9JF7-sZ6XvfKpSipY","reward":"72600854","signature":""}';
const sign = '0x3dec60e73497b1c5d83d52d7cf5932e461e24732849060272d8db09e579172f73443abd1937a548cb6b1480d358d00f46f2d8d418edc24f92d25f8d34b02c76e1b';
const msg = `0x${Buffer.from(data, 'utf8').toString('hex')}`;

const recoveredAddressEthers = ethers.utils.verifyMessage(data, sign);
const recoveredAddrSigUtils = sigUtil.recoverPersonalSignature({
    data: msg,
    signature: sign,
});

console.log("Verification by eth-sig-utils: " + (recoveredAddrSigUtils == "0x6367d32e60396f9a080bab84ec16d71c2050bfb7" ));
console.log("Verification by ethers-js: " + (recoveredAddressEthers.toLocaleLowerCase() == "0x6367d32e60396f9a080bab84ec16d71c2050bfb7" ));
