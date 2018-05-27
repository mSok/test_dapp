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
        bool closed;
    }

    struct ContractRate {
        uint id;
        uint contractId;
        address rateAddress;
        uint amount;
        bool approve;
    }

    struct Account {
        address accountAddress;
        string email;
    }
    // change Account event
    event accountEvent (
        address indexed _accountAddresss,
        string _email
    );

    // Contract[] public contracts;          // All contracts
    mapping(uint => Contract) public contracts;
    mapping(address => Account) public accounts;
    // все ставки по контракту
    mapping (uint => uint[]) public rates;
    // mapping(uint => ContractRate) public rates;
    // cтавки
    mapping(uint => ContractRate) public contractRates;
    // была ли ставка по контракту
    mapping(uint => bool) public isRatesContract;
    // Количество ставок
    mapping(uint => uint) public contractRatesCnt;

    uint public contractCount;
    uint public rateCount;

    constructor ()  {
        Admin = msg.sender;
        // default debug;
        setAccount("MainNetwork");
        createContract("0001", "первый контракт", 100);
        createContract("0002", "второй контракт", 300);
        setContractRate(1, 110);
        setContractRate(2, 310);

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
        c.closed = false;
        c.contractAddress = msg.sender;

        contracts[contractCount] = c;
        return contractCount;
    }
    function setAccount (
        string _email
    ) public {
        Account storage acc = accounts[msg.sender];
        acc.email = _email;
        acc.accountAddress = msg.sender;
        accounts[msg.sender] = acc;
        // trigger voted event
        accountEvent(msg.sender, _email);
    }

    function setContractRate (
        uint _contractId,
        uint _amount
    ) public {
        require (_contractId <= contractCount, "Not found contract");
        rateCount ++;

        ContractRate storage cr = contractRates[rateCount];
        cr.id = rateCount;
        cr.contractId = _contractId;
        cr.amount = _amount;
        cr.rateAddress = msg.sender;
        if (!isRatesContract[_contractId]){
            contractRatesCnt[_contractId]++;
            // добавляем id ставки в контракт;
            rates[_contractId].push(rateCount);
            contractRates[rateCount] = cr;
        } else {
            isRatesContract[_contractId] = true;
        }
    }

    function approveRate(
        uint _contractId,
        uint _rateId,
        bool _rateRes
    ) public {
        require (_contractId <= contractCount, "Not found contract");
        Contract storage c = contracts[_contractId];
        require (c.closed == false, "Contract is closed");
        require (msg.sender == c.contractAddress, "Only owner can change");
        ContractRate storage cr = contractRates[_rateId];
        require (cr.amount > 0, "Rate invalid or not found");
        require (cr.contractId == c.id, "Rate invalid or not found");
        cr.approve = _rateRes;
        if (_rateRes == true){
            c.closed = true;
        }
    }
    // сколько ставок у контракта
    function getContractRateCount(uint _contractId) public view returns(uint length) {
        return rates[_contractId].length;
    }

    function getContractRateAtIndex(uint _contractId, uint index) public view returns(
        uint id,
        uint contractId,
        address rateAddress,
        uint amount,
        bool approve
    ) {
        uint rateid = rates[_contractId][index];
        ContractRate storage cr = contractRates[rateid];
        return (
            cr.id,
            cr.contractId,
            cr.rateAddress,
            cr.amount,
            cr.approve
        );
    }
    
    function getContract(uint idx) public view returns (
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

    function getContractCount() public view returns (uint) {
        return contractCount;
    }

    function updateContract(
        uint idx,
        string _contractNum,
        string _description,
        uint _amount,
        bool _closed
        ) public returns (bool)
    {
        Contract storage c = contracts[idx];
        require (msg.sender == c.contractAddress, "Only owner can change");

        c.contractNum = _contractNum;
        c.description = _description;
        c.timestamp = now;
        c.amount = _amount;
        c.closed = _closed;
        c.contractAddress = msg.sender;
        return true;
    }

    // function buyContract(uint idx) public returns (bool) {
    //     Contract storage c = contracts[idx];
    //     c.contractAddress = msg.sender;
    //     return true;
    // }
}
