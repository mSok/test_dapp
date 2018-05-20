# Тестируем blockchain app

- Для тестов необходим тестовый аккаунты geth или ganache  http://truffleframework.com/ganache/
- NPM: https://nodejs.org
- Metamask: https://metamask.io/


## Step 1. Clone the project
`git clone https://github.com/mSok/test_dapp.git`

## Step 2. Install dependencies
```
$ cd test_dapp
$ npm install
```
## Step 3.1 Start geth
   ### Первый запуск, требует создания аккаунта и инициализации сети
- создать аккаунт майнера

    `geth account new --datadir <path-to-data-directory>`
- иницализация сети, первичным блоком

    `geth -datadir <path-to-data-directory> init <path-to-genesis-block>`
    где `genesis-block` это json файл:
    ```
    {
        "config": {
            "chainId": 15,
            "homesteadBlock": 0,
            "eip155Block": 0,
            "eip158Block": 0
        },
        "difficulty": "0x400",
        "gasLimit": "0x2100000",
    }
    ```
    где, chainId == networkid при компиляции контракта

- запуск geth

      geth --datadir=<path-to-data-directory> --rpc --rpcapi="db,eth,net,web3,personal,web3" --rpccorsdomain="*" --networkid 15 --minerthreads 1

## Step 3.2 Start Ganache - если это не geth
Запустить Ganache GUI client.

## (Не обязательно) Step 4. Compile & Deploy Smart Contract (в репозитории уже скомпилированные лежа, и перекомпилияции требует только если меняется smart contract)
`$ truffle migrate --reset`

## Step 5. Configure Metamask
Настроить кошелек на локальную сеть geth http://127.0.0.1:8545 или Ganache RPC SERVER http://127.0.0.1:7545 в зависимости от п.3

## Step 6. Run the FrontEnd Application
`$ npm run dev`
http://localhost:3000
