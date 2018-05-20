pragma solidity ^0.4.17;

contract Contracts {

    address Admin;
    // Model a Contract
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
    // Contract[] public contracts;          // All contracts
    mapping(uint => Contract) public contracts;
    uint public contractCount;

    event on_success_buy (
        string _contractNum,
        uint _id
    );

    constructor () public {
        Admin = msg.sender;
        createContract("0001", "первый контракт", 100);
        createContract("0002", "второй контракт", 300);
        createContract("0003", "третий контракт", 300);
    }
    // Create an auction, transfer the item to this contract, activate the auction
    function createContract (
        string _contractNum,
        string _description,
        uint _amount
    ) public
        returns (uint contractId) {
        contractCount ++;
        Contract storage c = contracts[contractCount];
        c.id = contractCount;
        c.contractNum = _contractNum;
        c.description = _description;
        c.timestamp = now;
        c.amount = _amount;
        c.contractAddress = msg.sender;

        contracts[contractCount] = c;
        return contractCount;
    }

    function getContract(uint idx) public constant returns (
        string,
        string,
        uint,
        uint,
        address) {
        return (
            contracts[idx].contractNum,
            contracts[idx].description,
            contracts[idx].timestamp,
            contracts[idx].amount,
            contracts[idx].contractAddress
        );
    }

    // function getContractCount() public returns (uint) {
    //     return contractCount;
    // }

    function updateContract(
        uint idx,
        string _contractNum,
        string _description,
        uint _amount
        ) public returns (bool)
    {
        Contract storage c = contracts[idx];
        require (msg.sender == c.contractAddress, "Only owner can change");

        c.contractNum = _contractNum;
        c.description = _description;
        c.timestamp = now;
        c.amount = _amount;
        c.contractAddress = msg.sender;
        return true;
    }

    function buyContract(uint idx) public  payable returns (bool) {
        Contract storage c = contracts[idx];
        
        address payee = msg.sender;
        uint256 payment = c.amount;

        require(payment != 0);
        require(address(this).balance >= payment);

        payee.transfer(payment);
        c.contractAddress = msg.sender;
        emit on_success_buy(c.contractNum, idx);
        return true;
    }
}
