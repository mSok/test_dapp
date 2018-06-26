// Контракт для услуг на площадки SitisPlaceMarket
pragma solidity ^0.4.17;

contract SitisPlaceMarket {

    // Address where funds are collected
    address public wallet;
    // услуга/товар
    struct Service {
        uint256 id;
        bytes32 serviceHash;
        uint256 amount;
        address serviceOwner;
        bool closed;
    }
    // купленные услуги
    struct purchasedService {
        uint256 id;
        uint256 serviceId;
        uint256 cnt;
        address buyer;
        bool closed;  // совершенные
    }
    // маппинг услуг
    mapping(uint256 => Service) public services;
    mapping(bytes32 => Service) public hashServices;
    uint256 public serviceCount;

    // маппинг покупок
    mapping(uint256 => purchasedService) public purchases;
    uint256 public purchasesCount;

    event buyServiceEvent (
        address indexed buyerAddresss,
        uint256 purchaseId,
        address indexed serviceOwner,
        uint256 value
    );
    event serviceCreateEvent (
        bytes32 indexed serviceHash,
        uint256 serviceId,
        uint256 amount,
        address serviceOwner
    );
    event serviceCloseEvent (
        uint256 serviceId
    );
    event purchaseCloseEvent(
        uint256 _purchaseId,
        uint256 _amount
    );
    // маппинг покупок по покупателю (адрес покупателя => id покупки)
    // mapping(address => uint) public buyerPurchases;

    function createService (
        bytes32 _serviceHash,
        uint256 _amount
    ) public
        returns (uint256 serviceId) {
        serviceCount ++;
        Service storage c = services[serviceCount];
        c.id = serviceCount;
        c.amount = _amount;  // стоимость за единицу
        c.serviceHash = _serviceHash;
        c.closed = false;
        c.serviceOwner = msg.sender;
        services[serviceCount] = c;
        hashServices[_serviceHash] = c;
        emit serviceCreateEvent(
            _serviceHash,
            serviceCount,
            _amount,
            msg.sender
        );
        return serviceCount;
    }
    // закрыть услугу, больше не предоставлять.
    function closeService (
        uint256 _serviceId
    ) public
        returns (uint256 serviceId) {
        Service storage c = services[_serviceId];
        require(msg.sender == c.serviceOwner);
        c.closed = true;
        services[_serviceId] = c;
        hashServices[c.serviceHash] = c;
        emit serviceCloseEvent(
            _serviceId
        );
        return serviceCount;
    }
    // закрыть покупку, перечислить средства продавцу.
    function closePurchase (
        uint256 _purchaseId
    ) public {
        purchasedService storage pc = purchases[_purchaseId];
        require(msg.sender == pc.buyer);
        // require(pc.id != 0);
        Service storage c = services[pc.serviceId];
        uint256 amount = pc.cnt * c.amount;
        address(c.serviceOwner).transfer(amount);
        pc.closed = true;
        purchases[_purchaseId] = pc;
        emit purchaseCloseEvent(
            _purchaseId,
            amount
        );
    }
    // купить услугу
    function buyService (
        uint256 _serviceId,
        uint256 _cnt
    ) payable public 
        returns (uint256 purchasesId) {
        Service storage c = services[_serviceId];
        _preValidatePurchase(
            c.serviceOwner,
            msg.value,
            c.id,
            _cnt
        );
        require(c.closed == false);
        purchasesCount ++;
        purchasedService storage pc = purchases[purchasesCount];
        pc.serviceId = _serviceId;
        pc.id = purchasesCount;
        pc.cnt = _cnt;
        pc.buyer = msg.sender;
        pc.closed = false;
        purchases[purchasesCount] = pc;


        emit buyServiceEvent(
            msg.sender,
            purchasesCount,
            c.serviceOwner,
            msg.value
        );
        return purchasesCount;
    }

    // validate purchase
    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount,
        uint256 _serviceId,
        uint256 _purchasesCount
    )
        internal
    {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
        require(_serviceId != 0);
        Service storage c = services[_serviceId];
        require(c.id != 0);
        require(_purchasesCount != 0);
        require(c.amount * _purchasesCount <= _weiAmount);
    }
}