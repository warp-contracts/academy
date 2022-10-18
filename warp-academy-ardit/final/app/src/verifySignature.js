const sigUtil = require('@metamask/eth-sig-util');
const axios = require('axios');

axios.get('https://d1o5nlqr4okus2.cloudfront.net/gateway/interactions?contractId=kv1bAQsbBXCpuwovhZsd3DHUGuCm83yDzWJpCxCRnT4')
    .then(response => {
        let interactions = response.data.interactions;
        console.log(interactions[0].interaction);
        //TODO: Remove tx.signature and tx.id
        //then compare tx.owner == recoveredAddress
});


  
const data = '{"format":2,"id":"","last_tx":"p7vc1iSP6bvH_fCeUFa9LqoV5qiyW-jdEKouAT0XMoSwrNraB9mgpi29Q10waEpO","owner":"0x6367d32e60396f9a080bab84ec16d71c2050bfb7","tags":[{"name":"QXBwLU5hbWU","value":"U21hcnRXZWF2ZUFjdGlvbg"},{"name":"QXBwLVZlcnNpb24","value":"MC4zLjA"},{"name":"U0RL","value":"V2FycA"},{"name":"Q29udHJhY3Q","value":"a3YxYkFRc2JCWENwdXdvdmhac2QzREhVR3VDbTgzeUR6V0pwQ3hDUm5UNA"},{"name":"SW5wdXQ","value":"eyJmdW5jdGlvbiI6InBvc3RNZXNzYWdlIiwiY29udGVudCI6InJyIn0"},{"name":"U2lnbmF0dXJlLXNjaGVtYQ==","value":"RVZN"}],"target":"","quantity":"0","data":"MTI5NQ","data_size":"4","data_root":"0wHprw_BbijEDIAwYYZpGyzSQmzngf_hQAvLCYTKbcI","reward":"72600854","signature":""}';
const sign = '0x4af8f55658dfbcda6839a58794a5a00b78f3c2e221f5c6728a2fcbb6f6ce5cb151b781194b48f22c2615dd27bb131c80db46eaddbd5285de0e431c349fc6060d1c';
const msg = `0x${Buffer.from(data, 'utf8').toString('hex')}`;
const recoveredAddr = sigUtil.recoverPersonalSignature({
    data: msg,
    signature: sign,
});
console.log("Is valid: " + (recoveredAddr == "0x6367d32e60396f9a080bab84ec16d71c2050bfb7" ));