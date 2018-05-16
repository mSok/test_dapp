pragma solidity ^0.4.17;

contract Contracts {
    // Model a Candidate
    struct Contract {
        uint id;
        string contractNum;
        string description;
        uint timestamp;
        uint amount;
        address contractAddress;
        ContractRows[] crows;
    }

    struct ContractRows {
        uint id;
        string article;
        uint amount;
    }
    Contract[] public contracts;          // All contracts
    mapping(uint => Contract) public contractById;

    constructor () public {

    }
    // Create an auction, transfer the item to this contract, activate the auction
    function createContract (
        string _contractNum,
        string _description,
        uint _amount,
        address _contractAddress
    ) public
        returns (uint contractId) {
        contractId = contracts.length++;
        Contract c = contracts[contractId];
        c.contractNum = _contractNum;
        c.description = _description;
        c.timestamp =  now;
        c.amount = _amount;
        c.contractAddress = _contractAddress;

        return contractId;
    }

    function getContract(uint idx) public returns (
        string,
        string,
        uint,
        uint,
        address) {
        Contract c = contracts[idx];

        return (c.contractNum,
                c.description,
                c.timestamp,
                c.amount,
                c.contractAddress
        );
    }

    function getContractCount() public returns (uint) {
        return contracts.length;
    }


}
