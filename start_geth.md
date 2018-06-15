
* инициалиация сети

```geth -datadir ~/eth/chaindata/ init ~/code/test_dapp/genesis.json```
* запуск geth

```geth --datadir=~/eth/chaindata --rpc --rpcapi="db,eth,net,miner,web3,personal,web3" --syncmode "fast" --rpcaddr "0.0.0.0" --rpccorsdomain="*" --networkid 15 --minerthreads 1```
* запуск майнинга по требованию

```geth attach /home/sok/eth/chaindata/geth.ipc --preload "/home/sok/code/test_dapp/mineWhenNeeded.js"```