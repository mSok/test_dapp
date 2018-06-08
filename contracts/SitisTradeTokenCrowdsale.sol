pragma solidity ^0.4.19;

import './SitisTradeToken.sol';
import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';


contract SitisTradeTokenCrowdsale is MintedCrowdsale {
    function SitisTradeTokenCrowdsale
        (
        uint256 _rate,
        address _wallet,
        MintableToken _token
        ) Crowdsale(_rate, _wallet, _token)
        public {

        }
    
}
