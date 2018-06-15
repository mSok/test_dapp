// Майним только если нужно
// https://ethereum.stackexchange.com/questions/3151/how-to-make-miner-to-mine-only-when-there-are-pending-transactions
var mining_threads = 1
var txBlock = 0

function checkWork() {
if (eth.getBlock("pending").transactions.length > 0) {
    txBlock = eth.getBlock("pending").number
    if (eth.mining) return;
    console.log("  Transactions pending. Mining...");
    miner.start(mining_threads)
    while (eth.getBlock("latest").number < txBlock + 12) {
      if (eth.getBlock("pending").transactions.length > 0) txBlock = eth.getBlock("pending").number;
        }
    console.log("  12 confirmations achieved; mining stopped.");
    miner.stop()
}
else {
    miner.stop()
     }
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });

checkWork();