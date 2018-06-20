// Контракт для услуг на площадки SitisPlaceMarket
pragma solidity ^0.4.17;

contract SitisPlaceMarket {
    // услуга/товар
    struct Service {
        uint id;
        string serviceHash;
        // uint timestamp;
        uint amount;
        address serviceOwner;
        bool closed;
    }
    // купленные услуги
    struct purchasedService {
        uint id;
        uint serviceId;
        // uint timestamp;
        uint cnt;
        address buyer;
        bool closed;
    }
    // маппинг услуг
    mapping(uint => Service) public services;
    uint public serviceCount;

    // маппинг покупок
    mapping(uint => purchasedService) public purchases;
    uint public purchasesCount;

    event buyServiceEvent (
        address indexed _buyerAddresss,
        uint _purchaseId
    );
    // маппинг покупок по покупателю (адрес покупателя => id покупки)
    // mapping(address => uint) public buyerPurchases;

    function createService (
        string _serviceHash,
        uint _amount
    ) public
        returns (uint serviceId) {
        serviceCount ++;
        Service storage c = services[serviceCount];
        c.id = serviceCount;
        // c.timestamp = now;
        c.amount = _amount;
        c.serviceHash = _serviceHash;
        c.closed = false;
        c.serviceOwner = msg.sender;
        services[serviceCount] = c;
        return serviceCount;
    }
    // закрыть услугу
    function closeService (
        uint _serviceId
    ) public
        returns (uint serviceId) {
        Service storage c = services[_serviceId];
        require(msg.sender == c.serviceOwner);
        c.closed = true;
        services[_serviceId] = c;
        return serviceCount;
    }
    // купить услугу
    function buyService (
        uint _serviceId,
        uint _cnt
    ) public
        returns (uint purchasesId) {
        Service storage c = services[_serviceId];
        require(c.id >= 0);
        require(c.closed == false);
        purchasesCount ++;
        purchasedService storage pc = purchases[purchasesCount];
        pc.serviceId = _serviceId;
        // pc.timestamp = now;
        pc.cnt = _cnt;
        pc.buyer = msg.sender;
        pc.closed = false;
        purchases[purchasesCount] = pc;
        buyServiceEvent(msg.sender, purchasesCount);
        return purchasesCount;
    }
}