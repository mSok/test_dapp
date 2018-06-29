//   live
let tokenAddress = '0xeddbc58afbd53a7e611526ecc99855c8d3746dd1'
let crowdSaleAddress = '0x1E9e05B80293Ef35Ca1223398638096fa6B5Cde7'
let sitisPlaceMarketAddress = '0x00'

// test token address in ropsten
if (process.env.NODE_ENV !== 'production') {
  // dev
  tokenAddress = '0x63120923A3E5bcE2783bBAeb581798273898755d'
  crowdSaleAddress = '0x0c20edb4dea22ce14cc070f16330f4fcf47fc81f'
  sitisPlaceMarketAddress = '0x554A1f875F7D6dc1454CC80e82a082a4286c9982'
}
console.log('process.env.NODE_ENV', process.env.NODE_ENV)

let contractsConst = {
  // Token
  'token': {
    'abi': JSON.parse('[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'),
    'address': tokenAddress
  },
  'crowdSale': {
    'abi': [
      {
        'constant': false,
        'inputs': [
          {
            'name': '_beneficiary',
            'type': 'address'
          }
        ],
        'name': 'buyTokens',
        'outputs': [],
        'payable': true,
        'stateMutability': 'payable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': 'val',
            'type': 'uint256'
          }
        ],
        'name': 'setCurrentRate',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'anonymous': false,
        'inputs': [
          {
            'indexed': true,
            'name': 'purchaser',
            'type': 'address'
          },
          {
            'indexed': true,
            'name': 'beneficiary',
            'type': 'address'
          },
          {
            'indexed': false,
            'name': 'value',
            'type': 'uint256'
          },
          {
            'indexed': false,
            'name': 'amount',
            'type': 'uint256'
          }
        ],
        'name': 'TokenPurchase',
        'type': 'event'
      },
      {
        'payable': true,
        'stateMutability': 'payable',
        'type': 'fallback'
      },
      {
        'inputs': [
          {
            'name': '_rate',
            'type': 'uint256'
          },
          {
            'name': '_wallet',
            'type': 'address'
          },
          {
            'name': '_token',
            'type': 'address'
          }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'rate',
        'outputs': [
          {
            'name': '',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'token',
        'outputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'wallet',
        'outputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'weiRaised',
        'outputs': [
          {
            'name': '',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      }
    ],
    'address': crowdSaleAddress
  },
  'sitisPlaceMarket': {
    'abi':[
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "purchaseId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "serviceId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "cancelOwner",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "cancelBuyer",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "status",
            "type": "uint8"
          }
        ],
        "name": "cancelPurchaseEvent",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_serviceId",
            "type": "uint256"
          },
          {
            "name": "_cnt",
            "type": "uint256"
          }
        ],
        "name": "buyService",
        "outputs": [
          {
            "name": "purchasesId",
            "type": "uint256"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_purchaseId",
            "type": "uint256"
          }
        ],
        "name": "cancelService",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_purchaseId",
            "type": "uint256"
          }
        ],
        "name": "closePurchase",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_serviceId",
            "type": "uint256"
          }
        ],
        "name": "closeService",
        "outputs": [
          {
            "name": "serviceId",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_serviceHash",
            "type": "bytes32"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "createService",
        "outputs": [
          {
            "name": "serviceId",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "serviceId",
            "type": "uint256"
          }
        ],
        "name": "serviceCloseEvent",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "serviceHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "serviceId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "serviceOwner",
            "type": "address"
          }
        ],
        "name": "serviceCreateEvent",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "buyerAddresss",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "purchaseId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "name": "serviceOwner",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "buyServiceEvent",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "_purchaseId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "purchaseCloseEvent",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_beneficiary",
            "type": "address"
          },
          {
            "name": "_weiAmount",
            "type": "uint256"
          }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_arbiter",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "arbiterWallet",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "hashServices",
        "outputs": [
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "serviceHash",
            "type": "bytes32"
          },
          {
            "name": "amount",
            "type": "uint256"
          },
          {
            "name": "serviceOwner",
            "type": "address"
          },
          {
            "name": "closed",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "purchases",
        "outputs": [
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "serviceId",
            "type": "uint256"
          },
          {
            "name": "cnt",
            "type": "uint256"
          },
          {
            "name": "buyer",
            "type": "address"
          },
          {
            "name": "status",
            "type": "uint8"
          },
          {
            "name": "cancelBuyer",
            "type": "bool"
          },
          {
            "name": "cancelOwner",
            "type": "bool"
          },
          {
            "name": "closed",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "purchasesCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "serviceCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "services",
        "outputs": [
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "serviceHash",
            "type": "bytes32"
          },
          {
            "name": "amount",
            "type": "uint256"
          },
          {
            "name": "serviceOwner",
            "type": "address"
          },
          {
            "name": "closed",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ],
    'address': sitisPlaceMarketAddress
  }
}

export default contractsConst
