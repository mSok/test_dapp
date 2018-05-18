# Тестируем blockchain app

- Для тестов необходим тестовый аккаунты ganache  http://truffleframework.com/ganache/
- NPM: https://nodejs.org
- Metamask: https://metamask.io/


## Step 1. Clone the project
`git clone https://github.com/mSok/test_dapp.git`

## Step 2. Install dependencies
```
$ cd test_dapp
$ npm install
```
## Step 3. Start Ganache
Запустить Ganache GUI client.

## (Не обязательно) Step 4. Compile & Deploy Smart Contract (в репозитории уже скомпилированные лежа, и перекомпилияции требует только если меняется smart contract)
`$ truffle migrate --reset`

## Step 5. Configure Metamask
Настроить кошелек на локальную сеть Ganache RPC SERVER HTTP://127.0.0.1:7545

## Step 6. Run the FrontEnd Application
`$ npm run dev`
http://localhost:3000

