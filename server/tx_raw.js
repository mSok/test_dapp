
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const ethTx = require('ethereumjs-tx');

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

web3.eth.net.isListening()
.then(() => console.log('is connected'))
.catch(e => console.log('Wow. Something went wrong'));


const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('./src/assets/contracts/SitisPlaceMarket.json', 'utf8'));
var contractAddress = '0xb2bde1eaa11c012a43bbc504c10dca89438710df'

let myContract = new web3.eth.Contract(contractABI.abi, contractAddress)
let callData = myContract.methods.createService('0x00124', 10000).encodeABI();

// callData2 = web3.eth.abi.encodeFunctionCall(contractABI.abi[13], ['0xe1684dd2a840997ddbd8fd58c60c92', 10])
// console.log(callData)

const txParams = {
  nonce: '0xe1684dd2a840997ddbd8fd58c60c9289ef4759c1', // Replace by nonce for your account on geth node
  gasPrice: '0x09184e72a000',
  gasLimit: '0x30000',
  to: '0xb2bde1eaa11c012a43bbc504c10dca89438710df',
  value: '0x00',
  data: callData
};
// // Transaction is created
const tx = new ethTx(txParams)
const privKey = Buffer.from('e3be80f1ab4e75e6ad0d7ac2a7fdf29d5dbdb2087cb09b5d93904228bb9dbf7f', 'hex')
// // Transaction is signed
tx.sign(privKey);
const serializedTx = tx.serialize()
const rawTx = '0x' + serializedTx.toString('hex')
console.log(rawTx)
// eth.sendRawTransaction(rawTx)
web3.eth.sendSignedTransaction(rawTx).on('receipt', console.log);


// const fs = require('fs');
// const contract = JSON.parse(fs.readFileSync('./src/assets/contracts/SitisPlaceMarket.json', 'utf8'));
// console.log(JSON.stringify(contract.abi));

// const keythereum = require('keythereum');
// const address = '0x3806d0f429904632b1beda52c97dff6bc2647b5d';
// const datadir = '/home/sok/eth/chaindata';
// const password = 'test';
// let str;
// GWKeMkhroN7Jvu
// e3be80f1ab4e75e6ad0d7ac2a7fdf29d5dbdb2087cb09b5d93904228bb9dbf7f

//  SitisPlaceMarket: 0xb2bde1eaa11c012a43bbc504c10dca89438710df

// const keythereum = require('keythereum');
// const address = '0xe1684dd2a840997ddbd8fd58c60c9289ef4759c1';
// const datadir = '/home/sok/eth/chaindata';
// const password = 'GWKeMkhroN7Jvu';
// let str;
// keythereum.importFromFile(address, datadir, function (keyObject) {
//     keythereum.recover(password, keyObject, function (privateKey) {
//     console.log(privateKey.toString('hex'));
// // secret
// //738def8d8bb7de21bc3bc85c29195ad53eb8cb7c378b02028aa0512f11ce3ef7
//   });
// });
