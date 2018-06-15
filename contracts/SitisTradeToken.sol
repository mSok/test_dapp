pragma solidity ^0.4.18;
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
contract SitisTradeToken is MintableToken {
    string public constant name = "Sitis Trade Token";
    string public constant symbol = "STT";
    uint8 public constant decimals = 18;
}